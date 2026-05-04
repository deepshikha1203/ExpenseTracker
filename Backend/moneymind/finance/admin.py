from django.contrib import admin
from .models import Expense, Budget

class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('category', 'amount', 'date')

admin.site.register(Expense, ExpenseAdmin)
admin.site.register(Budget)