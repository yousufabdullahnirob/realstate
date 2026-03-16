# Mahim Builders - Real Estate Management System

## Overview
A professional, premium Real Estate Management System featuring dual dashboards for Admin and Client roles. The platform provides a seamless experience for browsing properties, tracking installments, and managing secure payments with transparent verification workflows.

## Key Features
- **🏠 Dual Dashboards**: Personalized experiences for both Administrators (Management & Approval) and Clients (Portfolio & Payments).
- **🛡️ Secure Payment System**: Robust submission of payment proof (TrxID & Receipts) with a dedicated Admin verification portal.
- **📊 Real-time Analytics**: Dynamic stats for property views, unit availability, and financial tracking.
- **💎 Premium UI/UX**: State-of-the-art Glassmorphism design with responsive layouts tailored for the Bangladeshi real estate market.
- **🌱 Data Seeding**: Populates the system with realistic property data (1 Crore to 5 Crore BDT) and unique, high-resolution imagery.

## 🧪 Unit Testing
**Implemented 9 Unit Tests covering all CRUD operations (Create, Read, Update, Delete) for Project and Apartment models. All tests are passing.**

To run tests:
```bash
python manage.py test
```

## 🛠️ Installation & Setup

### Backend (Django)
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Setup database and initial data:
   ```bash
   python manage.py migrate
   python seed_data.py
   ```
3. Run the server:
   ```bash
   python manage.py runserver
   ```

### Frontend (React + Vite)
1. Navigate to frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Admin Credentials
- **Email**: `admin@mahimbuilders.com`
- **Password**: `admin123`
