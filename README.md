# 🏥 MediWay Health Care – Backend API

A **production-grade healthcare management system backend** built with modern technologies to support secure, scalable, and efficient digital healthcare operations.

MediWay Health Care enables **patients**, **doctors**, and **administrators** to interact through a robust RESTful API covering authentication, appointments, prescriptions, payments, and medical data management.

---


## 🚀 Project Overview

MediWay Health Care Backend is designed to handle real-world healthcare workflows including:

* Secure user authentication & role-based authorization
* Doctor & patient profile management
* Appointment booking and lifecycle management
* Digital prescriptions & medical records
* Payment processing for medical services
* Session tracking and audit logging
* High-performance data access with caching

The system follows **enterprise-level best practices** and is suitable for **scaling to large healthcare platforms**.

---

## 🧱 System Architecture

**Architecture Pattern**: Layered Architecture

```
Client
  ↓
Controller Layer (Routes & Validation)
  ↓
Service Layer (Business Logic)
  ↓
Repository Layer (Prisma ORM)
  ↓
PostgreSQL Database
```

Additional layers:

* **Redis** for caching
* **Better Auth** for session-based authentication
* **Cloud Storage (S3/GCS)** for medical documents

---

## 🛠️ Technology Stack

| Category       | Technology       |
| -------------- | ---------------- |
| Runtime        | Node.js 20.x LTS |
| Framework      | Express.js       |
| Language       | TypeScript 5.x   |
| Database       | PostgreSQL 16    |
| ORM            | Prisma 7         |
| Authentication | Better Auth      |
| Cache          | Redis            |
| Validation     | Zod              |
| Logging        | Winston          |
| Payments       | Stripe           |
| File Storage   | AWS S3 / GCS     |

---

## 👥 User Roles & Permissions

| Role            | Description                            |
| --------------- | -------------------------------------- |
| **SUPER_ADMIN** | Full system access                     |
| **ADMIN**       | Manage doctors, patients, reports      |
| **DOCTOR**      | Appointments, prescriptions, schedules |
| **PATIENT**     | Book appointments, view records        |

Role hierarchy is strictly enforced:

```
SUPER_ADMIN > ADMIN > DOCTOR > PATIENT
```

---

## 🔐 Authentication & Security Features

* Email & password-based authentication
* Secure password hashing (bcrypt)
* Email verification & password reset
* JWT-based access tokens
* Session tracking with device & IP info
* Rate limiting & account lockout
* Role-based access control (RBAC)
* Resource ownership validation
* Audit logs for critical actions

---

## 📦 Core Modules

### 🔑 Authentication Module

* User Registration & Email Verification
* Login & Logout (single / all devices)
* Password Reset & Change Password
* Session Management

### 🧑‍⚕️ Doctor Management

* Create & update doctor profiles
* Specialty assignment
* Doctor availability & schedules
* Ratings & reviews (read-only for doctors)

### 🧑‍💼 Admin Management

* Create & manage admins
* Role & status control
* System-level oversight

### 🧑‍🦱 Patient Management

* Patient profile creation
* Appointment booking
* Medical report uploads

### 📅 Appointment Management

* Slot-based scheduling
* Appointment lifecycle (Booked → Completed)
* Doctor-patient relationship validation

### 💳 Payment Module

* Stripe-based payment processing
* Appointment fee handling
* Secure transaction records

---

## ⚡ Performance & Caching

* Redis caching for:

  * Doctor lists
  * Doctor details
  * Frequently accessed metadata
* Smart cache invalidation on updates
* Optimized pagination & filtering

---

## 📂 Database Design Highlights

* Relational schema with Prisma ORM
* Soft delete pattern (`isDeleted`, `deletedAt`)
* UUID-based primary keys
* Transaction-safe operations
* Indexed frequently queried fields

---

## 🧪 Validation & Error Handling

* Zod-based request validation
* Consistent error response format
* HTTP status-code driven responses
* No sensitive data exposure

Example error response:

```json
{
  "success": false,
  "message": "Access denied",
  "statusCode": 403
}
```

---

## 📜 Logging & Monitoring

* Winston-based structured logging
* Authentication & authorization logs
* Payment & security audit logs
* Error & performance tracking

---

## 📁 Environment Variables

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/mediway
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
STRIPE_SECRET_KEY=your_stripe_key
EMAIL_SERVICE_API_KEY=your_email_key
CLOUD_STORAGE_BUCKET=mediway-docs
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

---

## 📌 Project Status

✅ Authentication & RBAC
✅ Admin & Doctor Management
✅ Secure Session Handling
🛠️ Appointment & Prescription Enhancements Ongoing

---

## 🤝 Contribution Guidelines

* Follow TypeScript & ESLint rules
* Keep services thin and reusable
* Validate inputs using Zod
* Always enforce RBAC & ownership checks

---

## 📄 License

This project is licensed for **educational and internal use**.

---

### ✨ MediWay Health Care Backend

**Secure • Scalable • Production-Ready Healthcare API**
