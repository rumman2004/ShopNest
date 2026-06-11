# ShopNest — Multi-Tenant Point of Sale (POS) System

## Major Project Report

**Submitted in partial fulfillment of requirement for the award of the degree of**

### Bachelor of Computer Application

---

**Submitted By**

**Rumman Ahmed**
Roll No: 23992035
Registration No: C2300510

**Under the supervision of**

**Mr. Panchanan Saikia**
_Assistant Professor_

**Sibsagar Commerce College**
Sibsagar, Assam
Session: (2022–25)

---

## CERTIFICATE OF ACCEPTANCE

This is to certify that **Rumman Ahmed** of Sibsagar Commerce College has successfully completed the project entitled **"ShopNest — Multi-Tenant Point of Sale (POS) System"** under the supervision of Mr. Panchanan Saikia, during the period from _______________ to _______________.

The project work has been carried out in partial fulfilment of the requirements for the award of the degree of Bachelor of Computer Applications, and is hereby accepted by Sibsagar Commerce College.

---

___________________________________
**Signature of Supervisor**
Name: Mr. Panchanan Saikia
Date: _______________

---

## CERTIFICATE FROM THE GUIDE

This is to certify that the project entitled **"ShopNest — Multi-Tenant Point of Sale (POS) System"**, submitted to the Department of Computer Application, Sibsagar Commerce College, Sibsagar, is submitted in partial fulfilment of the requirements for the 6th Semester of the Bachelor of Computer Application (BCA) program.

The project work has been carried out by the following student:

1. **Rumman Ahmed**

This work is a result of his sincere efforts and has been completed under my supervision and guidance.

---

___________________________________
**Signature of the Guide**
Mr. Panchanan Saikia
Date: _______________

---

## CERTIFICATE FROM THE EXAMINER

This is to certify that the project report entitled **"ShopNest — Multi-Tenant Point of Sale (POS) System"**, submitted to the Department of Computer Application, Sibsagar Commerce College, Sibsagar, in partial fulfilment of the requirements for the 6th Semester of the Bachelor of Computer Application (BCA) program, has been evaluated by us on _______________.

---

___________________________________
**Signature of the Examiner**
Name(s): _______________

---

## INDEX

| Chapter No. | Chapter Title | Page No. |
|:-----------:|:----------------------------------------------|:--------:|
| 1 | Introduction & Objectives | |
| 2 | Key Features of the System | |
| 3 | Tools & Development Environment | |
| 4 | System Analysis | |
| 5 | System Design | |
| 6 | Testing & Validation | |
| 7 | Input and Output Design | |
| 8 | Database Design | |
| 9 | Advantages of the Proposed System | |
| 10 | Future Scope of the Project | |
| 11 | Output Screens | |
| 12 | Conclusion | |

---

## Chapter 1 — Introduction

In today's competitive retail environment, efficiently managing sales transactions, product inventories, staff operations, and revenue analytics within shops is essential for maximizing profitability, reducing losses, and improving customer satisfaction. Traditional manual billing using physical registers and handwritten ledgers is not only time-consuming and error-prone but also lacks the visibility needed for data-driven business decisions.

This project presents **ShopNest**, a comprehensive, production-ready **Multi-Tenant Point of Sale (POS) System** developed using a modern full-stack web technology stack — **React.js, Vite, Express.js, Node.js, and MySQL** — to streamline sales processing, inventory tracking, cashier management, and financial reporting for retail businesses.

The system is designed as a multi-tenant architecture, meaning a single deployment can serve multiple store owners, each with their own isolated data, shops, products, and cashiers. This makes ShopNest ideal for both independent shop owners and small retail chains looking for a lightweight yet powerful POS solution.

The system provides a seamless and user-friendly interface for two key user roles:

**Owner Panel:** Centralized administrative control to create and manage multiple shops, add and supervise cashiers, maintain product catalogues with images, track real-time revenue and sales analytics through interactive dashboards, and generate detailed financial reports.

**Cashier Panel:** A streamlined, purpose-built Point of Sale terminal interface for cashiers to quickly process sales transactions, check current product stock availability, and view their daily sales history — all within a fast and intuitive workflow.

---

## Objectives of the Project

- To develop a modern, web-based Multi-Tenant Point of Sale (POS) and Inventory Management System using React.js, Express.js, Node.js, and MySQL.
- To provide role-based access control for Owners and Cashiers with distinct dashboards and permissions.
- To simplify the sales billing process with an intuitive POS terminal interface featuring real-time product search and cart management.
- To enable comprehensive inventory management with bulk product upload capability via Excel file parsing.
- To provide centralized product image hosting through Cloudinary integration for optimized, fast-loading media.
- To implement real-time, interactive business analytics dashboards with revenue tracking, top-selling products, and sales flow visualizations using Recharts.
- To ensure enterprise-grade security with JWT-based authentication, bcrypt password hashing, Helmet, rate limiting, and CORS protection.
- To create a fully responsive interface that works seamlessly on desktop terminals and mobile tablets.
- To build a scalable, modular system that can handle multiple shops, products, cashiers, and large transaction volumes.
- To allow future enhancements such as barcode scanning, receipt printing, customer loyalty programs, and multi-branch analytics.

---

## Chapter 2 — Key Features of the System

### 2.1 Owner Features

