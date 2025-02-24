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
