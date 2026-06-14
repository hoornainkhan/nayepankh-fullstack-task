# NayePankh Foundation - Volunteer Management System

A full-stack volunteer registration and management system for NayePankh Foundation.

## 🌐 Live Demo

**[https://nayepankh-volunteer-system-f6ys.onrender.com](https://nayepankh-volunteer-system-f6ys.onrender.com)**

### Admin Login
- **Email:** `admin@nayepankh.org`
- **Password:** `Admin@123`

> Note: Free Render tier sleeps after 15 minutes. First request may take 30-60 seconds.

---

## ✨ Features

- Volunteer registration form
- Admin dashboard with statistics
- Volunteer management (approve/reject)
- CSV report downloads
- JWT authentication
- Responsive design

---

## 🛠️ Tech Stack

**Frontend:** React, Tailwind CSS, React Router, Axios  
**Backend:** Node.js, Express, MongoDB, JWT  
**Deployment:** Render, MongoDB Atlas

---

## 📁 Project Structure
├── frontend/ # React frontend
│ └── src/
│ └── components/
├── backend/ # Express backend
│ ├── models/
│ ├── routes/
│ └── middleware/
└── README.md

text

---

## 🚀 Local Setup

### Prerequisites
- Node.js
- MongoDB

### Backend
```bash
cd backend
npm install
# Create .env file (see .env.example)
npm run dev
Frontend
bash
cd frontend
npm install
npm start
Environment Variables (.env)
text
PORT=5000
MONGODB_URI=mongodb://localhost:27017/volunteer_system
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@nayepankh.org
ADMIN_PASSWORD=Admin@123
📊 API Endpoints
Volunteers
POST /api/volunteers - Register volunteer

GET /api/volunteers - Get all volunteers (admin)

PUT /api/volunteers/:id - Update volunteer (admin)

DELETE /api/volunteers/:id - Delete volunteer (admin)

Admin
POST /api/admin/login - Admin login

GET /api/admin/dashboard - Dashboard stats

GET /api/admin/report/:type - Download reports

🔒 Security
JWT authentication

Password hashing with bcrypt

Input validation

CORS enabled

📝 License
MIT License

Made with ❤️ for NayePankh Foundation

text

---

## Add to Your Project:

```powershell
cd C:\Users\Hoorn\Desktop\np-fullstack

# Create README.md
@"
# NayePankh Foundation - Volunteer Management System

A full-stack volunteer registration and management system for NayePankh Foundation.

## 🌐 Live Demo

**[https://nayepankh-volunteer-system-f6ys.onrender.com](https://nayepankh-volunteer-system-f6ys.onrender.com)**

### Admin Login
- **Email:** `admin@nayepankh.org`
- **Password:** `Admin@123`

> Note: Free Render tier sleeps after 15 minutes. First request may take 30-60 seconds.

---

## ✨ Features

- Volunteer registration form
- Admin dashboard with statistics
- Volunteer management (approve/reject)
- CSV report downloads
- JWT authentication
- Responsive design

---

## 🛠️ Tech Stack

**Frontend:** React, Tailwind CSS, React Router, Axios  
**Backend:** Node.js, Express, MongoDB, JWT  
**Deployment:** Render, MongoDB Atlas

---

## 📁 Project Structure
├── frontend/ # React frontend
│ └── src/
│ └── components/
├── backend/ # Express backend
│ ├── models/
│ ├── routes/
│ └── middleware/
└── README.md

text

---

## 🚀 Local Setup

### Prerequisites
- Node.js
- MongoDB

### Backend
```bash
cd backend
npm install
npm run dev
Frontend
bash
cd frontend
npm install
npm start
Environment Variables (.env)
text
PORT=5000
MONGODB_URI=mongodb://localhost:27017/volunteer_system
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@nayepankh.org
ADMIN_PASSWORD=Admin@123
📊 API Endpoints
Volunteers
POST /api/volunteers - Register volunteer

GET /api/volunteers - Get all volunteers (admin)

PUT /api/volunteers/:id - Update volunteer (admin)

DELETE /api/volunteers/:id - Delete volunteer (admin)

Admin
POST /api/admin/login - Admin login

GET /api/admin/dashboard - Dashboard stats

GET /api/admin/report/:type - Download reports

🔒 Security
JWT authentication

Password hashing with bcrypt

Input validation

CORS enabled

📝 License
MIT License

Made with ❤️ for NayePankh Foundation
"@ | Out-File -FilePath README.md -Encoding utf8