- **Owner Registration & Login** — Secure account creation and authentication
- **Multi-Shop Management** — Create, update, and delete multiple shops/branches with logos
- **Shop Switching** — Seamlessly switch between shops from a single dashboard
- **Interactive Dashboard** — Real-time analytics with revenue charts, top-selling products, recent transactions, and key performance indicators (KPIs)
- **Product & Inventory Management** — Full CRUD operations for products with image upload, SKU codes, cost prices, selling prices, stock quantities, and category assignment
- **Bulk Product Upload** — Import product catalogues from Excel (XLSX) files for rapid inventory setup
- **Category Management** — Create and organize product categories per shop
- **Cashier Management** — Add, edit, activate/deactivate, and delete cashiers assigned to specific shops
- **Financial Reports** — Detailed sales analytics, revenue trends, cashier performance metrics, and inventory valuation reports
- **Activity Logs** — Track all inventory-related actions (product CRUD, stock adjustments, image uploads) for audit purposes
- **Low Stock Alerts** — Automatic identification of products running low on stock
- **Digital Receipts** — Automated email receipt dispatching via EmailJS integration

### 2.2 Cashier Features

- **Cashier Login** — Secure login with credentials assigned by the shop owner
- **POS Terminal** — Dedicated point-of-sale interface with real-time product search, add-to-cart, quantity adjustment, and checkout
- **Cart Management** — Add/remove items, adjust quantities, view running totals
- **Sales Processing** — Complete transactions with tendered amount and automatic change calculation
- **Daily Sales History** — View detailed log of all transactions processed during the current day
- **Stock Checking** — Quick inventory lookup to check product availability and stock levels

### 2.3 System-Wide Features

- Built using a modern full-stack: **React 19, Vite 7, Express.js, Node.js, MySQL**
- **Role-Based Access Control:** Owner and Cashier with distinct permissions and dashboards
- **Responsive UI** with Tailwind CSS for desktop, tablet, and mobile
- **Dynamic Charts** using Recharts (Bar, Line, Area, Pie) for business analytics
- **Enterprise-Grade Security** with JWT, Bcrypt, Helmet, CORS, and Rate Limiting
- **RESTful API v1** with comprehensive endpoint documentation
- **Cloudinary CDN** for optimized product image storage and delivery
- **Deployed on Vercel** (both Frontend and Backend) with **AWS-hosted MySQL** database

---

## Chapter 3 — Tools & Development Environment

### 3.1 Frontend Technologies

| Technology | Description |
|---|---|
| **React 19** | JavaScript library for building interactive, component-based user interfaces |
| **Vite 7** | Next-generation frontend build tool for extremely fast development and HMR |
| **Tailwind CSS 4** | Utility-first CSS framework for creating fully responsive and modern layouts |
| **React Router DOM 6** | Client-side routing and navigation between different screens and protected routes |
| **React Hook Form** | Performant, flexible form handling with easy validation |
| **Recharts** | Composable charting library for implementing dynamic bar, line, area, and pie charts |
| **Lucide React** | Beautiful, consistent icon pack with lightweight, scalable SVG icons |
| **Axios** | Promise-based HTTP client for making API requests to the backend |
| **Date-fns** | Modern JavaScript date utility library for formatting and manipulating dates |
| **XLSX** | Library for parsing and generating Excel spreadsheets (bulk product upload) |
| **EmailJS** | Client-side email service for sending digital receipts and notifications |
| **GSAP** | Professional-grade animation library for smooth UI animations and transitions |

### 3.2 Backend Technologies

| Technology | Description |
|---|---|
| **Node.js** | JavaScript runtime for developing fast and scalable server-side applications |
| **Express.js 4** | Minimal and flexible web application framework for creating RESTful APIs |
| **MySQL** (via `mysql2`) | Relational database management system for structured data storage with ACID compliance |
| **JSON Web Tokens (JWT)** | Token-based authentication for secure, stateless API access |
| **Bcryptjs** | Library for securely hashing passwords before storage |
| **Helmet** | Security middleware that sets various HTTP headers to protect against common vulnerabilities |
| **CORS** | Cross-Origin Resource Sharing middleware for secure cross-domain requests |
| **Express Rate Limiter** | Middleware to limit repeated requests and protect against brute-force attacks |
| **Joi** | Powerful schema-based data validation library for request payloads |
| **Express Validator** | Middleware for validating and sanitizing incoming request data |
| **Multer** | Middleware for handling multipart/form-data, used for file (image) uploads |
| **Cloudinary SDK** | Cloud-based image and video management API for product image hosting and optimization |
| **Winston** | Versatile logging library for structured application logging |
| **Morgan** | HTTP request logger middleware for development debugging |
| **Compression** | Response compression middleware to reduce payload sizes |
| **Cookie Parser** | Middleware for parsing cookies attached to client requests |

### 3.3 Development Tools

| Tool | Purpose |
|---|---|
| **Visual Studio Code (VS Code)** | Primary code editor used for development |
| **Postman** | API testing tool for validating backend RESTful services |
| **MySQL Workbench** | GUI tool for designing, managing, and querying the MySQL database |
| **Git & GitHub** | Version control system and code repository for source code management |
| **npm** | Node Package Manager for managing project dependencies |
| **Nodemon** | Development utility that automatically restarts the server on file changes |
| **ESLint** | JavaScript linting tool to enforce code quality and consistent coding standards |
| **Jest & Supertest** | Testing frameworks for unit and integration testing of the backend API |

### 3.4 Deployment Platforms

| Platform | Usage |
|---|---|
| **Frontend Deployment: Vercel** | Platform for hosting and deploying the React frontend with automatic CI/CD integration and global edge network |
| **Backend Deployment: Vercel** | Serverless deployment of the Node.js/Express.js backend API as Vercel Serverless Functions with automatic scaling |
| **Database Hosting: AWS (Amazon Web Services)** | Cloud-hosted MySQL database on AWS RDS (Relational Database Service) for production deployment with high availability, automated backups, and scalability |
| **Media Storage: Cloudinary** | Cloud-based CDN for product image storage, optimization, and delivery |

---

## Chapter 4 — System Analysis

### 4.1 Problem Statement

In most small to medium retail businesses, sales processing, inventory tracking, cashier management, and financial reporting are handled manually or through fragmented, offline systems. This often leads to:

