# Project Title: Microservices-Based Application with NestJS

## Overview

This project is a microservices-based application built using [NestJS](https://nestjs.com/), designed to handle various functionalities such as authentication, reservations, payments, and notifications. The services communicate with each other asynchronously using RabbitMQ, and the data is stored in an SQL database. Each microservice is containerized using Docker, and Docker Compose is used to manage and run the entire application. Additionally, there is a common library used across the services for shared models and authentication logic, including JWT-based authentication with Passport.

## Table of Contents

- [Architecture](#architecture)
- [Microservices](#microservices)
  - [Auth Service](#auth-service)
  - [Reservations Service](#reservations-service)
  - [Payments Service](#payments-service)
  - [Notifications Service](#notifications-service)
- [Common Library](#common-library)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Communication](#communication)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## Architecture

The application follows a microservices architecture, where each service is responsible for a specific domain or functionality. The microservices communicate with each other via RabbitMQ, enabling loose coupling and scalability. The following diagram illustrates the architecture:

```
+------------------+        +-------------------+        +-------------------+
|                  |        |                   |        |                   |
|  Auth Service    |<------>| Reservations      |<------>| Payments Service  |
|                  |        | Service           |        |                   |
+------------------+        +-------------------+        +-------------------+
        ^                            ^                            ^
        |                            |                            |
        v                            v                            v
+------------------+        +-------------------+        +-------------------+
|                  |        |                   |        |                   |
|  Notifications   |<------>| RabbitMQ Broker   |<------>|  Common Library   |
|  Service         |        |                   |        |                   |
+------------------+        +-------------------+        +-------------------+
```

## Microservices

### Auth Service
- **Purpose**: Manages user authentication and authorization.
- **Features**: 
  - User registration and login
  - JWT-based authentication
  - Token validation and user session management
- **Technologies**: NestJS, Passport, JWT, SQL

### Reservations Service
- **Purpose**: Handles reservation-related functionalities.
- **Features**: 
  - Create, update, and delete reservations
  - Fetch reservation details
  - Integration with Auth Service for user authorization
- **Technologies**: NestJS, SQL

### Payments Service
- **Purpose**: Manages payment processing and related transactions.
- **Features**: 
  - Process payments
  - Transaction management
  - Integration with Reservations and Notifications Services
- **Technologies**: NestJS, SQL

### Notifications Service
- **Purpose**: Sends notifications to users based on various events.
- **Features**: 
  - Email and SMS notifications
  - Event-driven notifications based on RabbitMQ messages
- **Technologies**: NestJS, RabbitMQ

## Common Library
- **Purpose**: Provides shared functionalities across the microservices.
- **Features**:
  - Common models and DTOs
  - Authentication logic (JWT-based with Passport)
  - Utility functions and constants
- **Technologies**: TypeScript, NestJS

## Technologies Used

- **Backend**: NestJS
- **Message Broker**: RabbitMQ
- **Database**: SQL (e.g., PostgreSQL, MySQL)
- **Authentication**: Passport, JWT
- **Containerization**: Docker, Docker Compose
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Docker
- Docker Compose
- RabbitMQ (or installed as a Docker container)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install dependencies for each microservice:
   ```bash
   cd auth-service
   npm install
   cd ../reservations-service
   npm install
   cd ../payments-service
   npm install
   cd ../notifications-service
   npm install
  
## there is different branches with different communications methods 
 ``` graphql
  grpc
  master
  rabiqmq
  typeorm
 ```
### Running the Application

1. Build and run the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

2. The services should be up and running. You can verify by accessing the respective service endpoints (e.g., `http://localhost:3000` for Auth Service).

## Environment Variables

Each microservice requires specific environment variables to be set. Refer to the `.env.example` file in each service directory for the required variables. These typically include:

- `DATABASE_URL`
- `RABBITMQ_URL`
- `JWT_SECRET`
- `PORT`

## Database

The application uses an SQL database to store data. Each microservice has its own database schema. Migrations and seed scripts can be used to manage database changes.

### Running Migrations

To run database migrations, use the following command inside each microservice directory:

```bash
npm run migration:run
```

## Communication

The microservices communicate with each other using RabbitMQ as a message broker. Each service publishes and subscribes to specific queues/topics based on the event-driven architecture.

## Authentication

Authentication is handled by the Auth Service using JWT tokens. The tokens are validated by the other services to ensure that only authenticated users can access the endpoints.

### JWT Usage

- **Generate Token**: The Auth Service generates a JWT upon successful login.
- **Validate Token**: Other services use the common library to validate the token and extract user information.

## Contributing

Contributions are welcome! Please follow the [contributing guidelines](CONTRIBUTING.md) to submit your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.