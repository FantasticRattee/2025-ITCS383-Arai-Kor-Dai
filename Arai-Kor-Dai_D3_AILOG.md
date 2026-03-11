The first we use for 

Read the AGENTS.md file and generate the initial project structure for the Post Office Management System.

Requirements:

Separate frontend and backend directories.
Backend must use Node.js with Express and PostgreSQL.
Follow MVC architecture with folders: routes, controllers, models, middleware, config.
Frontend must contain pages, css, js, components, and assets folders.
Generate:

Full project folder structure.
Backend starter files including:
server.js
database connection (PostgreSQL)
basic Express configuration
Frontend starter files including:
index.html
base CSS
base JavaScript file for API calls.
Include comments explaining the purpose of each file.
Do not implement full features yet, only create the clean system skeleton based on AGENTS.md.


the result is :

✅ Project Initialization Complete!
I've successfully generated the complete Post Office Management System project skeleton based on your Agend.md specifications. Here's what was created:

📁 Backend Structure (backend)
config/ - Server and database configuration files
database.js - PostgreSQL connection pool with parameterized query support
config.js - Centralized environment configuration
routes/ - API endpoint definitions (ready for implementation)
controllers/ - Business logic handlers (skeleton prepared)
models/ - Database entity models (skeleton prepared)
middleware/ - Express middleware (authentication, validation, etc.)
server.js - Main Express server with middleware setup
package.json - Dependencies (Express, PostgreSQL driver, dotenv, CORS)
.env.example - Environment configuration template
🎨 Frontend Structure (frontend)
index.html - Main landing page with navigation and layout
css/ - styles.css with CSS variables, responsive grid, typography, and component styles
js/ - api.js - Fully functional REST API client module with GET/POST/PUT/DELETE methods
pages/ - Directory for 15+ page templates (documented roadmap)
components/ - Directory for reusable UI components (documented structure)
assets/ - Static assets directory with organization guidelines
📚 Documentation
PROJECT_INITIALIZATION.md - Complete setup guide with:
Environment variable configuration
Database setup instructions
Backend/frontend development roadmap
Next steps broken into phases
Technology stack overview
✨ Key Features
✓ Full MVC architecture with clean separation of concerns
✓ PostgreSQL connection pooling with parameterized queries
✓ API client with JWT token support and error handling
✓ Responsive CSS framework with mobile-first design
✓ All files include detailed comments explaining purpose and usage



PostgreSQL Best Practices Implemented:

SERIAL primary keys for auto-incrementing IDs
Proper foreign key relationships with CASCADE/SET NULL constraints
UNIQUE constraints on tracking numbers and emails
TIMESTAMP WITH TIME ZONE for all timestamps
JSONB fields for flexible data storage (dimensions, payment details, etc.)
Comprehensive indexes on frequently queried columns
Triggers for automatic updated_at timestamp management
Supported Functionality:

✅ Customer registration and account verification
✅ Shipment creation with cost calculation
✅ Insurance options
✅ Online payments (credit card, PromptPay, e-wallet)
✅ Shipping label generation (data structure supports PDF generation)
✅ Parcel tracking with history
✅ Transaction history
✅ Admin statistics and revenue reports



Key Features:
Database Integration:

Uses the pg library with connection pooling
Parameterized queries for SQL injection prevention
JSONB support for flexible data storage
CRUD Operations:

Create, Read, Update, Delete methods for all entities
Advanced querying (by status, date ranges, relationships)
Business Logic:

Account verification workflows
Payment processing
Tracking updates
Insurance calculations
Revenue reporting
Updated index.js:

Centralized model exports for easy importing



Key Features:
RESTful API Design:

Standard HTTP methods (GET, POST, PUT, DELETE)
Consistent response format with success/error handling
Parameter validation and error messages
Business Logic:

Auto-generation of tracking numbers and transaction IDs
Status management workflows
Revenue and statistics calculations
Bulk operations for parcels
Integration:

Updated controllers/index.js and routes/index.js
Modified server.js to register API routes at /api
All routes properly connected to controllers
Security Considerations:

Parameterized queries prevent SQL injection
Input validation on critical operations
Proper error handling without exposing sensitive data