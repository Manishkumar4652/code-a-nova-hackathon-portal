# Code-a-Nova — Hackathon Registration Portal

A production-ready full-stack web application designed for managing hackathon registrations, participant authentication with email OTP verification, dynamic team composition (1 to 5 members), and transactional email notifications.

Developed for the **Code-a-Nova Full Stack Developer Internship Task**.

---

## 📌 Project Overview

The **Code-a-Nova Hackathon Registration Portal** provides a complete end-to-end registration and dashboard experience for hackathon attendees and organizers. Key capabilities include:

- **Participant Authentication**: Secure signup with bcrypt password hashing and 10-minute time-limited OTP email verification.
- **Brute Force & Rate Limit Protection**: Express rate limiting across authentication routes and a strict 5-attempt lockout on OTP verification.
- **Session Management**: JWT-based protected routes for authenticated user dashboard access.
- **Hackathon Registration**: Multi-field submission with dynamic team member management (1 to 5 members) and single registration enforcement.
- **Automated Notifications**: Transactional emails powered by Nodemailer for OTP codes and registration confirmations with official sender identity (`Code-a-Nova`).
- **Production UI/UX**: React + Tailwind CSS with a custom "paper, ink and nova-orange" design system, accessible forms, responsive layouts (tested down to 360px) and a mobile navigation menu.
- **Self-service**: participants can edit their profile name and withdraw / re-submit their registration from the dashboard.
- **Contact desk**: contact-form messages are delivered to the project mailbox via Nodemailer (Reply-To set to the sender).

---

## 🖼️ Screenshots

> Captured with sample data. Replace with captures from your own deployment before submitting.

| Home | Sign up |
| :---: | :---: |
| ![Home](docs/screenshots/01-home.png) | ![Sign up](docs/screenshots/02-signup.png) |

| OTP verification | Dashboard (not registered) |
| :---: | :---: |
| ![OTP](docs/screenshots/03-otp.png) | ![Dashboard empty](docs/screenshots/04-dashboard-empty.png) |

| Registration form | Dashboard (registered) |
| :---: | :---: |
| ![Registration](docs/screenshots/05-registration-form.png) | ![Dashboard registered](docs/screenshots/06-dashboard-registered.png) |

| Mobile |
| :---: |
| <img src="docs/screenshots/07-mobile-home.png" width="260" alt="Mobile home" /> |

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS (custom theme), Lucide React, Axios | Responsive user interface, component architecture, client-side routing |
| **Backend** | Node.js (ESM), Express.js | RESTful API endpoints, request validation, error handling |
| **Database** | MongoDB Atlas, Mongoose | Data modeling, validation, unique indexing, persistence |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs | Secure password hashing, tokenized route protection |
| **Security** | express-rate-limit, crypto (timingSafeEqual) | Rate limiting, timing-safe OTP verification |
| **Mailing Service** | Nodemailer | Transactional OTP and registration confirmation emails |

---

## 📁 Directory Structure

```text
Code-A-Nova/
├── client/                      # Frontend React + Vite application
│   ├── src/
│   │   ├── components/          # Reusable UI (Navbar, Footer, Logo, Button, Input/Select/Textarea, Alert, Loading, AuthShell, route guards)
│   │   ├── config/              # event.js — dates, prizes, tracks and social links shown on the site
│   │   ├── context/             # AuthContext with persistent JWT state
│   │   ├── pages/               # Application views (Home, Signup, Login, OTPVerify, Dashboard, HackathonRegister, About, Contact)
│   │   ├── hooks/               # useContactEmail
│   │   ├── utils/               # Shared form validators
│   │   ├── services/            # Axios API client & centralized service methods
│   │   ├── App.jsx              # Application router & route guards
│   │   └── main.jsx             # React entry point
│   ├── package.json
│   └── vite.config.js
├── server/                      # Backend Express application
│   ├── config/                  # MongoDB Atlas connection (db.js)
│   ├── controllers/             # Business logic (authController, hackathonController, userController, contactController)
│   ├── middleware/              # JWT auth guard (authMiddleware), rate limiting, centralized error handler
│   ├── models/                  # Mongoose models (User, HackathonRegistration)
│   ├── routes/                  # REST route definitions (/api/auth, /api/hackathon, /api/user, /api/contact)
│   ├── utils/                   # Cryptographic OTP generator, Nodemailer transporter & templates
│   ├── app.js                   # Express application setup & CORS configuration
│   ├── server.js                # Server entry point & listener
│   └── package.json
├── .gitignore                   # Root gitignore rules
├── CodeANova_FullStack_Intern_Task.pdf # Official internship specification
└── README.md                    # Comprehensive documentation
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
# Optional — mailbox shown on the Contact page & receiving contact-form messages (defaults to EMAIL_USER)
CONTACT_EMAIL=
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
# Optional — footer social links (default to the platform home pages)
VITE_GITHUB_URL=
VITE_LINKEDIN_URL=
VITE_TWITTER_URL=
VITE_INSTAGRAM_URL=
```

> Event dates, prize amounts and tracks live in `client/src/config/event.js` — edit them there.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ (Tested on Node.js v22.12.0)
- **npm** v9+ (Tested on npm v10.9.0)
- **MongoDB** (Local instance or MongoDB Atlas cluster)

### 2. Backend Setup
```bash
cd server
npm install
# Configure your server/.env file based on server/.env.example
npm run dev
```
The backend server runs on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The frontend dev server runs on `http://localhost:5173`.

### 4. Production Build
```bash
cd client
npm run build
```

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Server uptime and health probe |
| `POST` | `/api/auth/signup` | Public | Register new participant (generates 6-digit OTP) |
| `POST` | `/api/auth/verify-otp` | Public | Verify OTP within 10 min (max 5 failed attempts) |
| `POST` | `/api/auth/resend-otp` | Public | Resend OTP with 60s cooldown |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue JWT |
| `GET` | `/api/user/me` | Protected | Fetch authenticated participant profile |
| `PUT` | `/api/user/update` | Protected | Update the participant's full name |
| `POST` | `/api/hackathon/register` | Protected | Submit hackathon registration (1 to 5 members) |
| `GET` | `/api/hackathon/my-entry` | Protected | Fetch user's submitted registration details |
| `DELETE` | `/api/hackathon/:id` | Protected (owner) | Withdraw the user's own registration |
| `GET` | `/api/contact/info` | Public | Public contact mailbox for the Contact page / footer |
| `POST` | `/api/contact` | Public | Submit an inquiry — emailed to the project mailbox |

---

## 🔒 Security & Defensive Engineering

1. **Password Protection**: Passwords hashed with bcrypt (salt rounds = 10) and excluded from all database projections.
2. **Timing-Safe OTP**: Plaintext OTP is hashed via SHA-256 before storage; comparisons use `crypto.timingSafeEqual` to prevent timing attacks.
3. **Brute Force Lockout**: OTP attempts are capped at 5 failed guesses, after which the OTP is wiped and invalidated.
4. **Rate Limiting**: Configured with `express-rate-limit` for all `/api/auth/*` routes.
5. **Session Isolation**: Hackathon registration maps `user` strictly from the verified JWT payload (`req.user._id`), never trusting client-supplied IDs; delete is scoped to the owner.
6. **Safe URL validation**: links are validated with the WHATWG `URL` parser (no backtracking-prone regex).
7. **Email hardening**: every user-supplied value is HTML-escaped in outgoing emails.
8. **Proxy-aware rate limiting**: `trust proxy` is enabled so limits apply per real client IP on Render / Railway.

---

## 📄 License & Attribution

Developed for the **Code-a-Nova Full Stack Developer Internship Task**.
