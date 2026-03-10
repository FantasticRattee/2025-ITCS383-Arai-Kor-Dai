## Frontend File Structure

frontend/

├── index.html

├── pages/
│   ├── login.html
│   ├── dashboard.html
│   ├── create-parcel.html
│   ├── customer.html
│   └── tracking.html

├── css/
│   ├── style.css
│   ├── dashboard.css
│   └── form.css

├── js/
│   ├── api.js
│   ├── auth.js
│   ├── parcel.js
│   ├── tracking.js
│   └── customer.js

├── components/
│   ├── navbar.js
│   └── footer.js

└── assets/
    ├── images/
    └── icons/


## Backend File Structure

backend/

├── server.js
├── package.json
├── .env

├── config/
│   └── db.js

├── routes/
│   ├── authRoutes.js
│   ├── parcelRoutes.js
│   ├── customerRoutes.js
│   └── paymentRoutes.js

├── controllers/
│   ├── authController.js
│   ├── parcelController.js
│   ├── customerController.js
│   └── paymentController.js

├── models/
│   ├── parcelModel.js
│   ├── customerModel.js
│   ├── paymentModel.js
│   └── staffModel.js

├── middleware/
│   ├── authMiddleware.js
│   └── errorHandler.js

├── services/
│   ├── trackingService.js
│   └── notificationService.js

└── database/
    └── schema.sql



