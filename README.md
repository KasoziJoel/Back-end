# GCDL Stock & Procurement Management System

## 📝 Project Description
This application is designed to manage stock procurement, sales, and credit tracking across multiple branches for [Briefly describe the business/project, e.g., a grain dealer or commodity broker]. It is a backend API that serves [mobile/web application] requests based on defined business logic.



### Key Features
* **User & Role Management:** Secure authentication and authorization for different user roles (e.g., Agent, Manager).
* **Procurement Tracking:** Record new stock acquisitions, tonnage, and cost details.
* **Sales & Deduction:** Handle sales transactions and automatically deduct stock.
* **Branch Management:** System supports managing and tracking stock across various physical branches.
* **Credit/Dealers Management:** Tracks outstanding credit and manages dealer information.

---

## 💻 Technical Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | [Node.js / Express or PHP / Laravel] | The server-side framework handling API endpoints and business logic. |
| **Database** | MySQL  | Relational database management system used for persistent data storage. |
| **Development** | HeidiSQL /  | Tools used for database management and code development. |
| **Host (Local)** | **XAMPP / MAMP** | Local environment used for development and testing. |

---

## 🚀 Getting Started (Local Development)

Follow these steps to get a development environment up and running on your local machine.

### Prerequisites
* [Node.js / PHP / etc.] installed (Specify the exact version if needed: e.g., Node.js v18+)
* **XAMPP** or **MAMP** installed and running (for the local MySQL server).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/KasoziJoel/Back-end]
    cd [C:\Users\Ahumuza Samuel\Back-end]
     cd [C:\Users\Kasozi Joel\Back-end]
    ```

2.  **Install Dependencies:**
    ```bash

    npm install

    ```

3.  **Database Setup:**
    * **Start MySQL** through your XAMPP/MAMP control panel.
    * Open `http://localhost/3000`.
    * Create a new database named: **`[GCDL_DB]`**.
    * **Import the Schema:** Import the `[schema_file_name.sql]` file provided by the team lead to create the necessary tables (`Users`, `Produce`, etc.).

4.  **Configure Environment:**
    * Create a copy of the example environment file and name it `.env`:
        ```bash
        cp .env.example .env
        ```
    * Update the `.env` file with your local database credentials:
        ```env
        # .env file content
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD= *****
        DB_DATABASE=gcdl
        APP_PORT=3000 
        ```

5.  **Run the Application:**
    ```bash
    
    npm start

 

The application should now be running at `http://localhost:3000`.

---

## 📌 Project Diagrams and Logic

Project blueprints are available in the repository for reference:

* **Database Schema:** `https://drive.google.com/file/d/1P3drwVy4IKuliWf76YE027W-AlUYbbXH/view?usp=sharing`
* **Business Logic:** `https://drive.google.com/file/d/1ydngXQdVME20yRhujI4cDLLqFq0NwSY6/view?usp=drive_link` and `https://drive.google.com/file/d/1a76PWu-Ukh6wEBCqXFlZsnU7fQRVrFN0/view?usp=sharing`

---

## 👥 Team & Authors

| Name | | Contact |
| :--- | | :--- |
<<<<<<< HEAD
| **[AHUMUZA SAMUEL]** | | https://github.com/Samuel-ahumuza |
| **[KASOZI JOEL]** | | https://github.com/KasoziJoel |
>>>>>>>

---

