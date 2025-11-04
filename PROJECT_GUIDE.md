# 🌱 GreenCycle: E-Waste Collection Scheduler

A full-stack MERN application for managing e-waste collection with role-based dashboards for Citizens, Collection Agents, and Administrators.

## 🎯 Features Implemented

### ✅ Backend (Node.js + Express + SQLite)
- **Authentication System**
  - JWT-based authentication
  - Role-based access control (Citizen, Agent, Admin)
  - Secure password hashing with bcrypt

- **Database (SQLite with Sequelize ORM)**
  - User management
  - E-waste type catalog
  - Collection request tracking
  - Collection logs

- **REST API Endpoints**
  - `/api/auth/register` - User registration
  - `/api/auth/login` - User login
  - `/api/requests` - CRUD operations for collection requests
  - `/api/requests/mine` - Citizen's requests
  - `/api/requests/agent` - Agent's assigned pickups
  - `/api/ewaste-types` - E-waste catalog
  - `/api/users/agents` - List of agents (Admin)

### ✅ Frontend (Vanilla JS + Vite)
- **Authentication Pages**
  - Login with demo credentials
  - Registration with role selection
  - Session management

- **Role-Based Dashboards**
  - **Citizen Dashboard**: View requests, schedule pickups
  - **Agent Dashboard**: View assigned pickups, update status
  - **Admin Dashboard**: View all requests, assign agents

- **Schedule Pickup Form**
  - Multi-item selection
  - Date and time slot picker
  - Address input

## 🚀 Running the Project

### Prerequisites
- Node.js (v16+)
- npm

### Setup Instructions

1. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Seed the Database**
   ```bash
   cd server
   npm run seed
   ```

4. **Start Backend Server** (Terminal 1)
   ```bash
   cd server
   npm run dev
   ```
   Backend runs on: http://localhost:4000

5. **Start Frontend Server** (Terminal 2)
   ```bash
   npm run dev
   ```
   Frontend runs on: http://localhost:5173

## 👥 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Citizen** | citizen@ewaste.com | citizen123 |
| **Agent** | agent@ewaste.com | agent123 |
| **Admin** | admin@ewaste.com | admin123 |

## 📱 User Workflows

### Citizen Flow
1. Login → Dashboard
2. Click "Schedule Pickup"
3. Fill form: address, date, time, items
4. Submit request
5. View request status on dashboard

### Agent Flow
1. Login → Dashboard
2. View assigned pickups
3. Click "Start Pickup" to update status
4. Click "Complete" and enter actual weight
5. View completed pickups

### Admin Flow
1. Login → Dashboard
2. View all pending requests
3. Assign requests to agents
4. Monitor collection statistics

## 🗂️ Project Structure

```
E-Waste-Management/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # SQLite connection
│   │   ├── models/
│   │   │   ├── User.js            # User model
│   │   │   ├── EwasteType.js      # E-waste types
│   │   │   ├── CollectionRequest.js
│   │   │   ├── CollectionLog.js
│   │   │   └── index.js           # Model associations
│   │   ├── routes/
│   │   │   ├── auth.js            # Auth endpoints
│   │   │   ├── requests.js        # Request endpoints
│   │   │   ├── ewasteTypes.js
│   │   │   └── users.js
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT verification
│   │   ├── seed.js                # Database seeder
│   │   └── server.js              # Express app
│   ├── database.sqlite            # SQLite database file
│   ├── package.json
│   └── .env
├── auth.html                      # Login/Register page
├── auth.js
├── dashboard.html                 # Role-based dashboard
├── dashboard.js
├── schedule.html                  # Schedule pickup form
├── schedule.js
├── index.html                     # Landing page
├── calculator.html                # E-waste calculator
├── locator.html                   # Recycling centers map
├── education.html                 # Education hub
├── style.css                      # Global styles
└── package.json
```

## 🔧 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **ORM**: Sequelize
- **Authentication**: JWT + bcrypt
- **Dev Tools**: nodemon, morgan, dotenv

### Frontend
- **Build Tool**: Vite
- **JavaScript**: Vanilla ES6+
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Font Awesome 6

## 🌟 Key Features from Prompt

✅ **User Roles**: Citizen, Agent, Admin  
✅ **Authentication**: JWT-based with role guards  
✅ **Collection Scheduling**: Multi-item pickup requests  
✅ **Status Tracking**: Pending → Scheduled → In Progress → Completed  
✅ **Agent Assignment**: Admin assigns requests to agents  
✅ **Real-time Updates**: Agents update pickup status  
✅ **E-waste Catalog**: 12 pre-seeded item types with points  
✅ **SQL Database**: SQLite with proper relationships  
✅ **RESTful API**: Clean endpoint structure  
✅ **Responsive UI**: Works on desktop and mobile  

## 📊 Database Schema

### Users
- id, name, email, password (hashed), role, address, phone

### EwasteTypes
- id, name, pointsPerKg

### CollectionRequests
- id, citizenId, agentId, address, scheduledDate, timeSlot, status, pickupDetails (JSON)

### CollectionLogs
- id, requestId, actualWeightKg, completionNotes, agentSignature

## 🔐 API Authentication

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

Role-based access:
- **Citizen**: Can create and view own requests
- **Agent**: Can view assigned requests and update status
- **Admin**: Full access to all requests and user management

## 🎨 UI/UX Highlights

- Clean, modern design with green eco-theme
- Intuitive navigation with sidebar
- Status badges with color coding
- Responsive forms with validation
- Demo credentials displayed on login
- Success/error messages for all actions

## 🚧 Future Enhancements

- [ ] Map integration (Leaflet/Google Maps) for routing
- [ ] Real-time notifications (WebSockets)
- [ ] Reward points system for citizens
- [ ] Analytics dashboard with charts
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] Multi-language support

## 📝 Notes

- Database file: `server/database.sqlite` (auto-created)
- JWT Secret: Set in `server/.env`
- CORS enabled for local development
- Sequelize auto-syncs schema on startup

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Kill process on port 4000 (backend)
netstat -ano | findstr :4000
taskkill /F /PID <PID>

# Kill process on port 5173 (frontend)
netstat -ano | findstr :5173
taskkill /F /PID <PID>
```

**Database issues?**
```bash
# Delete and recreate database
cd server
del database.sqlite
npm run seed
```

## 📄 License

MIT License - Feel free to use for learning and projects!

---

**Built with ❤️ for sustainable e-waste management**
