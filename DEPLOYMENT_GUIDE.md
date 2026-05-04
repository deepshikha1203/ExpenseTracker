# MoneyMind Expense Tracker - Deployment Guide

## Prerequisites
- Python 3.8+
- Node.js 14+
- MySQL 5.7+
- Git

## Project Structure
```
Expense Tracker Project/
├── .env                    # Environment variables (create this)
├── .env.example           # Example env file
├── .gitignore             # Git ignore rules
├── Backend/
│   └── moneymind/
│       ├── requirements.txt
│       ├── manage.py
│       └── moneymind/
│           └── settings.py
└── Frontend/
    └── moneymind-frontend/
        ├── .env
        ├── .env.example
        └── src/
            └── config/
                └── api.js
```

## Setup Instructions

### 1. Backend Setup

#### Clone and Navigate
```bash
cd Backend/moneymind
```

#### Create Virtual Environment
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On Linux/Mac
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the root project directory:
```bash
# Django Settings
DEBUG=False
SECRET_KEY=your-secure-secret-key-here-generate-a-new-one
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Database Configuration
DB_ENGINE=django.db.backends.mysql
DB_NAME=moneymind_db
DB_USER=root
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=3306

# API Configuration
REACT_APP_API_BASE_URL=http://yourdomain.com

# Gemini AI Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://yourdomain.com,https://yourdomain.com

# Environment
ENVIRONMENT=production
```

#### Create Database
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE moneymind_db;
EXIT;
```

#### Run Migrations
```bash
python manage.py migrate
```

#### Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

#### Run Backend
```bash
python manage.py runserver 0.0.0.0:8000
```

### 2. Frontend Setup

#### Navigate to Frontend
```bash
cd Frontend/moneymind-frontend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment
Create a `.env` file in `Frontend/moneymind-frontend/`:
```bash
REACT_APP_API_BASE_URL=http://yourdomain.com
```

#### Run Frontend (Development)
```bash
npm start
```

#### Build Frontend (Production)
```bash
npm run build
```

## Production Deployment

### Using Docker (Recommended)

#### Backend Dockerfile
Create `Backend/Dockerfile`:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "moneymind.wsgi:application"]
```

#### Frontend Dockerfile
Create `Frontend/Dockerfile`:
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
CMD ["serve", "-s", "build", "-l", "3000"]
```

### Deploy to Heroku

#### Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

#### Create Heroku Apps
```bash
heroku create moneymind-backend
heroku create moneymind-frontend
```

#### Set Environment Variables
```bash
heroku config:set -a moneymind-backend DEBUG=False
heroku config:set -a moneymind-backend SECRET_KEY=your-secret-key
heroku config:set -a moneymind-backend DB_NAME=moneymind_db
# ... set other variables
```

#### Deploy
```bash
# Backend
cd Backend/moneymind
git push heroku main

# Frontend
cd Frontend/moneymind-frontend
git push heroku main
```

### Deploy to AWS/DigitalOcean

#### Using Gunicorn + Nginx

**Backend:**
```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 moneymind.wsgi:application
```

**Frontend:**
```bash
# Build React app
npm run build

# Serve static files with Nginx or Node
npx serve -s build -l 3000
```

## Security Checklist

- [ ] Change `SECRET_KEY` to a new secure value
- [ ] Set `DEBUG=False` in production
- [ ] Update `ALLOWED_HOSTS` with your domain
- [ ] Configure proper `CORS_ALLOWED_ORIGINS`
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/SSL
- [ ] Setup database backups
- [ ] Configure firewall rules
- [ ] Use strong database password
- [ ] Setup monitoring and logging
- [ ] Enable CSRF protection
- [ ] Setup rate limiting
- [ ] Configure Content Security Policy

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DEBUG` | Django debug mode | `False` |
| `SECRET_KEY` | Django secret key | `your-secret` |
| `ALLOWED_HOSTS` | Allowed hostnames | `localhost,yourdomain.com` |
| `DB_NAME` | Database name | `moneymind_db` |
| `DB_USER` | Database user | `root` |
| `DB_PASSWORD` | Database password | `secure-password` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `3306` |
| `GEMINI_API_KEY` | Google Gemini API key | `your-api-key` |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://yourdomain.com` |
| `REACT_APP_API_BASE_URL` | Backend API URL | `http://yourdomain.com` |

## Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p
# Verify DB_HOST, DB_USER, DB_PASSWORD in .env
```

### API Connection Error
```bash
# Ensure backend is running
# Check REACT_APP_API_BASE_URL in frontend .env
# Verify CORS_ALLOWED_ORIGINS in backend .env
```

### Missing Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

## Monitoring & Maintenance

- Setup error logging (Sentry, DataDog)
- Configure database backups
- Monitor API performance
- Setup uptime monitoring
- Regular security updates
- Database optimization

## Support

For issues or questions, please check:
1. Backend logs: `python manage.py runserver`
2. Frontend logs: Browser console
3. Database logs: MySQL error log
