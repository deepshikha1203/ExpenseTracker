import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def remove_orphaned_finance_rows(apps, schema_editor):
    Expense = apps.get_model("finance", "Expense")
    Budget = apps.get_model("finance", "Budget")

    Expense.objects.filter(user__isnull=True).delete()
    Budget.objects.filter(user__isnull=True).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("finance", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RunPython(remove_orphaned_finance_rows, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="expense",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="expenses",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="budget",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="budgets",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddIndex(
            model_name="expense",
            index=models.Index(fields=["user", "date"], name="expense_user_date_idx"),
        ),
        migrations.AddIndex(
            model_name="expense",
            index=models.Index(fields=["user", "category"], name="expense_user_cat_idx"),
        ),
    ]
