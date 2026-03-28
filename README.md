# Healthcare Appointment Booking System

A fully responsive and interactive full-stack web application for managing healthcare appointments.

## 🚀 Features

### Patient
- **Secure Authentication**: Signup/Login with JWT.
- **Doctor Search**: Find doctors by name or specialization.
- **Booking**: Interactive calendar and time slot selection.
- **Dashboard**: Track upcoming and past appointments.
- **Profile**: Manage user details and account status.

### Doctor
- **Dashboard Analytics**: View total patients, upcoming tasks, and ratings.
- **Appointment Management**: Approve, reject, or mark appointments as completed.
- **Real-time Updates**: Status changes reflect instantly for patients.

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Lucide Icons, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT & Bcryptjs.

## 📦 Setup Instructions

### Prerequisites
- Node.js installed.
- MongoDB running locally or a remote URI (Atlas).

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/healthcare_appointment
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```

## 🎨 Design Theme
Inspired by modern hospital systems, the UI uses a clean white, light blue, and soft green palette with smooth animations and dark mode support.
