# Mahim Builders - Housing Management System

A premium Real Estate and Housing Management platform built for seamless communication between property managers and clients. This system features dynamic apartment listings, installment tracking, real-time-simulated messaging, and a robust admin notification dashboard.

## 🚀 Tech Stack

- **Frontend**: React (Vite), Vanilla CSS (for premium aesthetics), React Router.
- **Backend**: Django, Django Rest Framework (DRF).
- **Database**: SQLite (Development).
- **Icons**: Emoji Glyphs (Modern & Lightweight).

## ✨ Key Features

- **Apartment Listings**: CRUD interface for managing premium flats with a price range of 1 Crore to 3 Crore BDT.
- **Financial Logic**: Automated installment tracking where marking an installment as "Paid" dynamically updates the total balance.
- **Interactive Messaging**: Integrated chat system for clients to contact support and admins to reply in real-time.
- **Admin Notifications**: Live dashboard notification system with smart navigation to relevant sections upon clicking.
- **Responsive Design**: Modern, premium UI tailored for a professional real estate experience.

---

## 🛠️ Setup Instructions

### 1. Backend Setup (Django)

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/yousufabdullahnirob/realstate_mahimbuilders.git
    cd realstate_mahimbuilders
    ```

2.  **Create a Virtual Environment**:
    ```bash
    python -m venv venv
    # Activate on Windows:
    .\venv\Scripts\activate
    # Activate on Mac/Linux:
    source venv/bin/activate
    ```

3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Apply Migrations**:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

5.  **Run Seed Data (Optional)**:
    Populate the database with premium Dhanmondi, Gulshan, and Banani apartments:
    ```bash
    python seed_apartments.py
    ```

6.  **Start the Server**:
    ```bash
    python manage.py runserver
    ```
    The backend will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

### 2. Frontend Setup (React/Vite)

1.  **Navigate to Frontend Directory**:
    ```bash
    cd frontend
    ```

2.  **Install Node Modules**:
    ```bash
    npm install
    ```

3.  **Start Dev Server**:
    ```bash
    npm run dev
    ```
    The frontend will be available at [http://localhost:5173](http://localhost:5173).

---

## 🧪 Test Credentials



## 📁 Directory Structure

- `backend/`: Django project and settings.
- `core/`: Main app logic, models, serializers, and views.
- `frontend/`: React source code, components, and assets.
- `seed_apartments.py`: Data population script for premium properties.

---

© 2026 Mahim Builders. All rights reserved.
