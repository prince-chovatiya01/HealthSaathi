# 🏥 HealthSaathi

**HealthSaathi** is a modern full-stack healthcare platform designed to simplify doctor discovery, appointment booking, and patient-doctor interactions. Built with **React.js**, **TypeScript**, **Node.js**, **Express.js**, and **MongoDB**, it delivers an efficient and responsive experience tailored for both **patients** and **admins**.

---

## 🔗 Live Demo

🚀 **Live Application**: [https://healthsaathi-zrvl.onrender.com](https://healthsaathi-zrvl.onrender.com)

HealthSaathi is deployed publicly on **Render** with **MongoDB Atlas** cloud database. Experience the live demo featuring one-click demo logins for Patient and Admin roles, real-time doctor booking, health records, and dynamic dashboards.

---

## 🚀 Features

### 👨‍⚕️ Doctor Discovery
- Browse all doctors with filters by **specialization**, **language**, and **availability time slots** (morning, afternoon, evening).
- Real-time search for doctors based on name or expertise.

### 📆 Appointment Booking
- Authenticated users can book 1-hour appointment slots based on real-time doctor availability.
- Fully dynamic slot generation from a doctor's weekly availability.

### ⭐ Doctor Rating System *(in progress)*
- Users can rate doctors (1–5 stars) and leave reviews **only after completed appointments**.
- Average rating and review count displayed per doctor.
- Admins **do not** influence ratings — user-driven transparency.

### 📊 Personalized Dashboard
- Role-based dashboard for **users** and **admins**.
- Users see upcoming and missed appointments.
- Admins can **view, mark as completed**, or **cancel** appointments.

### 🔒 Secure Authentication
- Role-based login for `user` and `admin` roles.
- Password-based login system using JWT and secure password hashing.

### 🌐 Responsive UI
- Built using **Tailwind CSS** for modern and mobile-friendly experience.
- Context API-based global state management for authentication and user sessions.

---

## 🧱 Tech Stack

| Layer        | Technology                         |
|--------------|-------------------------------------|
| Frontend     | React.js, TypeScript, Tailwind CSS |
| Backend      | Node.js, Express.js                |
| Database     | MongoDB (Mongoose ODM)             |
| Auth         | JWT, bcrypt                        |
| State Mgmt   | React Context API                  |

---

## 📂 Project Structure (Major Folders)

```
/client
├── components       # Reusable UI components (e.g., DoctorCard, Modal)
├── context          # React Context API for global state management
├── pages            # Page-level components (e.g., Dashboard, LoginPage, DoctorsPage)
└── routes           # Route definitions for frontend navigation

/server
├── models           # Mongoose models (User, Doctor, Appointment, Rating)
├── routes           # API route definitions (user, doctor, appointment, public)
├── controllers      # Logic for handling API requests
└── middleware       # Auth protection, error handlers, etc.
```

---

## ✨ Advantages

- **Real doctor discovery** with availability-aware filters.
- **Admin control** over appointments without affecting ratings.
- **Highly scalable** backend design using REST principles.
- **Clean UI/UX** using modern design standards.
- **Componentized architecture**: reusable, readable, maintainable.

---

## 📦 Use Cases

- Perfect for building telehealth platforms, especially for clinics, hospitals, or solo practitioners.
- Useful as a boilerplate for real-time scheduling systems and admin-user dashboard systems.
- Can be adapted for community health initiatives or NGO-backed rural outreach platforms.
- Highly beneficial for people in remote or underserved areas where physical access to healthcare is limited — with upcoming online doctor consultation support, patients can consult doctors virtually.
- Works great for both in-person appointment booking and future integration with video-based telemedicine.
