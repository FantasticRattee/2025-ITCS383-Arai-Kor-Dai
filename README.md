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
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── Pages/
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   └── setupTests.js
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── Agent.md
```

---

## Backend File Structure

```
implementations/
└── backend/
    ├── node_modules/
    ├── routes/
    │   ├── activity.js
    │   ├── notifications.js
    │   ├── shipments.js
    │   └── users.js
    ├── .env
    ├── db.js
    ├── package-lock.json
    ├── package.json
    └── server.js
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

**React / Web Interface**

Provides user interfaces for customers and staff to interact with the system.

---

# Getting Started — Run Locally
 
## Prerequisites
 
Make sure you have the following installed before getting started:
 
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (comes bundled with Node.js)
- [Git](https://git-scm.com/)
- [MySQL](https://dev.mysql.com/downloads/)
 
---
 
## 1. Clone the Repository
 
```bash
git clone https://github.com/ICT-Mahidol/2025-ITCS383-Arai-Kor-Dai.git
cd 2025-ITCS383-Arai-Kor-Dai
```
 
---
 
## 2. Set Up the Database
 
Run the setup script to create the database and tables:
 
```bash
mysql -u root -p < implementations/backend/setup.sql
```
 
Enter your MySQL password when prompted.
 
---
 
## 3. Set Up Environment Variables
 
Create a `.env` file inside `implementations/backend/`:
 
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=postoffice
PORT=3000
```
 
> Change `DB_PASS` to match **your own** MySQL password.
 
---
 
## 4. Run the Backend
 
```bash
cd implementations/backend
npm install
node server.js
```
 
Keep this terminal open.
 
---
 
## 5. Run the Frontend (React)
 
Open a **second terminal**:
 
```bash
cd implementations/frontend
npm install
npm start
```
 
When prompted `Would you like to run the app on another port instead? (Y/n)`, press `Y`.
 
Your browser should open at `http://localhost:3001` (port 3000 is already used by the backend).
 
---
 
## Quick Summary
 
| Step | Command |
|------|---------|
| Clone | `git clone https://github.com/ICT-Mahidol/2025-ITCS383-Arai-Kor-Dai.git` |
| Setup DB | `mysql -u root -p < implementations/backend/setup.sql` |
| Start backend | `cd implementations/backend && npm install && node server.js` |
| Start frontend | `cd implementations/frontend && npm install && npm start` |
 
---
 
## Troubleshooting
 
- **DB Access Denied** — Check that `DB_PASS` in `.env` matches your MySQL password.
- **Unknown database 'postoffice'** — Run the setup script in Step 2 first.
- **`.env` not found** — Make sure the file is inside `implementations/backend/`, not the project root.
- **Port conflict** — Press `Y` when prompted to switch to the next available port.
- **`npm` not found** — Install [Node.js](https://nodejs.org/) first; npm
