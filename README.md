# ApnoCare - Remote Family Healthcare & Assistance Platform

> **"You live far away. We're there for your family."**
> 
> *A production-quality fullstack web platform for NRIs and interstate families to coordinate and monitor trusted local healthcare assistance for elderly parents in India.*

---

## 🌟 Core Proposition

ApnoCare solves the painful distance problem for adult children living abroad (Canada, USA, UK, UAE, Australia) or in another Indian state while their elderly parents live elsewhere.

The platform combines **LOCAL HUMAN ASSISTANCE + REMOTE FAMILY VISIBILITY**:
1. **Remote Family Customer** requests assistance from Toronto, San Francisco, or Dubai.
2. **ApnoCare Platform** assigns a verified local care representative in Jalandhar, Ludhiana, Chandigarh, etc.
3. **Verified Local Care Representative** physically accompanies the parent (doctor visit, lab test, hospital admission, prescription pickup).
4. **Non-Clinical Coordination & Updates**: Representative broadcasts real-time milestones and uploads physical medical reports directly into the family's encrypted vault.
5. **Clear Legal Boundary**: ApnoCare representatives provide non-clinical escort, logistical coordination, and family communication. We do NOT diagnose, prescribe, or replace licensed medical practitioners.

---

## 👥 Four Major User Roles & Demo Personas

The application features an **Instant Demo Persona Switcher** on the top bar for 1-click evaluation:

| Role | Persona | Profile & Location | Focus Areas |
| :--- | :--- | :--- | :--- |
| **Family Customer** | **Arjun Mehta** (`arjun.mehta@example.com`) | Son in Toronto, Canada caring for parents in Punjab | Multi-patient switcher (Mom & Dad), live request timeline, health vault, family sharing, international billing |
| **Patient / Parent** | **Sunita Mehta** (`sunita.mehta@example.com`) | Elderly Mother (68 yrs) in Jalandhar, Punjab | Ultra-accessible, high-contrast, big-button interface ("Need a Doctor", "Need Medicine", "Need Test", "Need Help", "Emergency SOS", "Call Family") |
| **Care Representative** | **Rahul Sharma** (`rahul.sharma@example.com`) | Verified Field Coordinator (Badge `AC-JAL-042`) | Task checklist, step updates ("Arrived", "At Clinic", "Complete"), document & prescription upload |
| **Platform Admin** | **ApnoCare Admin** (`admin@apnocare.local`) | Operations Manager at HQ | KPI metrics, revenue charts, representative dispatcher, partner management, audit trail |

*Default password for all demo accounts:* `Password123!` (or click any persona in the top bar / sign in modal for 1-click login).

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide Icons, Axios.
- **Backend**: Node.js, Express, Mongoose / MongoDB Atlas, JWT, bcryptjs.
- **Data Architecture**: Automated Hybrid Store (works 100% out of the box with stateful demo data; persists permanently to MongoDB Atlas when connection string is added to `server/.env`).
- **Currencies Supported**: INR (₹), USD ($), CAD (C$), GBP (£).

---

## 📁 Project Directory Layout

