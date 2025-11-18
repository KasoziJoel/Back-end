GCDL Stock & Procurement Management System

📝 Project Description

This application is the robust Backend API for the GCDL Stock & Procurement Management System. It is designed to handle all core business logic, data persistence, and security for managing commodity inventory, sales, and credit tracking across multiple branch locations. This API serves both mobile and web application requests, providing a secure and scalable foundation for business operations.

Key Features

User & Role Management: Secure authentication and authorization using JSON Web Tokens (JWT) for different user roles (e.g., Agent, Manager).

Procurement Tracking: Record new stock acquisitions, tonnage, and cost details.

Sales & Deduction: Handle sales transactions, automatically deduct stock, and manage deductions for credit sales.

Branch Management: System supports managing and tracking stock across various physical branches.

Credit/Dealers Management: Tracks outstanding credit and manages dealer information for efficient reconciliation.

💻 Technical Stack

Component

Technology

Description

Backend Framework

Node.js with Express.js

The server-side framework handling API endpoints and business logic.

Database

MySQL

Relational database management system used for persistent data storage.

Development

VS Code / HeidiSQL

Recommended tools for code development and database management.

Local Host Environment

XAMPP / MAMP

Local environment used to host the MySQL database server.

🚀 Getting Started (Local Development)

Follow these steps to get a development environment up and running on your local machine.

Prerequisites

Node.js (v18+ recommended) installed.

XAMPP or MAMP installed and running (to host the local MySQL server).

Installation

Clone the repository:

git clone [https://github.com/KasoziJoel/Back-end](https://github.com/KasoziJoel/Back-end)
cd Back-end


Install Dependencies:

npm install


Database Setup:

Start MySQL through your XAMPP/MAMP control panel.

Open your database management tool (e.g., HeidiSQL or browse to http://localhost/phpmyadmin).

Create a new database named: gcdl.

Import the Schema: Import the provided SQL schema file (e.g., schema_file_name.sql) to create the necessary tables (Users, Produce, Branches, etc.).

Configure Environment:

Create a copy of the example environment file and name it .env:

cp .env.example .env


Update the .env file with your local database and application settings. Crucially, add a JWT Secret for security:

# .env file content
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=gcdl
APP_PORT=3000

# MANDATORY: Add a long, complex string for token signing
JWT_SECRET=YOUR_VERY_STRONG_AND_COMPLEX_SECRET
JWT_EXPIRES_IN=90d


Run the Application:

npm start


The application should now be running and listening for requests at http://localhost:3000.

🔑 Key API Endpoints

The API is built following RESTful conventions and uses JWT for authentication on protected routes.

Endpoint

Method

Description

Authentication

/api/v1/auth/login

POST

Authenticates a user and returns a JWT.

None

/api/v1/auth/signup

POST

Registers a new user with default role.

None

/api/v1/stock

GET

Retrieves all current inventory items across branches.

Required

/api/v1/stock

POST

Adds new stock procurement records.

Required, Admin/Manager

/api/v1/sales

POST

Records a new sales transaction and deducts stock.

Required

/api/v1/branches

GET

Retrieves a list of all managed branches.

Required

📌 Project Blueprints and Logic

Project blueprints are available for detailed reference:

Database Schema: https://drive.google.com/file/d/1P3drwVy4IKuliWf76YE027W-AlUYbbXH/view?usp=sharing

Business Logic (Flowchart 1): https://drive.google.com/file/d/1ydngXQdVME20yRhujI4cDLLqFq0NwSY6/view?usp=drive_link

Business Logic (Flowchart 2): https://drive.google.com/file/d/1a76PWu-Ukh6wEBCqXFlZsnU7fQRVrFN0/view?usp=sharing

👥 Team & Authors

Name

Role

GitHub Profile

AHUMUZA SAMUEL

Backend Developer

https://github.com/Samuel-ahumuza

KASOZI JOEL

Developer

https://github.com/KasoziJoel