- **Time-consuming billing processes** — Manual calculation and handwritten receipts slow down checkout
- **Inventory inaccuracies** — Stock levels are not tracked in real-time, leading to overstocking or stockouts
- **No centralized data access** — Sales data, product information, and staff records exist in disconnected spreadsheets or paper registers
- **Revenue leakage** — Without proper analytics, owners cannot identify top-selling products, slow movers, or revenue trends
- **Cashier accountability issues** — No audit trail of which cashier processed which transactions
- **Multi-store management complexity** — Owners with multiple branches cannot view consolidated reports from a single interface
- **No real-time analytics** — Business decisions are made based on outdated or incomplete information
- **Security vulnerabilities** — Shared passwords, no role-based access, and unencrypted data

### 4.2 Proposed Solution

The proposed **ShopNest POS System** addresses these issues by providing:

- A **web-based, centralized system** for managing sales, inventory, cashiers, and financial analytics across multiple shops
- **Role-based access control** for Owners (admin) and Cashiers (staff) with distinct permissions
- **Real-time POS terminal** with product search, cart management, and instant checkout
- **Live inventory tracking** with stock levels updated automatically after every sale
- **Interactive dashboards** with bar charts, line charts, and KPI counters for revenue, sales trends, and product performance
- **Multi-tenant architecture** allowing owners to manage multiple shops from a single account
- **Activity logging** for complete audit trails of all inventory and sales actions
- **Bulk product upload** via Excel for rapid store setup
- **Cloud-based image hosting** through Cloudinary for optimized product photos
- **Enterprise-grade security** with JWT authentication, bcrypt password hashing, Helmet, rate limiting, and CORS
- **Mobile-friendly design** for easy access on smartphones and tablets
- **Automated email receipts** via EmailJS integration

### 4.3 Functional Requirements

**Owner:**
- Register and manage their account
- Create and manage multiple shops with logos and details
- Add, edit, and delete products with images, prices, stock, SKU, and categories
- Bulk upload products via Excel files
- Add and manage cashiers with activation/deactivation controls
- View interactive dashboard with revenue analytics, top products, and recent sales
- Generate financial reports (sales analytics, revenue trends, cashier performance, inventory reports)
- View activity logs for audit purposes
- Receive low stock alerts

**Cashier:**
- Login with credentials provided by the owner
- Process sales through the POS terminal with product search and cart
- View daily sales history
- Check product stock availability

**System:**
- RESTful APIs for smooth data flow between frontend and backend
- JWT-based authentication and authorization
- Paginated API responses for handling large datasets
- Cloud-based image upload and delivery
- Structured error handling and logging

### 4.4 Non-Functional Requirements

| Requirement | Details |
|---|---|
| **Usability** | Intuitive, clean interface designed for retail environments; minimal training required |
| **Performance** | Fast page loads, efficient API responses with pagination, response compression |
| **Security** | Password hashing with bcrypt, JWT token-based authentication, Helmet headers, rate limiting, CORS, input validation with Joi & Express Validator |
| **Scalability** | Multi-tenant architecture; modular codebase; capable of handling many shops, products, cashiers, and transactions |
| **Responsiveness** | Fully responsive design accessible on desktop, tablet, and mobile devices |
| **Reliability** | MySQL ACID transactions ensure data integrity; proper error handling and logging with Winston |
| **Maintainability** | Modular folder structure, separation of concerns (routes → controllers → services → database) |

### 4.5 Feasibility Study

**Technical Feasibility:** Built on a proven and widely-adopted technology stack (React, Node.js, Express, MySQL). All libraries and frameworks used are mature, well-documented, and actively maintained with strong community support.

**Operational Feasibility:** The system dramatically improves daily retail workflow for shop owners and cashiers. The intuitive UI requires minimal training. Role-based access ensures each user sees only relevant functionality.

**Economic Feasibility:** As a web-based solution, ShopNest eliminates the need for expensive proprietary POS hardware and software licenses. Cloud deployment (Vercel for frontend and backend, AWS for database, Cloudinary for media) offers cost-effective tiers suitable for small businesses. The system reduces manual bookkeeping effort and improves revenue visibility.

---

## Chapter 5 — System Design

### 5.1 System Architecture

ShopNest follows a modern **Client-Server Architecture** based on the React + Express + MySQL stack. The system is divided into two main user roles — **Owner** and **Cashier** — each with its own dedicated dashboard, layout, and access privileges.

The **React.js frontend** (built with Vite) communicates with the **Node.js/Express.js backend** via **RESTful APIs** (versioned as `/api/v1`). Both frontend and backend are deployed on **Vercel**. All data is securely stored in a **MySQL database hosted on AWS RDS**. Product images are hosted on **Cloudinary CDN**.

```
+-------------------------------+       +-------------------------------+
|   React Frontend (UI)         | <---> |   Node.js + Express.js API    |
|   (Vite, Tailwind CSS,        |  REST |   Backend Server              |
|    Recharts, React Hook Form)  |       |   (JWT Auth, Helmet, CORS)    |
|   [Deployed on Vercel]         |       |   [Deployed on Vercel]         |
+-------------------------------+       +-------------------------------+
                                                    |
                    +---------------+        +---------------+
                    |  MySQL DB     |        |  Cloudinary   |
                    |  (AWS RDS)    |        |  (Images CDN) |
                    +---------------+        +---------------+
```

### 5.2 Data Flow Diagrams

#### DFD Level 0 — Context Diagram

```
                    +------------------------------+
    Owner --------->|                              |--------> MySQL DB
                    |       ShopNest POS System    |
    Cashier ------->|          (0.0)               |--------> Cloudinary
                    |                              |
                    +------------------------------+
                              |
                    Login / Verify Credentials
                    Access Role-Based Dashboard
                    Process Sales, Manage Inventory
```

