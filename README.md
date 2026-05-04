# MoneyMind - AI-Powered Expense Tracker

A full-stack expense tracking application with AI-powered financial insights using React, Django, and Google Gemini AI.

![MoneyMind](https://img.shields.io/badge/React-19.2-blue) ![Django](https://img.shields.io/badge/Django-4.2-green) ![MySQL](https://img.shields.io/badge/MySQL-5.7-orange)

## Features

- 💰 **Expense Tracking** - Add, edit, and delete expenses with categories
- 📊 **Analytics Dashboard** - Visual insights with charts and graphs
- 🤖 **AI Assistant** - Ask questions about your spending patterns
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔐 **Secure Authentication** - User authentication with token-based sessions
- 📈 **Monthly Reports** - Detailed expense reports by category
- 🎯 **Budget Tracking** - Track spending trends over time

## Tech Stack

### Frontend
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Backend
- **Django 4.2** - Web framework
- **Django REST Framework** - REST API
- **MySQL** - Database
- **Google Gemini AI** - AI-powered insights
- **django-cors-headers** - CORS handling

## Project Structure

```
Expense Tracker Project/
├── Backend/
│   └── moneymind/          # Django project
│       ├── manage.py
│       ├── requirements.txt
│       └── finance/        # Main app
└── Frontend/
    └── moneymind-frontend/ # React app
        ├── src/
        │   ├── Components/
        │   ├── config/
        │   └── App.js
        └── package.json
```

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- MySQL 5.7+

### Backend Setup

```bash
cd Backend/moneymind

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

Backend: http://127.0.0.1:8000

### Frontend Setup

```bash
cd Frontend/moneymind-frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend: http://localhost:3000

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Django
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=moneymind_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost

# API
REACT_APP_API_BASE_URL=http://127.0.0.1:8000

# Gemini AI
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-1.5-flash

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

See `.env.example` for template.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/register/` | POST | Register new user |
| `/api/login/` | POST | User login |
| `/api/expenses/` | GET/POST | Get/Add expenses |
| `/api/delete-expense/{id}/` | DELETE | Delete expense |
| `/api/dashboard-summary/` | GET | Dashboard data |
| `/api/analytics/` | GET | Analytics data |
| `/api/ai-analysis/` | POST | AI analysis |

## Features in Detail

### Dashboard
- **Summary Cards** - Total expenses, monthly spending, transaction count
- **Expense Overview** - 30-day expense trend chart
- **Category Breakdown** - Pie chart of spending by category
- **Recent Transactions** - Latest 5 expenses
- **AI Analysis** - Ask questions about your spending

### Expenses
- Add new expenses with date, category, and amount
- View all expenses in a table format
- Delete expenses
- Filter by date range
- Custom categories support

### Reports
- Monthly expense breakdown
- Category-wise analysis
- Daily/Weekly/Monthly/Yearly views
- Export capabilities (future feature)

### Charts & Analytics
- Monthly expense trends
- Category distribution
- Spending patterns
- Year-over-year comparison (future feature)

## AI Features

The app integrates Google Gemini AI to provide:
- Spending analysis and insights
- Budget recommendations
- Expense categorization suggestions
- Financial health assessment

## Security

- ✅ Environment variables for all secrets
- ✅ CSRF protection
- ✅ CORS configuration
- ✅ Token-based authentication
- ✅ Password hashing
- ✅ SQL injection protection
- ✅ HTTPS ready (production)

## Deployment

For production deployment, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

Supported platforms:
- ☁️ Heroku
- 🐳 Docker
- ☁️ AWS
- 🌐 DigitalOcean
- 🖥️ Self-hosted

## Development

For local development setup, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

### Common Tasks

```bash
# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Backup database
mysqldump -u root -p moneymind_db > backup.sql

# Build frontend
npm run build
```

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check credentials in .env
- Verify database exists

### CORS Error
- Check CORS_ALLOWED_ORIGINS in .env
- Verify frontend and backend URLs match
- Restart backend after .env changes

### API Not Responding
- Check backend is running on port 8000
- Verify REACT_APP_API_BASE_URL in frontend .env
- Check network tab in browser DevTools

## Performance Optimization

- Database indexing on frequently queried fields
- Pagination for large datasets
- Frontend code splitting
- Asset compression
- Caching strategies

## Future Enhancements

- [ ] Export reports (PDF, CSV)
- [ ] Budget alerts
- [ ] Recurring expenses
- [ ] Expense splitting
- [ ] Multi-user support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Data visualization improvements
- [ ] Automated categorization
- [ ] Receipt OCR

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Check existing documentation
- Review setup guides

## Authors

Built with ❤️ for personal finance management

---

**Ready to deploy?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**Getting started?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