```
apnocare/
├── client/                     # React 19 + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── TopDemoBar.jsx             # Role switcher, currency selector, SOS trigger
│   │   │   ├── Navbar.jsx                 # Global header with portal routing
│   │   │   ├── PublicHome.jsx             # Hero, How It Works, 10 Services, Pricing, Trust & Safety, FAQ, Waitlist
│   │   │   ├── CustomerDashboard.jsx      # Multi-patient view, live timeline, records vault, family sharing
│   │   │   ├── PatientPortal.jsx          # Elderly big-touch accessible interface
│   │   │   ├── RepresentativePortal.jsx   # Rep task executor, step advancement, upload receipt
│   │   │   ├── AdminPortal.jsx            # KPI analytics, request dispatcher, rep verifier, partners, audit
│   │   │   ├── SOSModal.jsx               # Emergency escalation with 108/112 advisory
│   │   │   ├── RequestAssistanceModal.jsx # 8-step service booking flow
│   │   │   ├── OnboardingModal.jsx        # 3-step parent profile creator
│   │   │   ├── InviteShareModal.jsx       # Sibling access permission manager
│   │   │   ├── NotificationDrawer.jsx     # Real-time milestone notification drawer
│   │   │   └── Footer.jsx                 # Healthcare footer & legal boundaries
│   │   ├── services/
│   │   │   └── api.js                     # Complete Axios API client with JWT interceptor
│   │   ├── App.jsx                        # Master state manager & multi-role view router
│   │   └── index.css                      # Tailwind v4 styles & typography
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                      # MongoDB Atlas connection handler
│   │   │   └── store.js                   # Seeded stateful data store with full demo profiles
│   │   ├── controllers/
│   │   │   ├── authController.js          # JWT login, register, persona generator
│   │   │   ├── patientController.js       # Parent profile CRUD & medical conditions
│   │   │   ├── requestController.js       # State machine, milestone updates, SOS trigger
│   │   │   ├── representativeController.js# Field task actions, doc upload
│   │   │   ├── adminController.js         # Analytics, rep verification, partner directory, waitlist
│   │   │   ├── recordController.js        # Health vault records & family sharing
│   │   │   └── notificationController.js  # In-app notification alerts
│   │   ├── middleware/
│   │   │   ├── auth.js                    # JWT verification & role-based protection
│   │   │   └── errorHandler.js            # Centralized API error handling
│   │   ├── routes/                        # REST endpoint declarations
│   │   └── server.js                      # Express app bootstrap & CORS
│   ├── .env.example
│   ├── .env
│   └── package.json
├── package.json                # Root orchestrator (runs client & server concurrently)
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### 1. Run with 1 Command
From the root directory:
```bash
npm run dev
```

This starts:
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🧪 Testing User Journeys

1. **Family Customer (Arjun in Canada)**:
   - On load, you'll see Arjun's dashboard monitoring his mother **Sunita Mehta** in Jalandhar.
   - Click **"Request Assistance"** to book a doctor appointment or test.
   - Notice the live milestone progression and currency toggle in the top bar (CAD / USD / INR).
   - Click **"Health Vault & Documents"** to inspect uploaded cardiac reports and lab panels.
   - Click **"Family Sharing"** to invite siblings (e.g. Simran in Vancouver).

2. **Patient / Parent (Sunita Mehta in Punjab)**:
   - Click **"Sunita Mehta (PATIENT)"** in the top bar.
   - Experience the high-contrast, large-button interface designed for seniors.
   - Tap **"Need a Doctor"** or **"Need Medicine"** for 1-touch coordination.
   - View assigned representative card with direct call button.

3. **Care Representative (Rahul Sharma in Jalandhar)**:
   - Click **"Rahul Sharma (REPRESENTATIVE)"** in the top bar.
   - Review assigned tasks and click buttons: **"Patient Contacted"**, **"Arrived at Home"**, **"Reached Clinic"**, or **"Upload Report"**.
   - Notice how status changes broadcast notifications directly to Arjun in Canada!

4. **HQ Operations Admin**:
   - Click **"ApnoCare Admin"** in the top bar.
   - Inspect platform metrics: Total Revenue (INR), Active Requests, Emergency Triggers.
   - Reassign field representatives, approve/verify representatives, manage healthcare partners, and inspect timestamped audit logs.

5. **Emergency SOS Protocol**:
   - Click the red **"Emergency SOS"** button on the top bar or inside the patient portal.
   - Review the critical medical advisory (dialing 108/112 in India for life-threatening emergencies).
   - Dispatch the emergency team to trigger an immediate alert to family contacts and coordinators.

---

## 🍃 Connecting MongoDB Atlas (Optional)

1. Open your cluster in [MongoDB Atlas](https://cloud.mongodb.com/).
2. Under **Network Access**, allow access from your IP.
3. Under **Database Access**, create a user and password.
4. In `server/.env`, set `MONGODB_URI`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/apnocare?retryWrites=true&w=majority
   ```
*(Without MongoDB Atlas credentials, the platform seamlessly runs on its built-in hybrid store with zero downtime).*
