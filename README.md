# 🏥 HealthSaathi

**HealthSaathi** is a modern full-stack healthcare platform designed to simplify doctor discovery, appointment booking, and patient-doctor interactions. Built with **React.js**, **TypeScript**, **Node.js**, **Express.js**, and **MongoDB**, it delivers an efficient and responsive experience tailored for both **patients** and **admins**.

---

## 🔗 Live Demo

Coming soon...

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
| Deployment   | *(You can host on Vercel + Render)*|

---

## 📂 Project Structure (Major Folders)