#### DFD Level 1 — Owner Site

```
Login (1.0)
  Owner → Users DB → Verify Credentials → Access Owner Dashboard

Manage Shops (1.1)
  Owner → Shops DB → Create/Update/Delete Shop → Display Updated Shop List

Manage Products (1.2)
  Owner → Products DB → Add/Edit/Delete Product → Upload Image to Cloudinary
  Owner → Products DB → Bulk Upload via XLSX → Store Products

Manage Categories (1.3)
  Owner → Categories DB → Add/Edit/Delete Category → Display Updated Category List

Manage Cashiers (1.4)
  Owner → Cashiers DB → Add/Edit/Activate/Deactivate Cashier → Display Updated List

View Dashboard (1.5)
  Owner → Sales DB, Products DB → Fetch Analytics → Display Charts & KPIs

Financial Reports (1.6)
  Owner → Sales DB, Products DB → Generate Reports → Display Revenue Trends,
  Cashier Performance, Top Products, Inventory Valuation

View Activity Logs (1.7)
  Owner → Activity Logs DB → Fetch Logs → Display Activity History

Logout (1.8)
  Owner → Clear JWT Token → Redirect to Login
```

#### DFD Level 1 — Cashier Site

```
Login (1.0)
  Cashier → Users DB → Verify Credentials → Access Cashier Dashboard

POS Terminal (1.1)
  Cashier → Products DB → Search Products → Add to Cart
  Cashier → Sales DB → Process Checkout → Record Transaction
  Cashier → Products DB → Auto-Decrement Stock

Daily Sales (1.2)
  Cashier → Sales DB → Fetch Today's Transactions → Display Sales History

Stock Check (1.3)
  Cashier → Products DB → Search/Browse Products → Display Stock Levels

Logout (1.4)
  Cashier → Clear JWT Token → Redirect to Login
```

### 5.3 Major System Components

#### Owner Module
- Owner registration & secure login (JWT + bcrypt)
- Interactive dashboard with system summary, revenue charts, top-selling products, and KPIs
- Create / manage multiple shops with logos (Cloudinary)
- Add / edit / delete products with images, pricing, stock, SKU, and categories
- Bulk product import from Excel (XLSX)
- Manage product categories per shop
- Add / manage cashiers with activation/deactivation controls
- Detailed financial reports (sales analytics, revenue trends, cashier performance, inventory)
- Activity log viewer for audit trail
- Low stock alert monitoring

#### Cashier Module
- Cashier login with shop-assigned credentials
- POS terminal with real-time product search and cart management
- Transaction checkout with tendered amount and change calculation
- Daily sales history viewer
- Product stock availability checker

#### API Module (Backend)
- RESTful API with versioned endpoints (`/api/v1/`)
- JWT-based authentication and token refresh
- Role-based authorization middleware
- Shop access validation middleware
- Image upload handling (Multer → Cloudinary)
- Paginated responses for large datasets
- Structured error handling with custom `ApiError` class
- Request logging (Morgan) and application logging (Winston)
- Rate limiting and security headers (Helmet)

### 5.4 Design Considerations

**Security:**
- Passwords hashed with bcrypt (10 salt rounds)
- JWT access tokens and refresh tokens for authentication
- Role-based access control (Owner / Cashier)
- Shop-level data isolation (multi-tenant)
- Helmet security headers
- Rate limiting (100 req/15 min in production)
- Input validation with Joi and Express Validator
- CORS restriction to allowed frontend origin

**Responsiveness:**
- Mobile-first design using Tailwind CSS
- Fully responsive layouts for desktop, tablet, and mobile
- Touch-friendly POS terminal for tablet use

**Scalability:**
- Multi-tenant architecture with shop-level data isolation
- Modular code structure (modules → routes → controllers → services)
- Paginated API responses
- Connection pooling for MySQL
- Stateless JWT authentication (horizontally scalable)

**Performance:**
- Vite for fast frontend builds and HMR
- Response compression middleware
- Optimized image delivery via Cloudinary CDN
- Indexed database queries
- Asynchronous processing throughout the backend

**Visualization:**
- Recharts library for interactive bar, line, area, and pie charts
- Dashboard KPI counters for at-a-glance business metrics
- Revenue trend visualizations and product performance analytics

---

## Chapter 6 — Testing & Validation

To ensure that ShopNest functions correctly and meets user expectations, comprehensive testing and validation were performed on all modules of the system. Both manual testing and automated API testing were conducted throughout the development process.

### 6.1 Objectives of Testing

- To verify that all core functionalities (sales, inventory, auth, reports) work as per project requirements
- To identify and resolve bugs or errors in both frontend and backend
- To test security mechanisms (bcrypt password hashing, JWT authentication, role-based access, rate limiting)
- To ensure smooth interaction between the React frontend and Express.js backend via RESTful APIs
- To ensure data accuracy (sales totals, stock quantities, financial reports)
- To validate responsiveness and performance across multiple devices and browsers

### 6.2 Types of Testing Performed

#### 1. Unit Testing
- Testing of individual React components (forms, cards, charts, modals)
- Context providers (AuthContext, CartContext, ShopContext, ThemeContext) tested in isolation
- Backend API endpoint handlers tested using **Jest** and **Supertest**
- Utility functions (pagination, date range, JWT, bcrypt) tested independently

#### 2. Integration Testing
- Interaction between React frontend and Express backend via Axios
- Complete data flow: UI → API → MySQL → Response → UI Rendering
- Correct rendering of Recharts charts with live data
- Cart context integration with POS terminal checkout flow
- Image upload pipeline: Multer → Cloudinary → Product creation/update

