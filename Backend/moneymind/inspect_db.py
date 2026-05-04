import os
import sqlite3

path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')
print('db file', path, os.path.exists(path))
conn = sqlite3.connect(path)
cur = conn.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cur.fetchall()
print('tables:', tables)
cur.execute("SELECT count(*) FROM sqlite_master WHERE name='auth_user'")
auth_exists = cur.fetchone()[0]
print('auth_user exists:', auth_exists)
if auth_exists:
    cur.execute('SELECT count(*) FROM auth_user')
    print('users:', cur.fetchone()[0])
conn.close()
