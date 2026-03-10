# Post Office Management System - Project Initialization Guide

## ✓ Project Structure Created

The complete project skeleton for the Post Office Management System has been successfully generated based on Agend.md specifications.

---

## 📁 Directory Structure

```
/
├── backend/                          # Node.js + Express + PostgreSQL
│   ├── config/
│   │   ├── config.js                 # Centralized configuration management
│   │   └── database.js               # PostgreSQL connection pool
│   ├── routes/
│   │   └── index.js                  # API route definitions
│   ├── controllers/
│   │   └── index.js                  # Business logic for routes
│   ├── models/
│   │   └── index.js                  # Database models/entities
│   ├── middleware/
│   │   └── index.js                  # Express middleware functions
│   ├── server.js                     # Main Express server entry point
│   ├── package.json                  # Node.js dependencies
│   └── .env.example                  # Environment variables template
│
├── frontend/                         # HTML + CSS + JavaScript
│   ├── index.html                    # Main landing/home page
│   ├── pages/
│   │   └── README.md                 # Page templates documentation
│   ├── components/
│   │   └── README.md                 # Reusable UI components documentation
│   ├── css/
│   │   └── styles.css                # Base styles, layout, responsive design
│   ├── js/
│   │   └── api.js                    # REST API client module
│   └── assets/
│       └── README.md                 # Static assets documentation
│
└── Other documentation files
```

---

## 🔧 Backend Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your PostgreSQL connection details
nano .env
```

**Environment Variables to Set:**
- `DB_HOST` - PostgreSQL server hostname (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - PostgreSQL username
- `DB_PASSWORD` - PostgreSQL password
- `SERVER_PORT` - Express server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### 3. Create PostgreSQL Database
```sql
CREATE DATABASE post_office_db;
```

### 4. Start the Server
```bash
# Development mode with auto-reload (requires nodemon)
npm run dev

# Production mode
npm start
```

Server will start at: `http://localhost:3000`

---

## 🎨 Frontend Structure

### Pages (/frontend/pages/)
Documentation includes templates for:
- **Authentication:** login, register, password recovery
- **Dashboard:** home, admin panel
- **Parcel Management:** list, detail, create, edit
- **Customer Management:** list, detail, create, edit
- **Tracking:** search, history
- **Payments:** list, process, receipt
- **Settings & Admin:** installation, staff management

### Components (/frontend/components/)
Reusable UI components for:
- Layout (header, sidebar, footer)
- Forms (input, select, validation)
- Tables (data table, pagination)
- Modals (dialog, confirmation, alerts)
- Features (parcel list, customer profile, payment form)

### Styles (/frontend/css/)
- **styles.css:** Base stylesheet with:
  - CSS variables for theming
  - Responsive grid layout
  - Typography system
  - Component styles
  - Media queries for mobile/tablet/desktop

### API Module (/frontend/js/api.js)
JavaScript API client with methods:
- `api.get(endpoint)` - GET requests
- `api.post(endpoint, data)` - POST requests
- `api.put(endpoint, data)` - PUT requests
- `api.delete(endpoint)` - DELETE requests
- `api.setToken(token)` - Set JWT authentication

**Usage:**
```javascript
// Fetch all parcels
const parcels = await api.get('/parcels');

// Create new parcel
const newParcel = await api.post('/parcels', { 
  trackingNumber: '12345',
  status: 'pending'
});

// Update parcel
await api.put('/parcels/1', { status: 'delivered' });

// Delete parcel
await api.delete('/parcels/1');
```

---

## 📋 MVC Architecture Overview

### Models (`backend/models/`)
Represent database entities:
- Define table structure and relationships
- Handle CRUD operations
- Execute parameterized queries (prevent SQL injection)
- Validate data before database operations

**To Implement:**
- userModel - Staff accounts
- customerModel - Customer information
- parcelModel - Parcel shipments
- paymentModel - Payment transactions
- trackingHistoryModel - Parcel tracking records

### Controllers (`backend/controllers/`)
Handle business logic:
- Receive requests from routes
- Validate input data
- Call appropriate model methods
- Return formatted responses

**To Implement:**
- authController - Authentication logic
- customerController - Customer operations
- parcelController - Parcel operations
- trackingController - Tracking operations
- paymentController - Payment operations

### Routes (`backend/routes/`)
Define API endpoints:
- Map HTTP methods to controllers
- Example endpoints:
  - `GET /api/parcels` - List parcels
  - `POST /api/parcels` - Create parcel
  - `GET /api/parcels/:trackingNumber` - Get parcel details
  - `PUT /api/parcels/:id` - Update parcel
  - `DELETE /api/parcels/:id` - Delete parcel

### Middleware (`backend/middleware/`)
Process requests before/after controllers:
- authMiddleware - Verify user authentication
- authorizationMiddleware - Check user permissions
- validationMiddleware - Validate request data
- loggingMiddleware - Log requests

---

## 🚀 Next Steps

### Phase 1: Database Setup
1. [ ] Create PostgreSQL database tables
2. [ ] Define database schema (customers, staff, parcels, payments, tracking_history)
3. [ ] Create database migration files

### Phase 2: Backend Development
1. [ ] Implement Models with database operations
2. [ ] Implement Controllers with business logic
3. [ ] Implement Routes and endpoints
4. [ ] Add Middleware for authentication and validation
5. [ ] Test API endpoints (using Postman or similar tools)

### Phase 3: Frontend Development
1. [ ] Implement login/authentication page
2. [ ] Implement dashboard page
3. [ ] Implement parcel management pages
4. [ ] Implement customer management pages
5. [ ] Implement tracking pages
6. [ ] Implement payment pages
7. [ ] Component styling and responsiveness

### Phase 4: Integration & Testing
1. [ ] Connect frontend to backend API
2. [ ] End-to-end testing
3. [ ] Performance optimization
4. [ ] Security audit

---

## 📝 Development Guidelines (from Agend.md)

✓ Use MVC architecture for backend  
✓ API endpoints should start with `/api`  
✓ Use parameterized queries to prevent SQL injection  
✓ Use async/await for database operations  
✓ Frontend calls backend through REST API  
✓ Implement role-based access control (staff types)  
✓ Use Notification System for parcel status changes  

---

## 📚 Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Node.js + Express | API server and business logic |
| **Database** | PostgreSQL | Data persistence |
| **Frontend** | HTML + CSS + JavaScript | User interface |
| **Architecture** | MVC + REST API | Clean, maintainable code structure |

---

## 📞 Module Overview

1. **Authentication** - Staff login and role management
2. **Customer Management** - Create, update, view customer profiles
3. **Parcel Management** - Create, track, and manage shipments
4. **Tracking System** - Search parcels by tracking number
5. **Payment System** - Credit card, PromptPay, E-wallet processing
6. **Notification System** - Status change notifications

---

## ✅ Current Status

- ✓ Project structure skeleton created
- ✓ Backend framework initialized (Express, PostgreSQL connection pool)
- ✓ Frontend framework initialized (HTML, CSS, JavaScript)
- ✓ API client module created
- ⏳ Models, Controllers, Routes implementation pending
- ⏳ Database schema pending
- ⏳ Authentication system pending
- ⏳ Individual pages pending

**All files include detailed comments explaining their purpose and usage.**