#### 3. System Testing
Testing of full end-to-end workflows:
- Owner registers → Creates shop → Adds products (with images) → Adds cashier
- Owner views dashboard → Checks analytics → Generates financial reports
- Cashier logs in → Searches products → Adds to cart → Processes checkout
- Cashier views daily sales → Checks stock availability
- Owner bulk uploads products via Excel → Verifies inventory
- Owner manages cashier status (activate/deactivate) → Cashier access changes accordingly

#### 4. Security Testing
- Password hashing verified with bcrypt (plaintext never stored)
- JWT token-based secure login/logout with token refresh mechanism
- Role-based access (Owner/Cashier segregation) — cashiers cannot access owner routes and vice versa
- Shop-level data isolation (owners can only access their own shops' data)
- Rate limiting tested (429 responses after threshold)
- Helmet security headers verified in responses
- SQL injection prevention through parameterized queries (mysql2 prepared statements)
- Input validation tested with malformed payloads (Joi validation errors returned)

#### 5. Cross-Browser Testing
- Google Chrome
- Mozilla Firefox
- Microsoft Edge

#### 6. Responsiveness Testing
- Desktop (1920×1080, 1366×768)
- Tablet (iPad, 768×1024)
- Mobile (Android and iOS, 375×667)

### 6.3 Testing Tools Used

| Tool | Purpose |
|---|---|
| **Jest** | JavaScript testing framework for unit and integration tests |
| **Supertest** | HTTP assertion library for testing Express.js API endpoints |
| **Postman** | API testing tool for manual endpoint validation |
| **React Developer Tools** | Browser extension for component and state inspection |
| **Chrome DevTools** | Layout, performance, network, and responsiveness testing |
| **MySQL Workbench** | Direct database verification and query testing |
| **ESLint** | Static code analysis for identifying potential issues |

### 6.4 Testing Results

- ✅ All Owner module features (shop management, inventory, cashier management, reports) passed test cases
- ✅ All Cashier module features (POS terminal, daily sales, stock check) passed test cases
- ✅ Secure authentication and password hashing working correctly
- ✅ JWT token refresh mechanism functioning properly
- ✅ Role-based access control enforced correctly
- ✅ Fast API response times with correct behavior (< 200ms average)
- ✅ No critical UI bugs across devices and browsers
- ✅ Charts and dashboards display correct real-time data
- ✅ Cloudinary image upload and delivery working correctly
- ✅ Bulk Excel upload parsing and product creation successful
- ✅ Multi-tenant data isolation verified — no cross-shop data leakage
- ✅ Financial reports and analytics calculations accurate
- ✅ No data inconsistency detected after testing full workflows

---

## Chapter 7 — Input and Output Design

Effective Input and Output Design ensures that users can interact with the system efficiently, enter accurate data, and easily understand system responses. In ShopNest, great care has been taken to design clear, user-friendly input forms and output screens that meet the needs of Owners and Cashiers.

The system provides responsive interfaces that work seamlessly on desktop, tablet, and mobile devices.

### 7.1 Input Design

**Objectives of Input Design:**
- Simplify data entry for retail operations
- Validate data to prevent errors and ensure data integrity
- Provide consistent, intuitive user experience across all modules
- Ensure security in data submission (authenticated API calls)

**Owner Input Screens:**
- Owner Registration Form (name, email, password)
- Login Form (email, password)
- Create / Edit Shop Form (shop name, category, address, logo upload)
- Add / Edit Product Form (name, SKU, price, cost price, stock quantity, description, category, image upload)
- Bulk Product Upload (Excel file selector + import)
- Add / Edit Category Form
- Add / Edit Cashier Form (name, username, password)
- Cashier Status Toggle (activate/deactivate)

**Cashier Input Screens:**
- Cashier Login Form (username, password)
- POS Terminal — Product Search Bar
- POS Terminal — Cart Item Quantity Adjuster
- POS Terminal — Checkout Form (tendered amount)
- Stock Check — Product Search / Filter

**Input Validation Techniques:**
- Required field checks (all mandatory fields enforced)
- Pattern validation (email format, minimum password length)
- Numeric validation (prices, quantities must be positive numbers)
- File type validation (image uploads: JPEG, PNG, WebP; Excel: .xlsx, .xls)
- File size limits (images: max 5MB)
- Dropdown selections for Shop, Category
- Real-time error messages for invalid input
- Secure API submission with JWT authentication headers
- Server-side validation with Joi schema and Express Validator
- Client-side validation with React Hook Form

### 7.2 Output Design

**Objectives of Output Design:**
- Provide clear, actionable business information
- Visualize revenue, sales, and inventory trends
- Display data in both chart and tabular formats
- Enable users to easily understand reports and analytics

**Owner Output Screens:**
- **Dashboard** — Revenue KPIs, total products, total cashiers, total shops, recent transactions, top-selling products (bar chart), revenue trends (line chart)
- **Shop Management** — List of shops with details, logo previews, active/inactive status
- **Inventory** — Product table with images, names, SKU, prices, stock levels, categories; search and filter capabilities
- **Cashier Management** — List of cashiers with names, usernames, active status, assigned shop
- **Financial Reports** — Sales analytics (bar/line charts), revenue trends over time, cashier performance metrics, inventory valuation summary, top products by revenue/quantity
- **Activity Logs** — Chronological log of inventory actions with user, action type, entity details

**Cashier Output Screens:**
- **POS Terminal** — Product grid/list with images, prices, stock; shopping cart with running total; checkout summary with change calculation
- **Daily Sales** — Table of today's transactions with sale ID, total amount, items count, time
- **Stock Check** — Product listing with current stock levels, search/filter

### 7.3 Visual Outputs

| Output Type | Usage |
|---|---|
| **Bar Charts** | Revenue comparison, top-selling products, cashier performance |
| **Line Charts** | Revenue trends over days/weeks/months, sales flow |
| **Area Charts** | Sales volume trends with filled visualization |
| **Pie Charts** | Product category distribution, revenue share |
| **KPI Counters** | Total revenue, total products, total cashiers, total shops |
| **Tables** | Product listings, sales records, cashier lists, activity logs |
| **Image Grids** | Product catalogue with Cloudinary-hosted images |
| **Status Badges** | Active/Inactive indicators for shops and cashiers |

### 7.4 Principles Followed

- **Simplicity and clarity** — Clean, uncluttered interface with clear visual hierarchy
- **Consistency across modules** — Uniform styling, layout patterns, and interaction paradigms
- **Immediate user feedback** — Loading states, success/error toasts, form validation messages
- **Responsive design** — Optimized for mobile, tablet, and desktop
- **Secure display of data** — Role-based access ensures users see only permitted data
- **Performance optimization** — Paginated data loading, lazy rendering, compressed responses

---

## Chapter 8 — Database Design

ShopNest uses **MySQL** as its relational database management system, leveraging the `mysql2` driver with connection pooling for efficient and reliable data access. The database is designed with a multi-tenant architecture where all data is isolated at the **shop level**, ensuring complete privacy and operational independence for each store.

### 8.1 Database Tables

| Table Name | Description |
|---|---|
| `owners` | Stores shop owner accounts (name, email, hashed password) |
| `shops` | Stores shop/branch details (name, category, address, logo, active status) |
| `user_shop_selections` | Tracks the currently active shop for each owner |
| `categories` | Stores product categories per shop |
| `cashiers` | Stores cashier accounts (name, username, hashed password, active status) |
| `products` | Stores product details (name, SKU, price, cost price, stock, image, category) |
| `sales` | Stores sales transaction headers (shop, cashier, total, tendered amount, date) |
| `sale_items` | Stores individual line items within each sale (product, quantity, unit price, subtotal) |
| `activity_logs` | Stores audit trail of inventory actions (user, action type, entity, details) |

### 8.2 Table Schema Design

#### Owners Table (`owners`)
```sql
CREATE TABLE owners (
    owner_id      INT AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Shops Table (`shops`)
```sql
CREATE TABLE shops (
    shop_id    INT AUTO_INCREMENT PRIMARY KEY,
    owner_id   INT NOT NULL,
    shop_name  VARCHAR(150) NOT NULL,
    category   VARCHAR(100),
    address    TEXT,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    logo_url   VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES owners(owner_id) ON DELETE CASCADE
);
```

#### User Shop Selections Table (`user_shop_selections`)
```sql
CREATE TABLE user_shop_selections (
    user_id        INT PRIMARY KEY,
    active_shop_id INT,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES owners(owner_id) ON DELETE CASCADE,
    FOREIGN KEY (active_shop_id) REFERENCES shops(shop_id) ON DELETE SET NULL
);
```

#### Categories Table (`categories`)
```sql
CREATE TABLE categories (
    category_id   INT AUTO_INCREMENT PRIMARY KEY,
    shop_id       INT NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE
);
```

#### Cashiers Table (`cashiers`)
```sql
CREATE TABLE cashiers (
    cashier_id    INT AUTO_INCREMENT PRIMARY KEY,
    shop_id       INT NOT NULL,
    full_name     VARCHAR(100) NOT NULL,
    username      VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active     BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE
);
```

#### Products Table (`products`)
```sql
CREATE TABLE products (
    product_id     INT AUTO_INCREMENT PRIMARY KEY,
    shop_id        INT NOT NULL,
    product_name   VARCHAR(150) NOT NULL,
    image_url      VARCHAR(255),
    sku            VARCHAR(50),
    price          DECIMAL(10, 2) NOT NULL,
    cost_price     DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock_quantity INT DEFAULT 0,
    description    TEXT DEFAULT NULL,
    category       VARCHAR(100) DEFAULT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE
);
```

#### Sales Table (`sales`)
```sql
CREATE TABLE sales (
    sale_id         INT AUTO_INCREMENT PRIMARY KEY,
    shop_id         INT NOT NULL,
    cashier_id      INT NOT NULL,
    total_amount    DECIMAL(10, 2) NOT NULL,
    tendered_amount DECIMAL(10, 2),
    sale_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE,
    FOREIGN KEY (cashier_id) REFERENCES cashiers(cashier_id) ON DELETE RESTRICT
);
```

#### Sale Items Table (`sale_items`)
```sql
CREATE TABLE sale_items (
    sale_item_id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id      INT NOT NULL,
    product_id   INT NOT NULL,
    quantity     INT NOT NULL,
    unit_price   DECIMAL(10, 2) NOT NULL,
    subtotal     DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(sale_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
);
```

#### Activity Logs Table (`activity_logs`)
```sql
CREATE TABLE activity_logs (
    log_id      INT AUTO_INCREMENT PRIMARY KEY,
    shop_id     INT NOT NULL,
    user_id     INT NOT NULL,
    user_type   ENUM('owner','cashier') NOT NULL,
    action      ENUM('product_created','product_updated','product_deleted',
                     'stock_adjusted','image_uploaded') NOT NULL,
    entity_type VARCHAR(50) NOT NULL DEFAULT 'product',
    entity_id   INT DEFAULT NULL,
    entity_name VARCHAR(150) DEFAULT NULL,
    details     JSON DEFAULT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activity_shop_date (shop_id, created_at DESC),
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE
);
```

### 8.3 Entity Relationship Diagram (ER Diagram)

```mermaid
erDiagram
    OWNERS ||--o{ SHOPS : "owns"
    OWNERS ||--o| USER_SHOP_SELECTIONS : "has active"
    SHOPS ||--o{ CATEGORIES : "has"
    SHOPS ||--o{ CASHIERS : "employs"
    SHOPS ||--o{ PRODUCTS : "stocks"
    SHOPS ||--o{ SALES : "records"
    SHOPS ||--o{ ACTIVITY_LOGS : "tracks"
    CASHIERS ||--o{ SALES : "processes"
    SALES ||--o{ SALE_ITEMS : "contains"
    PRODUCTS ||--o{ SALE_ITEMS : "sold in"

    OWNERS {
        INT owner_id PK
        VARCHAR full_name
        VARCHAR email UK
        VARCHAR password_hash
        TIMESTAMP created_at
    }

    SHOPS {
        INT shop_id PK
        INT owner_id FK
        VARCHAR shop_name
        VARCHAR category
        TEXT address
        BOOLEAN is_active
        VARCHAR logo_url
        TIMESTAMP created_at
    }

    USER_SHOP_SELECTIONS {
        INT user_id PK_FK
        INT active_shop_id FK
        TIMESTAMP updated_at
    }

    CATEGORIES {
        INT category_id PK
        INT shop_id FK
        VARCHAR category_name
    }

    CASHIERS {
        INT cashier_id PK
        INT shop_id FK
        VARCHAR full_name
        VARCHAR username UK
        VARCHAR password_hash
        BOOLEAN is_active
    }

    PRODUCTS {
        INT product_id PK
        INT shop_id FK
        VARCHAR product_name
        VARCHAR image_url
        VARCHAR sku
        DECIMAL price
        DECIMAL cost_price
        INT stock_quantity
        TEXT description
        VARCHAR category
        TIMESTAMP created_at
    }

    SALES {
        INT sale_id PK
        INT shop_id FK
        INT cashier_id FK
        DECIMAL total_amount
        DECIMAL tendered_amount
        TIMESTAMP sale_date
    }

    SALE_ITEMS {
        INT sale_item_id PK
        INT sale_id FK
        INT product_id FK
        INT quantity
        DECIMAL unit_price
        DECIMAL subtotal
    }

    ACTIVITY_LOGS {
        INT log_id PK
        INT shop_id FK
        INT user_id
        ENUM user_type
        ENUM action
        VARCHAR entity_type
        INT entity_id
        VARCHAR entity_name
        JSON details
        TIMESTAMP created_at
    }
```

---

## Chapter 9 — Advantages of the Proposed System

The proposed ShopNest Multi-Tenant POS System offers several significant advantages over traditional manual processes or outdated billing systems. By leveraging React.js, Express.js, Node.js, and MySQL with modern design principles, the system provides a fast, efficient, and user-friendly experience for Shop Owners and Cashiers.

### 9.1 Key Advantages

**1. Automation of Sales Processing**
Manual billing and calculation are eliminated. Cashiers can quickly search products, add them to a cart, and process checkout with automatic total calculation and change computation.

**2. Centralized Multi-Store Management**
All shop, product, cashier, sales, and inventory data is stored in one centralized MySQL database. Owners with multiple branches can manage everything from a single dashboard.

**3. Real-Time Inventory Tracking**
Stock levels are automatically updated after every sale. Low stock alerts proactively notify owners about products that need restocking, preventing stockouts.

**4. Improved Accuracy**
Manual errors in billing and inventory are drastically reduced through automated calculations, form validation, and database-enforced constraints.

**5. Visual Business Analytics**
Interactive bar charts, line charts, area charts, and pie charts provide visual representation of revenue trends, top-selling products, cashier performance, and inventory distribution — enabling data-driven business decisions.

**6. Role-Based Access Control**
Different user roles (Owner, Cashier) ensure that users see only relevant data and can perform only permitted actions. Owners cannot be impersonated, and cashiers cannot access administrative functions.

**7. Enterprise-Grade Security**
Passwords are hashed using bcrypt; access is protected with JWT-based authentication; API endpoints are secured with Helmet, CORS, and rate limiting; all inputs are validated with Joi and Express Validator.

**8. Multi-Tenant Data Isolation**
Each shop's data is completely isolated. An owner's shops, products, cashiers, and sales cannot be accessed by other owners, ensuring complete privacy.

**9. Scalability**
Built with a modular architecture, the system can easily scale to handle a growing number of shops, products, cashiers, and daily transactions.

**10. User-Friendly Interface**
Responsive UI with React.js and Tailwind CSS provides a smooth, modern experience across desktops, tablets, and mobile devices. The POS terminal is designed for speed and ease of use.

**11. Bulk Operations**
The Excel (XLSX) bulk upload feature allows owners to import entire product catalogues in seconds, dramatically reducing the time needed to set up a new store.

**12. Cloud-Based Media Management**
Product images are hosted on Cloudinary CDN, ensuring fast loading, automatic optimization, and reliable delivery without burdening the application server.

**13. Audit Trail & Accountability**
Activity logs track all inventory-related actions with timestamps, user identification, and action details — providing complete accountability and audit capability.

**14. Digital Receipt Distribution**
Integration with EmailJS enables automated dispatch of digital sales receipts to customers, reducing paper usage and improving customer experience.

**15. Future-Proof Architecture**
The system is designed with modularity and extensibility in mind, allowing easy addition of features such as barcode scanning, receipt printing, customer loyalty programs, and advanced analytics.

---

## Chapter 10 — Future Scope of the Project

The current version of ShopNest successfully fulfills the core requirements for a multi-tenant POS system — managing sales, inventory, cashiers, and financial analytics. However, there is significant scope for further enhancement and expansion of the system's features in future versions.

### 10.1 Possible Future Enhancements

**1. Barcode & QR Code Scanning**
Integration with barcode scanners for instant product lookup during checkout, and QR code generation for product labels.

**2. Receipt Printing**
Direct integration with thermal receipt printers for physical receipt generation at the point of sale.

**3. Customer Management & Loyalty Programs**
Adding a customer database to track purchase history, offer loyalty points, and run targeted promotions.

**4. SMS & Push Notifications**
Automatic notifications to owners for low stock alerts, daily sales summaries, and important system events.

**5. Supplier & Purchase Order Management**
A module for managing suppliers, creating purchase orders, and tracking incoming inventory shipments.

**6. Expense Tracking**
Adding an expense management module for tracking operational costs (rent, utilities, salaries) alongside revenue.

**7. Multi-Currency & Tax Support**
Support for multiple currencies and configurable tax rates (GST, VAT) for businesses operating in different regions.

**8. Offline POS Mode**
Progressive Web App (PWA) capabilities to allow the POS terminal to function during internet outages, syncing transactions when connectivity is restored.

**9. Mobile Application**
Developing a dedicated mobile app (React Native) for owners to monitor business performance on-the-go with push notifications.

**10. Advanced Analytics & AI**
AI-based analytics for demand forecasting, identifying sales patterns, recommending optimal pricing, and predicting inventory needs.

**11. Exportable Reports**
Ability to export financial reports, inventory lists, and sales data as PDF or Excel files for accounting and official use.

**12. Multi-User Roles**
Expanding the role system to include Manager, Accountant, and other roles with granular permission controls.

**13. API Integration (Third-Party)**
Integration with accounting software (Tally, QuickBooks), payment gateways (Razorpay, Stripe), and e-commerce platforms.

**14. Customer-Facing Display**
A secondary display interface showing the customer their items and total during checkout.

---

## Chapter 11 — Output Screens

### 11.1 Public Screens

**1. Public Landing Page**
_Premium landing page with animated hero section, feature showcases, pricing plans, testimonials, and call-to-action buttons for registration._

**2. Login Screen**
_Clean login form supporting both Owner and Cashier authentication with role-based redirection._

**3. Registration Screen**
_Owner registration form with name, email, and password fields with validation._

---

### 11.2 Owner Screens

**1. Owner Dashboard Screen**
_Interactive dashboard displaying revenue KPIs, total products, total cashiers, total shops, revenue trend charts (line), top-selling products (bar chart), and recent transactions list._

**2. Shop Management Screen**
_List of all shops with details (name, category, address, logo, status), with options to create, edit, and delete shops._

**3. Inventory Management Screen**
_Comprehensive product table with images, names, SKU, prices, cost prices, stock quantities, and categories. Includes search, filter, add product, edit product, and bulk upload features._

**4. Add/Edit Product Form Screen**
_Detailed product form with fields for name, SKU, selling price, cost price, stock quantity, description, category dropdown, and image upload with preview._

**5. Cashier Management Screen**
_List of cashiers assigned to the active shop, with name, username, active status toggle, and options to add, edit, or delete cashiers._

**6. Financial Reports Screen**
_Multi-section reports page with sales analytics charts, revenue trends, cashier performance metrics, top products analysis, and inventory valuation summary._

**7. Activity Log Screen**
_Chronological activity feed showing inventory actions (product created, updated, deleted, stock adjusted, image uploaded) with user details and timestamps._

---

### 11.3 Cashier Screens

**1. POS Terminal Screen**
_Full-screen POS interface with product search/browse area, product cards with images and prices, shopping cart sidebar with quantity controls, and checkout panel with tendered amount input and change display._

**2. Daily Sales Screen**
_Table of all transactions processed by the cashier today, showing sale ID, total amount, number of items, tendered amount, and timestamp._

**3. Stock Check Screen**
_Searchable product inventory viewer showing current stock levels, prices, and product details for quick availability checks._

---

## Chapter 12 — Conclusion

The **ShopNest — Multi-Tenant Point of Sale (POS) System** developed using **React.js, Vite, Express.js, Node.js, and MySQL** successfully achieves its goal of providing a comprehensive, efficient, and user-friendly solution for managing retail sales operations, product inventories, cashier staff, and financial analytics across multiple stores.

The system offers significant advantages over traditional manual billing and inventory methods by:

- **Automating the entire sales process** with a fast, intuitive POS terminal
- **Providing real-time inventory tracking** with automatic stock updates after every transaction
- **Offering interactive visual dashboards** with bar charts, line charts, and KPI counters for data-driven business decisions
- **Enabling multi-store management** from a single owner account with complete data isolation
- **Implementing enterprise-grade security** with JWT authentication, bcrypt hashing, Helmet, CORS, and rate limiting
- **Supporting bulk operations** through Excel import for rapid product catalogue setup
- **Delivering cloud-based media management** through Cloudinary integration for optimized product images
- **Maintaining complete audit trails** through activity logging for accountability
- **Reducing paperwork and administrative effort** through digital processes and automated reports
- **Providing role-based access control** for Owners and Cashiers with distinct dashboards and permissions

The application is **secure, responsive, and scalable**, built on a modern technology stack that is capable of handling growing numbers of shops, products, cashiers, and daily transactions.

Moreover, the system is built with **flexibility and extensibility** to support future enhancements such as barcode scanning, receipt printing, customer loyalty programs, mobile applications, offline POS mode, and AI-powered analytics.

In conclusion, the **ShopNest POS System** provides a modern, effective, and production-ready tool for retail businesses to streamline their operations, improve revenue visibility, and enhance customer experience. It serves as a strong foundation for further development in the retail technology space.

---

> **Project Repository:** [github.com/rumman2004/ShopNest](https://github.com/rumman2004/ShopNest)
>
> **Technology Stack:** React 19 • Vite 7 • Tailwind CSS 4 • Express.js • Node.js • MySQL • Cloudinary • JWT • Recharts
>
> **Developed by:** Rumman Ahmed | BCA 6th Semester Major Project | Session 2022–25
