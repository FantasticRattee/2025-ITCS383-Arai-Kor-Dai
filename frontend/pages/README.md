# Frontend Pages Directory

## Purpose
This directory contains individual page templates for the Post Office Management System.

## Available Pages (to be implemented)

### Authentication Pages
- **login.html** - Staff/Admin login page
- **register.html** - Staff registration page
- **forgot-password.html** - Password recovery page

### Dashboard Pages
- **dashboard.html** - Main dashboard with statistics and overview
- **home.html** - Home/landing page for authenticated users

### Parcel Management Pages
- **parcels.html** - List all parcels with filtering and search
- **parcel-detail.html** - View detailed information about a specific parcel
- **parcel-create.html** - Create new parcel shipment
- **parcel-edit.html** - Edit existing parcel information

### Customer Management Pages
- **customers.html** - List all customers
- **customer-detail.html** - View customer profile and history
- **customer-create.html** - Register new customer
- **customer-edit.html** - Edit customer information

### Tracking Pages
- **tracking.html** - Search and track parcels by tracking number
- **tracking-history.html** - View complete tracking history

### Payment Pages
- **payments.html** - List all payments
- **payment-process.html** - Payment processing page (Credit card, PromptPay, E-wallet)
- **payment-receipt.html** - Payment confirmation and receipt

### Admin/Settings Pages
- **admin-panel.html** - Admin dashboard and tools
- **settings.html** - Application settings and preferences
- **staff-management.html** - Manage staff accounts and roles

## File Naming Convention
- Use lowercase with hyphens: `parcel-create.html`
- Use descriptive names that match the page purpose

## Page Structure Template
Each page should include:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Page Title - Post Office Management</title>
  <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
  <!-- Content here -->
  <script src="../js/api.js"></script>
  <script src="page-script.js"></script>
</body>
</html>
```

## Implementation Notes
- Each page should import the base styles.css
- Pages should use components from the components directory
- Pages should communicate with API through the api.js module
- Follow responsive design principles using CSS media queries
