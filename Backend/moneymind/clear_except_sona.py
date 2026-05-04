import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'moneymind.settings')

django.setup()
from django.contrib.auth.models import User
from finance.models import Expense, Budget

sona_users = User.objects.filter(first_name__iexact='sona')
print('sona_users count:', sona_users.count())
if not sona_users.exists():
    print('No user named sona found. No changes made.')
    exit(0)

sona_user = sona_users.first()
kept_id = sona_user.id
print('Keeping user:', sona_user.username, sona_user.first_name)

Expense.objects.exclude(user_id=kept_id).delete()
Budget.objects.exclude(user_id=kept_id).delete()

deleted_users = User.objects.exclude(id=kept_id)
count = deleted_users.count()
print('Deleting users count:', count)
deleted_users.delete()

print('Done. Remaining users:', User.objects.count())
print('Remaining expenses:', Expense.objects.count())
print('Remaining budgets:', Budget.objects.count())
