from collections import defaultdict
from datetime import date, timedelta

import google.generativeai as genai
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core import signing
from django.db import IntegrityError
from django.db.models import Count, Max, Sum
from django.db.models.functions import ExtractDay, ExtractMonth
from django.utils.dateparse import parse_date
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Expense
from .serializers import ExpenseSerializer


genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel(settings.GEMINI_MODEL)


def _make_auth_token(user):
    return signing.TimestampSigner().sign(str(user.id))


def _get_user_from_request(request):
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return None, Response({"error": "Login required"}, status=401)

    try:
        user_id = signing.TimestampSigner().unsign(
            auth_header.removeprefix("Bearer ").strip(),
            max_age=60 * 60 * 24 * 7,
        )
        return User.objects.get(id=user_id), None
    except (signing.BadSignature, signing.SignatureExpired):
        return None, Response({"error": "Session expired. Please login again."}, status=401)
    except User.DoesNotExist:
        return None, Response({"error": "User not found"}, status=404)


def _expense_queryset(user):
    return Expense.objects.filter(user=user).order_by("-date", "-id")


def _serialize_expenses(expenses):
    return ExpenseSerializer(expenses, many=True).data


def _money(value):
    return f"Rs. {float(value):.2f}"


def _find_category_in_question(question, category_totals):
    normalized_question = question.lower()

    for category in category_totals:
        if category.lower() in normalized_question:
            return category

    aliases = {
        "food": ["meal", "meals", "restaurant", "restaurants", "snack", "snacks"],
        "travel": ["transport", "trip", "bus", "cab", "taxi", "fuel"],
        "shopping": ["shop", "clothes", "clothing"],
        "bills": ["bill", "electricity", "rent", "recharge"],
        "stationary": ["stationery", "pen", "book", "books", "notebook"],
    }

    for category in category_totals:
        words = aliases.get(category.lower(), [])
        if any(word in normalized_question for word in words):
            return category

    return None


def _direct_finance_answer(question, total, category_totals):
    normalized_question = question.lower()
    matched_category = _find_category_in_question(question, category_totals)

    if matched_category:
        amount = category_totals[matched_category]
        share = (amount / total * 100) if total else 0
        return (
            f"Your {matched_category} expense is {_money(amount)}. "
            f"It is {share:.1f}% of your total spending."
        )

    category_words = ["food", "travel", "shopping", "bills", "stationary", "stationery"]
    if any(word in normalized_question for word in category_words):
        return "I could not find any expense saved for that category yet."

    if "total" in normalized_question:
        return f"Your total recorded expense is {_money(total)}."

    if "monthly" in normalized_question or "report" in normalized_question:
        if not category_totals:
            return f"Your current monthly expense is {_money(total)}."

        top_category, top_amount = max(category_totals.items(), key=lambda item: item[1])
        return (
            f"Your current recorded total is {_money(total)}. "
            f"The highest spending category is {top_category} at {_money(top_amount)}."
        )

    return None


def _fallback_finance_answer(question, total, category_totals):
    direct_answer = _direct_finance_answer(question, total, category_totals)
    if direct_answer:
        return direct_answer

    if not category_totals:
        return "No expense data is available yet. Add a few transactions first, then I can analyze your spending."

    top_category, top_amount = max(category_totals.items(), key=lambda item: item[1])
    return (
        f"You have spent {_money(total)} in total. "
        f"Your top category is {top_category} with {_money(top_amount)}. "
        "Try reviewing this category first if you want to reduce spending."
    )


@api_view(["GET", "POST"])
def get_expenses(request):
    user, error = _get_user_from_request(request)
    if error:
        return error

    if request.method == "GET":
        expenses = _expense_queryset(user)

        start = request.query_params.get("start")
        end = request.query_params.get("end")
        if start:
            expenses = expenses.filter(date__gte=parse_date(start))
        if end:
            expenses = expenses.filter(date__lte=parse_date(end))

        return Response(_serialize_expenses(expenses))

    serializer = ExpenseSerializer(data=request.data)
    if serializer.is_valid():
        expense = serializer.save(user=user)
        return Response(ExpenseSerializer(expense).data, status=201)

    return Response(serializer.errors, status=400)


@api_view(["GET"])
def dashboard_summary(request):
    user, error = _get_user_from_request(request)
    if error:
        return error

    today = date.today()
    recent_expenses = _expense_queryset(user)[:5]

    total_expenses = Expense.objects.filter(user=user).aggregate(total=Sum("amount"))[
        "total"
    ] or 0
    total_transactions = Expense.objects.filter(user=user).aggregate(
        count=Count("id")
    )["count"] or 0
    monthly_expenses = Expense.objects.filter(
        user=user,
        date__year=today.year,
        date__month=today.month,
    ).aggregate(total=Sum("amount"))["total"] or 0

    category_totals = (
        Expense.objects.filter(user=user)
        .values("category")
        .annotate(total=Sum("amount"))
        .order_by("-total")
    )

    latest_expense_date = Expense.objects.filter(user=user).aggregate(
        latest_date=Max("date")
    )["latest_date"]
    chart_end_date = latest_expense_date or today
    chart_start_date = chart_end_date - timedelta(days=30)

    daily_totals = (
        Expense.objects.filter(
            user=user,
            date__gte=chart_start_date,
            date__lte=chart_end_date,
        )
        .values("date")
        .annotate(total=Sum("amount"))
        .order_by("date")
    )

    return Response(
        {
            "totalExpenses": total_expenses,
            "monthlyExpenses": monthly_expenses,
            "totalTransactions": total_transactions,
            "categoryExpenses": list(category_totals),
            "recentTransactions": _serialize_expenses(recent_expenses),
            "monthlyChart": [
                {"date": item["date"].strftime("%b %d"), "amount": item["total"]}
                for item in daily_totals
            ],
        }
    )


