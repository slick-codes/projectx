## Overview
This repository contains the source code for a **Role-Based API** built with modern backend technologies. Below is a technical breakdown of the system, including setup instructions, authentication flow, and environment variables.

## Testing
Use tools like **Postman** or **cURL** to test the API. Ensure the `.env` file is configured correctly for the test environment.
For detailed API endpoint documentation, visit the [API Documentation](https://documenter.getpostman.com/view/41271356/2sAYQcEA5q).
## DataBase structure 
For details about the database structure, please visit this link [Database Structure](https://dbdiagram.io/d/Project-X-troohq-EDR-65b4c1f0ac844320aed55b65)

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

## System Requirements
- **Node.js**: v16 to v21
- **MySQL**: Version 8.x
- **Redis**: Version 6.x
- **pnpm**: Latest stable version

---


---

## License
This project is licensed under [MIT License](LICENSE).

---

## Contributions
Feel free to fork the repository and submit pull requests to contribute to the project. Ensure your changes are well-documented.

