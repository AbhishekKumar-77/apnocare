# ApnoCare - Fullstack Healthcare Platform

A production-ready fullstack web application built with **React (Vite)**, **Tailwind CSS**, **Node.js + Express**, and **MongoDB Atlas (Mongoose)**.

---

## 📁 Project Architecture

```
apnocare/
├── client/                     # Frontend (React 19 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, ServiceCard, InquiryForm, etc.)
│   │   ├── services/           # Axios API client (/api/health, /api/services, etc.)
│   │   ├── App.jsx             # Main interactive application
│   │   ├── index.css           # Tailwind CSS directives & global styling
│   │   └── main.jsx            # React root mount
│   ├── .env.example            # Client env configuration
│   ├── package.json
│   └── vite.config.js          # Tailwind plugin & backend proxy setup
├── server/                     # Backend (Node.js + Express + Mongoose)
│   ├── src/
│   │   ├── config/             # MongoDB Atlas connection with retry & status reporting
│   │   │   └── db.js
│   │   ├── controllers/        # Health, Services, and Inquiry controllers
│   │   ├── models/             # Mongoose schemas (Service.js, Inquiry.js)
│   │   ├── routes/             # Express API routes
│   │   ├── middleware/         # Error handlers and 404 middleware
│   │   └── server.js           # Server bootstrap & CORS
│   ├── .env.example            # Server env template
│   ├── .env                    # Local server environment
│   └── package.json
├── package.json                # Root orchestrator (runs client & server concurrently)
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### 1. Install Dependencies
From the root folder, run:
```bash
npm run install:all
```
*(This installs root packages, server dependencies, and client dependencies).*

### 2. Configure MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create or open your cluster.
2. In **Database Access**, create a database user (e.g., `dbUser`) with a password.
3. In **Network Access**, add your current IP address (or `0.0.0.0/0` for development access from anywhere).
4. Click **Connect** → **Drivers** → Copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/apnocare?retryWrites=true&w=majority
   ```
5. Open `server/.env` and paste your string replacing `<username>` and `<password>`:
   ```env
   MONGODB_URI=mongodb+srv://dbUser:YourPassword@cluster0.abcde.mongodb.net/apnocare?retryWrites=true&w=majority
   ```

> [!NOTE]
> If you start the app without setting up MongoDB Atlas immediately, **the app will still run** using a built-in fallback mode and will display a setup reminder banner in the UI.

### 3. Run the Fullstack App
From the root folder, run:
```bash
npm run dev
```

This starts both:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:5000](http://localhost:5000)

---

## 🛠 Available Root Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs both backend and frontend concurrently with hot-reloading |
| `npm run dev:client` | Starts only the React + Vite frontend |
| `npm run dev:server` | Starts only the Node.js Express backend |
| `npm run build:client`| Generates an optimized production build of the React frontend |
| `npm run install:all` | Installs dependencies for root, client, and server |
| `npm run start` | Starts the production backend server |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Real-time server and MongoDB Atlas connection status |
| `GET` | `/api/services` | Fetches caregiving & nursing services catalog |
| `POST` | `/api/services` | Adds a new care service (requires connected Atlas DB) |
| `GET` | `/api/inquiries`| Retrieves all submitted patient care inquiries |
| `POST` | `/api/inquiries`| Submits a new care inquiry (saved to MongoDB Atlas) |

---

## 🎨 Tech Highlights

- **React 19 & Vite 8**: Blazing fast SPA rendering and hot module replacement.
- **Tailwind CSS v4**: Utility-first modern responsive styling with `@tailwindcss/vite`.
- **Lucide Icons**: Clean, modern iconography for healthcare.
- **Mongoose 8**: Strict schema modeling, validation, and automated reconnection to Atlas clusters.
- **Express & Morgan**: Clean MVC route architecture with dev HTTP request logging and centralized error handling.
