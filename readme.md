# HealthCare Management System

- HealthCare Management System ** is a comprehensive healthcare management platform designed to streamline the interaction between patients, doctors, and administrators.The platform allows seamless **appointment booking**, **schedule management**, **specialty tracking**, **prescription handling**, and **real-time analytics** for hospital staff.With **role-based access** and **secure authentication**, it ensures smooth and safe management of healthcare operations.Additionally, it includes **AI-based doctor suggestions\*\* to help patients connect with the most suitable doctors for their needs.

---

## Live Link

```
https://health-care-server-nine.vercel.app/
```

## Admin And Doctor Email, Password

```
Admin:
  email: admin@gmail.com,
  password: Admin123@

Doctor:
 email: shampa.roy@example.com
 password: doctor@123

```

## Features

- Role-based user authentication (Admin, Doctor, Patient)
- Patient management: create, update, view, delete
- Doctor management and AI-based doctor suggestions
- Appointment scheduling and status tracking
- Doctor schedule management
- Specialty management for doctors
- Prescription creation and tracking
- Review and feedback system for patients
- Dashboard metadata for admins, doctors, and patients
- Secure file upload for profile photos and documents

## Technologies Used

- **Node.js**
- **Express.js**
- **TypeScript**
- **Prisma**
- **PostgresSQL**
- **Openai**
- **Stripe**
- **Multer**
- **Jsonwebtoken**

## Installation & Setup

```
git clone https://github.com/MukitHossen7/HealthCare-Server

```

```
cd HealthCare-Server
```

```
npm install
```

```
npm run dev
```

```
Make sure you have a postgressql Database Url connection string set in your `.env` file:
```

## Project Structure

```base
prisma/
 ├─ schema/
 │   ├─ appointment.prisma
 │   ├─ doctor.prisma
 │   ├─ patientData.prisma
 │   ├─ schedule.prisma
 │   ├─ specialty.prisma
 │   ├─ user.prisma
 │   └─ enum.prisma
 └─ migrations/

src/
 ├─ config/
 ├─ errorHelpers/
 ├─ middlewares/
 ├─ modules/
 │   ├─ admin/
 │   ├─ appointment/
 │   ├─ auth/
 │   ├─ doctor/
 │   ├─ doctorSchedule/
 │   ├─ meta/
 │   ├─ patient/
 │   └─ specialties/
 ├─ routes/
 │   └─ routes.ts
 ├─ utils/
 ├─ app.ts
 └─ server.ts

.env

```

## API Endpoints

### User Endpoints

#### Get all users (Admin only)

```
GET /api/v1/user/
```

```json
{
  "success": true,
  "message": "All Users Retrieved Successfully",
  "data": [{}, {}, {}]
}
```

#### Retrieve logged-in user’s profile (Admin, Doctor, Patient)

```
GET /api/v1/user/my-profile
```

#### Create new patient

```
POST /api/v1/user/create-patient
```

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "gender": "MALE",
  "address": "Dhaka, Bangladesh"
}
```

#### Create doctor (Admin only)

```
POST /api/v1/user/create-doctor
```

#### Create admin (Admin only)

```
POST /api/v1/user/create-admin
```

#### Change profile status (Admin only)

```
PATCH /api/v1/user/:id/status
```

#### Update logged-in user’s profile

```
PATCH /api/v1/user/update-my-profile
```

### Auth Api

#### User login

```
POST /api/v1/auth/login
```

```json
request:
{
  "email": "doctor@example.com",
  "password": "123456"
}

