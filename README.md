# Collect.D

A modern debt collection management system built with React, TypeScript, and Django.

## Features

- User authentication and authorization
- Customer management
- Invoice tracking
- Payment processing
- Reporting and analytics
- Settings and configuration

## Tech Stack

### Frontend
- React
- TypeScript
- Material-UI
- React Router
- Axios
- React Query

### Backend
- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- PostgreSQL

### Frontend Setup
```bash
cd collect.d-frontend
npm install
npm start
```

### Backend Setup
```bash
cd collect.d-backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver
```

## Project Structure

```
collect.d/
├── collect.d-frontend/     # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── public/            # Static files
│
└── collect.d-backend/      # Django backend
    ├── app/               # Main application
    ├── api/               # API endpoints
    ├── authentication/    # Auth related code
    └── core/              # Core functionality
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 