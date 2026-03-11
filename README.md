# 2025-ITCS383-Arai-Kor-Dai
## Team Member
  1) 6688046	Warut	        Khamkaveephart
  2) 6688194	Muhummadcharif 	kapa
  3) 6688083	Teeramanop 	    Pinsupa
  4) 6688148	Bunyakorn	    Wongchadakul
  5) 6688205	Sirawit	        Noomanoch
  6) 6688226	Thanawat	    Thanasirithip

 ## Overall Project Structure

Post-Office System

```
├── README.md
├── designs
│   └── D1_Design.md
├── frontend
├── backend
└── database
```

---

## Frontend File Structure

```
frontend/
├── public
│   └── index.html
├── src
│   ├── pages
│   │   ├── RegisterPage.js
│   │   ├── LoginPage.js
│   │   ├── CreateShipmentPage.js
│   │   ├── PaymentPage.js
│   │   ├── TrackingPage.js
│   │   ├── HistoryPage.js
│   │   ├── AdminLoginPage.js
│   │   ├── AdminDashboardPage.js
│   │   ├── UserApprovalPage.js
│   │   └── ReportsPage.js
│   │
│   ├── components
│   │   ├── Navbar.js
│   │   ├── ShipmentForm.js
│   │   ├── PaymentForm.js
│   │   ├── TrackingSearch.js
│   │   ├── LabelPreview.js
│   │   └── StatsCard.js
│   │
│   ├── services
│   │   ├── authService.js
│   │   ├── shipmentService.js
│   │   ├── paymentService.js
│   │   └── adminService.js
│   │
│   ├── utils
│   │   ├── apiClient.js
│   │   └── validation.js
│   │
│   └── App.js
```

---

## Backend File Structure

```
backend/
├── server.js
├── app.js
│
├── config
│   ├── database.js
│   ├── jwtConfig.js
│   └── securityConfig.js
│
├── routes
│   ├── authRoutes.js
│   ├── shipmentRoutes.js
│   ├── paymentRoutes.js
│   ├── trackingRoutes.js
│   └── adminRoutes.js
│
├── controllers
│   ├── authController.js
│   ├── shipmentController.js
│   ├── paymentController.js
│   ├── trackingController.js
│   └── adminController.js
│
├── services
│   ├── userService.js
│   ├── shipmentService.js
│   ├── priceService.js
│   ├── insuranceService.js
│   ├── paymentService.js
│   ├── labelService.js
│   ├── trackingService.js
│   └── reportService.js
│
├── middleware
│   ├── authMiddleware.js
│   ├── validationMiddleware.js
│   └── errorHandler.js
│
├── models
│   ├── User.js
│   ├── Shipment.js
│   ├── Payment.js
│   └── Tracking.js
│
├── utils
│   ├── pdfGenerator.js
│   ├── qrGenerator.js
│   └── trackingNumberGenerator.js
│
└── tests
    ├── auth.test.js
    ├── shipment.test.js
    └── payment.test.js
```

---

## Database File Structure

```
database/
├── schema.sql
├── seed.sql
└── migrations
    ├── create_users_table.sql
    ├── create_shipments_table.sql
    ├── create_payments_table.sql
    └── create_tracking_table.sql
```

# Post Office Online Shipping System

## Project Overview

**Domain:** Post Office Online Shipping System  

**Purpose:**  
This system allows customers to prepare parcels or letters before going to the post office. Users can register, create shipping transactions, pay online, and print a shipping label. The label can be attached to the parcel or letter before dropping it off at a post office box or service location.

---

## Main Features

- Customer registration with identity verification  
  (upload national ID card and photo holding the ID)

- Account approval process by post office staff

- Customer login using email and password

- Create shipping orders by selecting parcel type, size, and weight

- Enter receiver information and delivery location

- Automatic price calculation for shipping services

### Electronic Payment Methods
- Mobile banking (PromptPay)
- Credit card
- E-wallet (e.g., TrueMoney Wallet)

- Generate a **PDF shipping label** containing sender and receiver details and a QR code for parcel tracking

- Customers can track parcel status using a tracking number

- Optional insurance for valuable items

### Administrative Dashboard
Post office staff can:

- Monitor number of parcels per **day, week, and month**
- View revenue reports
- Generate **formatted PDF reports** for management

---

## System Requirements

- High availability with **99.999% uptime**
- Fast response time (pages should respond within **1 second**)
- Strong security to protect sensitive information such as national ID and payment data
- Data encryption for **database storage and network transmission**
- System theme follows **Thailand Post design (white and red)**

---

## Architecture

The project is separated into two main parts:

### Backend
**Node.js + Express**

Provides REST API services and handles database operations.

### Frontend
**HTML / Web Interface**

Provides user interfaces for customers and staff to interact with the system.

---

## Build & Run Instructions

### 1. Open the Project

Open the repository workspace in **Visual Studio Code**.

---

### 2. Start the Website Server

Click the **"Go Live"** button located at the **bottom-right corner** of VS Code.

This will start the local development server.

---

### 3. Navigate to the Frontend Files

Follow this folder path in the file explorer:

```
implementations
└── frontend
    └── src
        └── Pages
```

---

### 4. Open the Login Page

Open the file:

```
loginpage.html
```

---

### 5. Run the System

Once the file is opened, the browser will display the **login page of the Post Office system** where users can:

- Register a new account
- Log in to the system
- Access parcel services
