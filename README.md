
# Role-Based API Documentation

## Overview
This repository contains the source code for a **Role-Based API** built with modern backend technologies. Below is a technical breakdown of the system, including setup instructions, authentication flow, and environment variables.

---

## Technologies Used
- **Node.js** (v16 to v21): Server-side JavaScript runtime.
- **Express**: Web application framework for building RESTful APIs.
- **MySQL**: Relational database management system for data storage.
- **Sequelize**: ORM for managing MySQL database interactions.
- **JSON Web Token**: For secure authentication and authorization.
- **bcrypt**: Password hashing library for securely storing user credentials.
- **Redis**: In-memory data store for caching and session management.
- **pnpm**: Recommended package manager for dependency management.

---

## Authentication
- **Access Token**: Short-lived token (1 hour expiration).
- **Refresh Token**: Long-lived token (24-hour expiration).
- **Password Hashing**: Uses `bcrypt` with 8 salt rounds for secure password storage.

### Token Lifecycle
1. Access tokens are issued upon login and used for accessing protected endpoints.
2. When the access token expires, the user sends their refresh token to a designated endpoint to get a new access token.

---

## Role-Based Access Control
- **Super Admin**:
  - Registers using their email, full name, and password.
  - Manages users by creating accounts, assigning roles, and defining permissions.
- **Roles and Permissions**:
  - Dynamically created roles define access to specific endpoints and features.
  - Granular permissions restrict or allow access to API operations.
- **Staff**:
  - Limited to actions within their assigned group.
  - Accounts are verified through email.

---

## Environment Variables
Below are the environment variables required for setup. Replace sensitive values with actual credentials in production:

```dotenv
# Environment
NODE_ENV=development

# Password Hashing
PASSWORD_HASH=8

# JWT Secrets and Expirations
JTW_REFRESH_TOKEN_SECRET=your-refresh-token-secret
JWT_REFRESH_TOKEN_EXPIERATION=24h
JWT_ACCESS_TOKEN_SECRET=your-access-token-secret
JWT_ACCESS_TOKEN_EXPIERATION=1h

# Base URL
BASE_URL=https://your-app-url.example.com

# MySQL Database Credentials
DATABASE_NAME=your_database_name
DATABASE_USERNAME=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_HOSTNAME=your_database_host

# Redis Server Credentials
REDIS_ENDPOINT_URL=your_redis_host
REDIS_PASSWORD=your_redis_password
REDIS_PORT=6379

# Email Service Configuration
SECURITY_EMAIL_PASSWORD=your_email_password
SECURITY_EMAIL_ADDRESS=your_email@example.com
EMAIL_PORT=465
EMAIL_HOST=smtp.gmail.com
EMAIL_SERVICE=gmail ```


# Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo-url.git
cd your-repo
```

### 2. Install Dependencies
Use `pnpm` as the package manager:
```bash
pnpm install
```

### 3. Configure the Environment
Create a `.env` file in the root of the project and populate it with the following variables:

```dotenv
# Environment
NODE_ENV=development

# Password Hashing
PASSWORD_HASH=8

# JWT Secrets and Expirations
JTW_REFRESH_TOKEN_SECRET=your-refresh-token-secret
JWT_REFRESH_TOKEN_EXPIERATION=24h
JWT_ACCESS_TOKEN_SECRET=your-access-token-secret
JWT_ACCESS_TOKEN_EXPIERATION=1h

# Base URL
BASE_URL=https://your-app-url.example.com

# MySQL Database Credentials
DATABASE_NAME=your_database_name
DATABASE_USERNAME=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_HOSTNAME=your_database_host

# Redis Server Credentials
REDIS_ENDPOINT_URL=your_redis_host
REDIS_PASSWORD=your_redis_password
REDIS_PORT=6379

# Email Service Configuration
SECURITY_EMAIL_PASSWORD=your_email_password
SECURITY_EMAIL_ADDRESS=your_email@example.com
EMAIL_PORT=465
EMAIL_HOST=smtp.gmail.com
EMAIL_SERVICE=gmail
```

### 4. Configure the Database
Ensure MySQL is running and properly configured in the `.env` file. Run migrations if necessary:
```bash
npx sequelize db:migrate
```

### 5. Configure Redis
Start a Redis server and configure it in the `.env` file.

### 6. Run the Application
- Development mode:
  ```bash
  pnpm start:dev
  ```
- Production mode:
  ```bash
  pnpm start
  


