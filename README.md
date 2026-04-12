<h1 align="center">ShopNest — Multi-Tenant Point of Sale (POS) System</h1>

<div align="center">
  A premium, highly scalable, and fully responsive Point of Sale and Inventory Management System built with React, Vite, Express, and MySQL.
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
</div>

<br />

## 🌟 Overview

**ShopNest** is a comprehensive, production-ready Multi-Tenant Point of Sale (POS) system designed for retail environments. It provides store owners, managers, and cashiers with a seamless interface to process sales, manage complex inventories, visualize business analytics, and handle multi-tenant store structures securely.

The system is split into two distinct parts: a lightning-fast frontend dashboard built with **React** & **Vite**, and a highly robust, secure backend REST API powered by **Node.js**, **Express**, and **MySQL**.

---

## 🔥 Key Features

### 🏢 Multi-Tenant Architecture
- Supports multiple stores/branches under a single administrative umbrella.
- Data isolation ensures complete privacy and operational independence for each store.

### 📊 Advanced Interactive Dashboard
- **Real-Time Analytics**: Built-in visual charts and statistics using *Recharts* to track revenue, best-selling items, and daily sales flows.
- **Responsive Layouts**: Designed flawlessly with *Tailwind CSS* to accommodate desktop terminals and mobile tablets.

### 📦 Superior Inventory & Media Management
- Bulk upload capability using Excel parsing (*XLSX* integration) for massive catalogue updates.
- Centralized product image hosting using **Cloudinary** integration for optimized, fast-loading media.

### 🛡️ Enterprise-Grade Security
- **JWT-Based Authentication** backed by *Bcrypt* hashing.
- Strong API protection using *Helmet*, *Express Rate Limiter*, and CORS.
- Advanced payload validations utilizing *Joi* and *Express Validator*.

### 📧 Automated Communications
- Integrated with **EmailJS** to automate digital receipt dispatching and store notifications.

---

## 🛠️ Technology Stack

### Frontend Workflow
| Technology | Description |
|---|---|
| **Core Framework** | React 18, Vite |
| **Styling & UI** | Tailwind CSS, Lucide React (Icons) |
| **Form Handling** | React Hook Form |
| **Data Visualization** | Recharts |
| **Utilities** | Axios (HTTP), Date-fns (Dates), EmailJS (Mailing), XLSX (Excel Parsing) |

### Backend API & Database
| Technology | Description |
|---|---|
| **Server Engine** | Node.js, Express.js |
| **Database** | MySQL (via `mysql2`) |
| **Security Methods** | Helmet, CORS, Express-Rate-Limit, JSON Web Tokens, Bcryptjs |
| **Data Validation** | Joi, Express-validator |
| **Storage & Upload** | Multer, Cloudinary API |
| **Logging & Monitoring** | Winston, Morgan |

---

## 🚀 Local Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+) and a running instance of MySQL installed.

### 1. Clone the repository
```bash
git clone https://github.com/rumman2004/ShopNest.git
cd ShopNest
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd Backend
npm install
```
Create a `.env` file inside `/Backend` and configure your environment:
```env
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=shopnest_db

# Security
JWT_SECRET=your_secure_jwt_secret
JWT_REFRESH_SECRET=your_secure_refresh_secret

# Cloudinary Integration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

*(Optional)* Next, you can auto-generate highly secure JWT secrets using the script:
```bash
npm run generate-secrets
```

Start the backend standard development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal session, navigate to the frontend directory, and install dependencies:
```bash
cd ../Frontend
npm install
```
Create a `.env` file inside `/Frontend`:
```env
VITE_BACKEND_URI=http://localhost:5000

# EmailJS Config (If applicable)
VITE_EMAILJS_PUBLIC_KEY=your_key
```

Run the frontend interface:
```bash
npm run dev
```

---

## 🧪 Testing

The backend API is pre-configured with the **Jest** testing framework for unit and integration testing.

To run tests:
```bash
cd Backend
npm run test
```

For continuous integration coverage:
```bash
npm run test:ci
```

---

## 📄 License
This project is licensed under the MIT License.
