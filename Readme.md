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
