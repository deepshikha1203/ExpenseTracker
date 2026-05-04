from django.urls import path

from . import views


urlpatterns = [
    path("expenses/", views.get_expenses),
    path("dashboard-summary/", views.dashboard_summary),
    path("analytics/", views.analytics),
    path("delete-expense/<int:id>/", views.delete_expense),
    path("ai-analysis/", views.ai_analysis),
    path("login/", views.login_user),
    path("register/", views.register_user),
]