@api_view(["GET"])
def analytics(request):
    user, error = _get_user_from_request(request)
    if error:
        return error

    today = date.today()
    year = int(request.query_params.get("year", today.year))
    month = int(request.query_params.get("month", today.month))
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)

    monthly = (
        Expense.objects.filter(user=user, date__year=year, date__month=month)
        .annotate(day=ExtractDay("date"))
        .values("day")
        .annotate(total=Sum("amount"))
        .order_by("day")
    )

    monthly_by_category = (
        Expense.objects.filter(user=user, date__year=year, date__month=month)
        .annotate(day=ExtractDay("date"))
        .values("day", "category")
        .annotate(total=Sum("amount"))
        .order_by("day", "-total")
    )

    weekly = (
        Expense.objects.filter(user=user, date__gte=week_start, date__lte=week_end)
        .values("date")
        .annotate(total=Sum("amount"))
        .order_by("date")
    )

    yearly = (
        Expense.objects.filter(user=user, date__year=year)
        .annotate(month=ExtractMonth("date"))
        .values("month")
        .annotate(total=Sum("amount"))
        .order_by("month")
    )

    categories = (
        Expense.objects.filter(user=user)
        .values("category")
        .annotate(total=Sum("amount"))
        .order_by("-total")
    )

    return Response(
        {
            "monthly": list(monthly),
            "monthlyByCategory": list(monthly_by_category),
            "weekly": [
                {"date": item["date"].isoformat(), "total": item["total"]}
                for item in weekly
            ],
            "yearly": list(yearly),
            "categories": list(categories),
        }
    )


@api_view(["POST"])
def ai_analysis(request):
    user, error = _get_user_from_request(request)
    if error:
        return error

    question = request.data.get("question") or request.data.get("query") or ""
    expenses = Expense.objects.filter(user=user)

    if not expenses.exists():
        return Response({"answer": "No expenses found. Please add some expenses first."})

    total = sum(float(e.amount) for e in expenses)
    category_totals = defaultdict(float)
    for expense in expenses:
        category_totals[expense.category] += float(expense.amount)

    category_summary = "\n".join(
        [f"{category}: Rs. {amount}" for category, amount in category_totals.items()]
    )
    status = "high spending" if total > 5000 else "moderate spending" if total > 2000 else "low spending"
    direct_answer = _direct_finance_answer(question, total, category_totals)

    if direct_answer:
        return Response({"answer": direct_answer})

    prompt = f"""
You are a smart personal finance assistant.

User total expense: Rs. {total}
Spending level: {status}

Category-wise expenses:
{category_summary}

User question: {question}

Give short bullet points with practical money-saving tips.
"""

    try:
        response = model.generate_content(prompt)
        answer = getattr(response, "text", "").strip()
        if not answer:
            answer = _fallback_finance_answer(question, total, category_totals)
        return Response({"answer": answer})
    except Exception as exc:
        return Response(
            {
                "answer": _fallback_finance_answer(question, total, category_totals),
                "warning": f"Gemini request failed: {str(exc)}",
            }
        )


@api_view(["POST"])
def register_user(request):
    try:
        name = (request.data.get("name") or request.data.get("username") or "").strip()
        email = (request.data.get("email") or "").strip().lower()
        password = request.data.get("password")

        if not name or not email or not password:
            return Response({"error": "All fields required"}, status=400)

        if (
            User.objects.filter(username__iexact=email).exists()
            or User.objects.filter(email__iexact=email).exists()
        ):
            return Response({"error": "User already exists"}, status=400)

        try:
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=name,
            )
        except IntegrityError:
            return Response({"error": "User already exists"}, status=400)

        return Response(
            {
                "message": "Registration successful",
                "email": user.email,
                "name": user.first_name,
                "token": _make_auth_token(user),
            },
            status=201,
        )
    except Exception as exc:
        return Response({"error": str(exc)}, status=500)


@api_view(["POST"])
def login_user(request):
    email = (request.data.get("email") or "").strip().lower()
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "All fields required"}, status=400)

    user = authenticate(username=email, password=password)
    if user is None:
        return Response({"error": "Invalid email or password"}, status=401)

    return Response(
        {
            "message": "Login successful",
            "email": user.email,
            "name": user.first_name or user.email,
            "token": _make_auth_token(user),
        }
    )


@api_view(["DELETE"])
def delete_expense(request, id):
    user, error = _get_user_from_request(request)
    if error:
        return error

    try:
        expense = Expense.objects.get(id=id, user=user)
    except Expense.DoesNotExist:
        return Response({"error": "Expense not found"}, status=404)

    expense.delete()
    return Response({"message": "Deleted successfully"})
