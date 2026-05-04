# MoneyMind - Development Setup Guide

This guide will help you set up the MoneyMind Expense Tracker for local development.

## Quick Start

### 1. Setup Backend

```bash
cd Backend/moneymind

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from root .env.example if needed)
# Update database credentials if using different MySQL setup

# Run migrations
python manage.py migrate

# Start backend server
python manage.py runserver
```

Backend will run on: `http://127.0.0.1:8000`

### 2. Setup Frontend

```bash
cd Frontend/moneymind-frontend

# Install dependencies
npm install

# Create .env file
# The .env file should have:
# REACT_APP_API_BASE_URL=http://127.0.0.1:8000

# Start development server
npm start
```

Frontend will run on: `http://localhost:3000`

## Environment Configuration

### .env (Root Directory)
Located at: `Expense Tracker Project/.env`

For local development, you can use:
```bash
DEBUG=True
SECRET_KEY=your-local-dev-key
ALLOWED_HOSTS=localhost,127.0.0.1

DB_ENGINE=django.db.backends.mysql
DB_NAME=moneymind_db
DB_USER=root
DB_PASSWORD=admin123
DB_HOST=localhost
DB_PORT=3306

REACT_APP_API_BASE_URL=http://127.0.0.1:8000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ENVIRONMENT=development
```

### Frontend .env
Located at: `Frontend/moneymind-frontend/.env`

```bash
REACT_APP_API_BASE_URL=http://127.0.0.1:8000
```

## Database Setup

### Create MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE moneymind_db;

# Exit
EXIT;
```

## Useful Commands

### Backend

```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Create migrations for changes
python manage.py makemigrations

# Access admin panel
# Go to http://127.0.0.1:8000/admin

# Install new package
pip install package-name

# Update requirements.txt
pip freeze > requirements.txt

# Stop server
# Press Ctrl+C
```

### Frontend

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Install new package
npm install package-name

# Remove package
npm uninstall package-name

# Stop server
# Press Ctrl+C
```

## API Endpoints

All API endpoints are centralized in: `Frontend/moneymind-frontend/src/config/api.js`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/login/` | POST | User login |
| `/api/register/` | POST | User registration |
| `/api/expenses/` | GET/POST | Get/Add expenses |
| `/api/delete-expense/{id}/` | DELETE | Delete expense |
| `/api/dashboard-summary/` | GET | Dashboard data |
| `/api/analytics/` | GET | Analytics data |
| `/api/ai-analysis/` | POST | AI analysis |

## Troubleshooting

### Port Already in Use

**Backend (Port 8000):**
```bash
# Find process using port 8000
netstat -ano | findstr :8000
# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Frontend (Port 3000):**
```bash
# Run on different port
npm start -- --port 3001
```

### Database Connection Error

1. Ensure MySQL is running
2. Check credentials in .env file
3. Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`
4. Check error logs from `python manage.py runserver`

### Module Not Found Error

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Error

1. Check `CORS_ALLOWED_ORIGINS` in backend .env
2. Ensure `REACT_APP_API_BASE_URL` matches backend URL in frontend .env
3. Backend might need restart after .env changes

## Testing API

### Using curl

```bash
# Register
curl -X POST http://127.0.0.1:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"name":"User","email":"user@example.com","password":"pass123"}'

# Login
curl -X POST http://127.0.0.1:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Get expenses (replace TOKEN with actual token)
curl -X GET http://127.0.0.1:8000/api/expenses/ \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create requests for each API endpoint
3. Set `Authorization: Bearer TOKEN` header for protected routes
4. Test locally on `http://127.0.0.1:8000`

## Project Structure

```
Expense Tracker Project/
├── .env                          # Environment variables
├── .env.example                  # Example env
├── .gitignore                    # Git ignore rules
├── DEPLOYMENT_GUIDE.md           # Production deployment
├── SETUP_GUIDE.md               # This file
├── Backend/
│   └── moneymind/
│       ├── requirements.txt      # Python dependencies
│       ├── manage.py
│       ├── venv/               # Virtual environment
│       ├── moneymind/
│       │   ├── settings.py      # Django settings (uses .env)
│       │   ├── urls.py
│       │   └── wsgi.py
│       └── finance/             # Main app
│           ├── models.py
│           ├── views.py
│           ├── serializers.py
│           ├── urls.py
│           └── migrations/
└── Frontend/
    └── moneymind-frontend/
        ├── .env                  # Frontend env
        ├── package.json
        ├── public/
        └── src/
            ├── Components/       # React components
            ├── config/
            │   └── api.js       # Centralized API config
            ├── App.js
            └── index.js
```

## Notes

- **Never commit .env file** - Use .env.example as template
- **API calls use config/api.js** - Don't hardcode URLs
- **Environment variables** - Always use for sensitive data
- **CORS issues** - Check both frontend and backend .env
- **Database** - Migrations auto-run on backend start

## Next Steps

1. Complete the setup above
2. Create a test user via frontend or admin panel
3. Add some test expenses
4. Explore the dashboard and charts
5. Check backend logs for any issues

---

For production deployment, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
