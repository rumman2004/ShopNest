# 🏪 ShopNest POS 

> A secure, multi-tenant Point of Sale (POS) system designed for independent retail businesses. 

ShopNest POS is a full-stack web application that allows multiple business owners to manage their retail shops from a single centralized platform. Built with strict **Role-Based Access Control (RBAC)** and **Database-level Data Isolation**, it ensures that owners can seamlessly manage multiple storefronts while cashiers are restricted to their assigned locations.

## ✨ Key Features

- **🏢 Multi-Tenant Architecture:** Multiple owners can use the platform independently without data overlapping.
- **🔐 Role-Based Access Control:** Distinct interfaces and permissions for `Owners` and `Cashiers`.
- **🔄 Dynamic Shop Switching:** Owners can seamlessly toggle between their different shops, instantly updating their dashboard and inventory views.
- **📦 Inventory Management:** Add, edit, delete, and track stock for shop-specific products.
- **💳 POS Interface:** A streamlined checkout interface for cashiers to process customer sales and automatically deduct stock.
- **🛡️ Strict Data Isolation:** Backend middleware guarantees that users can only access data tied to their verified `shop_id` or `owner_id`.

## 🛠️ Tech Stack

**Frontend:**
* React.js
* Tailwind CSS
* Context API (State Management)
* React Router DOM

**Backend:**
* Node.js & Express.js
* JSON Web Tokens (JWT) & bcrypt (Authentication/Security)

**Database:**
* MySQL (Using `mysql2` promise-based driver)

## 🗄️ Database Highlights
To achieve strict multi-tenancy, the application utilizes a relational database structure featuring a dedicated `user_shop_selections` table. This allows the backend to securely map and remember an owner's "Active Shop" session across logins and page refreshes.

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MySQL](https://www.mysql.com/) Server installed and running
* Git

### 1. Clone the Repository
```bash
git clone https://github.com/rumman2004/ShopNest.git
cd shopnest-pos
```

### 2. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench).
2. Create a new database named `shopnest_db`.
3. Run the provided SQL initialization script located in `backend/database/schema.sql` to generate the tables (`owners`, `shops`, `cashiers`, `products`, `sales`, `user_shop_selections`).

### 3. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add the following variables:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=shopnest_db
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend server:
```bash
npm run dev
```

### 4. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the React development server:
```bash
npm run dev
```

## 💻 Usage Guide

1. **Owner Registration:** Navigate to the web app, register as an Owner.
2. **Create a Shop:** In the dashboard, click "Add New Shop".
3. **Switch Shops:** Use the Shop Selector dropdown in the navigation bar to set your active workspace.
4. **Add Inventory & Staff:** Add products to your shop and create Cashier accounts.
5. **Cashier Login:** Log out, and log back in using the Cashier credentials. You will be greeted by the locked-down checkout interface for that specific shop.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Developed by <b>Rumman Ahmed <b/>