```

```json
response:
{
  "success": true,
  "message": "Login Successful",
  "token": "eyJhbGc..."
}
```

#### Generate new access token

```
POST /api/v1/auth/refresh-token
```

#### Get logged-in user details

```
GET /api/v1/auth/me
```

### Doctor Api

#### Retrieve all doctors

```
GET /api/v1/doctors/
```

#### Get doctor by ID

```
GET /api/v1/doctors/:id
```

#### Get AI-based doctor suggestions

```
POST /api/v1/doctors/suggestion
```

```json
{
  "success": true,
  "message": "AI doctor suggestion generated successfully",
  "data": [
    {
      "doctorName": "Dr. Anika Rahman",
      "specialty": "Cardiology",
      "experience": "10 years"
    }
  ]
}
```

#### Update doctor (Admin, Doctor)

```
PATCH /api/v1/doctors/:id
```

#### Delete doctor (Admin only)

```
DELETE /api/v1/doctors/:id
```

### Schedule Api

#### Create schedule (Admin only)

```
POST /api/v1/schedule/
```

#### Get all schedules (Admin, Doctor)

```
GET /api/v1/schedule/
```

#### Delete schedule (Admin only)

```
DELETE /api/v1/schedule/:id
```

### Doctor Schedule Api

#### Create doctor’s schedule (Doctor only)

```
POST /api/v1/doctor-schedule/
```

#### Get all doctor schedules (Admin only)

```
GET /api/v1/doctor-schedule/
```

#### Get logged-in doctor’s schedule

```
GET /api/v1/doctor-schedule/my-schedule
```

#### Delete doctor schedule (Doctor only)

```
DELETE /api/v1/doctor-schedule/:id
```

### Appointment Api

#### Create appointment (Patient only)

```
POST /api/v1/appointments/
```

#### Get all appointments (Admin only)

```
GET /api/v1/appointments/
```

#### Get logged-in user’s appointments

```
GET /api/v1/appointments/my-appointment
```

#### Update appointment status (Doctor only)

```
PATCH /api/v1/appointments/status/:id
```

### Prescription Api

#### Create prescription (Doctor only)

```
POST /api/v1/prescriptions/
```

#### Get prescriptions for patient

```
GET /api/v1/prescriptions/my-prescription
```

### Review Api

#### Add review (Patient only)

```
POST /api/v1/reviews/
```

#### Get all reviews

```
GET /api/v1/reviews/
```

### Specialties Api

#### Create specialty (Admin only)

```
POST /api/v1/specialties/
```

#### Get all specialties

```
GET /api/v1/specialties/
```

#### Delete specialty (Admin only)

```
DELETE /api/v1/specialties/:id
```

### Meta Api

#### Get dashboard metadata (Admin, Doctor, Patient)

```
GET /api/v1/metadata/
```

```json
response:
{
  "success": true,
  "message": "Dashboard metadata retrieved successfully",
  "data": {
    "totalDoctors": 50,
    "totalPatients": 120,
    "appointmentsToday": 14
  }
}

```

### Admin Api

#### Get all admins

```
GET /api/v1/admins/
```

#### Get admin by ID

```
GET /api/v1/admins/:id
```

#### Update admin details

```
PATCH /api/v1/admins/:id
```

#### Delete admin

```
DELETE /api/v1/admins/:id
```

## Dependencies

- "@prisma/client": "^6.16.3",
- "@types/cookie-parser": "^1.4.9",
- "@types/multer": "^2.0.0",
- "bcryptjs": "^3.0.2",
- "cloudinary": "^2.7.0",
- "cookie-parser": "^1.4.7",
- "cors": "^2.8.5",
- "date-fns": "^4.1.0",
- "express": "^5.1.0",
- "http-status": "^2.1.0",
- "jsonwebtoken": "^9.0.2",
- "multer": "^2.0.2",
- "node-cron": "^4.2.1",
- "openai": "^6.5.0",
- "stripe": "^19.1.0",
- "ts-node-dev": "^2.0.0",
- "uuid": "^8.3.2",
- "zod": "^4.1.12"

## DevDependencies

- "@types/cors": "^2.8.19",
- "@types/express": "^5.0.3",
- "@types/jsonwebtoken": "^9.0.10",
- "@types/node": "^24.7.0",
- "@types/uuid": "^10.0.0",
- "prisma": "^6.16.3",
- "tsx": "^4.20.6",
- "typescript": "^5.9.3"
