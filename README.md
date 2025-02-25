# DividendTracker
## 📈 Introduction
**DividendTracker** is a web application designed to help users record and manage historical dividend income data with ease. The project aims to provide a user-friendly interface for tracking dividends while offering the flexibility to expand its functionality based on user needs.

This project also serves as a practical exercise to gain hands-on experience with **Flask** for backend development and **Microsoft SQL Server** for efficient data storage and management.

> 🔗 [GitHub Repository: DividendTracker](https://hackmd.io/@Potassium-chromate/H1f56roYkx)

## 🧭 Project Objectives
**Frontend**: Deliver an intuitive and user-friendly interface that simplifies the input and management of dividend-related data.

**Backend**: Utilize **Flask** for backend development, integrated with **Microsoft SQL Server** for data storage and management, enhancing proficiency in Flask and SQL Server architecture.

**Containerization**: Use **Docker** to run the frontend and backend in separate containers, ensuring a consistent development environment and simplifying deployment with **Docker Compose** for multi-container orchestration. 

## 📁 Project structure
```shell
DividendTracker
├── backend                      # Backend code and configurations
│   ├── config.py                # SQL Server connection settings
│   ├── Dockerfile               # Dockerfile for backend container
│   ├── main.py                  # Entry point of the backend application
│   ├── 股票id.xlsx               # Excel file containing stock IDs
│   ├── __pycache__              
│   ├── requirements.txt         # Python dependencies for the backend
│   ├── test.py                  # Backend testing scripts
│   ├── routes/                  # Folder containing backend API route handlers
│   └── models/                  # Folder defining SQL table models
│
├── frontend                     # Frontend code and configurations
│   ├── dist/                    # Production-ready build files
│   ├── Dockerfile               # Dockerfile for frontend container
│   ├── eslint.config.js         # ESLint configuration for code linting
│   ├── index.html               # Main HTML file for the frontend
│   ├── node_modules/            # Node.js dependencies
│   ├── package.json             # Project metadata and dependencies
│   ├── package-lock.json        # Locked versions of npm dependencies
│   ├── public/                  # Static assets for the frontend
│   ├── README.md                # Documentation for the frontend
│   ├── src/                     # Source code for React (JSX) components
│   └── vite.config.js           # Vite configuration for frontend tooling
│
└── docker-compose.yml           # Docker Compose file for multi-container setup
```
## 🚀 How to Use This Project

### ✅ Step 1: Clone the Repository
First, clone the project to your local machine using `git`:
```sh
git clone https://github.com/Potassium-chromate/DividendTracker.git
cd DividendTracker
```
## 🐳 Step 2: Build and Run with Docker Compose
Use **Docker Compose** to build and start the application:
```sh
docker compose up --build
```
- The **--build** flag ensures that Docker images are rebuilt if there are any changes in the code or Dockerfile.
- Docker Compose will handle building images, creating containers, and setting up networks automatically.

## 🌐 Step 3: Access the Application
Once Docker finishes building and running the containers, you can access the app:

- **Backend API:**
Typically available at:
```sh
http://localhost:5001
```
- **Frontend App:**
If the frontend is included in the Docker setup, it may be running on:
```sh
http://localhost:3000
```

(Adjust the ports if your Docker configuration uses different ones.)
## 🔄 Step 4: Stopping the Application
To stop the running containers, press `Ctrl + C` in the terminal where Docker Compose is running. Then, clean up the containers with:
```sh
docker compose down
```
## 🛠 Step 5: Rebuilding After Changes
If you make code changes and need to rebuild:
```sh
docker compose up --build
```
## ⚡ Checking Running Containers
To see the running Docker containers:
```sh
docker ps
```
