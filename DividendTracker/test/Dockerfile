# Use an appropriate base image
FROM python:3.10-slim

# Install system dependencies for pyodbc and the ODBC Driver for SQL Server
RUN apt-get update && apt-get install -y \
    unixodbc-dev \
    gcc \
    g++ \
    curl \
    gnupg2 \
    lsb-release \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql17 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app code
COPY . /app

# Set the working directory
WORKDIR /app

# Expose the application port
EXPOSE 5002

# Command to run the app 
CMD ["python", "main.py"]

