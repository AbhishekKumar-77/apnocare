# ApnoCare

## AI-Powered Remote Family Healthcare & Assistance Platform

ApnoCare is a comprehensive healthcare assistance platform designed for people who cannot physically be present with their family members. Whether you're living abroad or in a different city, ApnoCare helps you manage your family's healthcare needs remotely.

### Key Features

- **Care Assistance** - Request and manage healthcare visits for family members with real-time status tracking
- **Find Doctors** - Search and book appointments with verified doctors across specialties
- **Find Hospitals** - Locate nearby hospitals with ratings, specialties, and emergency info
- **Medicine Management** - Order medicines online with home delivery tracking
- **Diagnostics** - Book lab tests and health checkups with home sample collection
- **Health Records** - Centralized digital health records for the entire family
- **AI Assistant (Ask ApnoCare)** - AI-powered health queries with emergency triage
- **Admin Portal** - Comprehensive admin dashboard for platform management

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django + Django REST Framework |
| Database | MongoDB Atlas |
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Auth | JWT (JSON Web Tokens) |
| API | REST APIs |

### Getting Started

#### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env   # Configure your environment variables
python manage.py runserver
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Project Structure

```
apnocare/
├── backend/
│   ├── accounts/       # User authentication & profiles
│   ├── family/         # Family member management
│   ├── healthcare/     # Doctors & hospitals
│   ├── appointments/   # Appointment booking
│   ├── care_requests/  # Care assistance workflows
│   ├── medicines/      # Medicine ordering
│   ├── diagnostics/    # Lab tests & checkups
│   ├── health_records/ # Digital health records
│   ├── notifications/  # Push notifications
│   ├── payments/       # Payment processing
│   ├── ai_assistant/   # AI health assistant
│   ├── admin_portal/   # Admin dashboard API
│   ├── core/           # Database, auth, utilities
│   └── config/         # Django settings & URLs
├── frontend/
│   └── src/
│       ├── api/        # API client
│       ├── components/ # Reusable UI components
│       ├── contexts/   # React contexts (Auth, Notifications)
│       └── pages/      # Application pages
└── README.md
```

### License

MIT
