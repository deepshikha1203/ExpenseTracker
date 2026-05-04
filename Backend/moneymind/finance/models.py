from django.db import models
from django.contrib.auth.models import User

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="expenses")
    category = models.CharField(max_length=100)
    amount = models.FloatField()
    description = models.TextField(blank=True, null=True)
    date = models.DateField()

    class Meta:
        indexes = [
            models.Index(fields=["user", "date"], name="expense_user_date_idx"),
            models.Index(fields=["user", "category"], name="expense_user_cat_idx"),
        ]

    def __str__(self):
        return f"{self.category} - {self.amount}"


class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="budgets")
    monthly_limit = models.FloatField()

    def __str__(self):
        return f"{self.user.username} - {self.monthly_limit}"
