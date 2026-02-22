FROM python:3.10-slim AS builder

# Install build tools required for compiling Python C-extensions (like pyodbc)
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    unixodbc-dev \
    && rm -rf /var/lib/apt/lists/*

# Create a virtual environment to isolate the installed packages
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies into the virtual environment
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.10-slim

# Install ONLY the runtime dependencies: the Microsoft SQL Server ODBC Driver
# Notice we DO NOT install gcc or g++ here!
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    lsb-release \
    && mkdir -p /etc/apt/keyrings \
    && curl -sSL https://packages.microsoft.com/keys/microsoft.asc -o /etc/apt/keyrings/microsoft.asc \
    && echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/microsoft.asc] https://packages.microsoft.com/ubuntu/22.04/prod jammy main" \
        | tee /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql17 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy the completely built virtual environment from the builder stage
COPY --from=builder /opt/venv /opt/venv

# Activate the virtual environment
ENV PATH="/opt/venv/bin:$PATH"

# Set the working directory
WORKDIR /app

# Copy the rest of the application code
COPY . /app

# Expose the application port
EXPOSE 5001

# Command to run the app
CMD ["python", "main.py"]
