# EngiTrack Documentation

Welcome to the documentation for **EngiTrack** — a secure subscription-based desktop application prototype designed for civil engineers.

This project was built as part of a technical hiring assessment focused on authentication, role-based access control, subscription management, project handling, and secure software architecture.

## Project Overview
EngiTrack allows engineers to manage engineering projects through a secure desktop environment. Users receive different levels of access depending on their assigned role and subscription plan. 

The platform also includes an administrative dashboard for managing users, subscriptions, activity logs, and project access.

## Core Features

### Authentication System
- Secure user registration and login
- Password hashing using bcrypt
- JWT-based authentication
- HTTP-only cookie token storage
- Protected routes and middleware validation

### Role-Based Access Control (RBAC)
The application supports three roles:
- **Admin** → Full system access
- **Engineer** → Create and manage own projects
- **Viewer** → Read-only project access

### Subscription Management
Supported subscription tiers:
- Free Trial
- Professional
- Enterprise

## Security Implementation
Security was a primary focus during development.

### Secure Token Storage
Authentication tokens are stored using HTTP-only cookies instead of `localStorage` to reduce XSS risks.

### Backend Route Protection
All protected API routes validate:
- JWT tokens
- User roles
- Subscription status

### Validation
Zod validation is implemented on both frontend and backend layers to prevent malformed or malicious requests.

### Environment Variables
Sensitive configuration values are stored securely using environment variables.

## Tech Stack

### Frontend
- Next.js (App Router)
- React Query
- Zustand
- Tailwind CSS
- Zod

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Desktop Wrapper
- Electron.js

## Application Architecture
The application follows a client-server architecture:
`Electron Desktop App` → `Next.js Frontend` → `Express API` → `MongoDB Database`

This separation improves scalability, maintainability, and security.

## Running the Application
To run the project locally, you will need to start three components:
1. Backend Server
2. Frontend Application
3. Electron Desktop App

Detailed setup instructions, environment configuration, and build commands are available in the `README.md` file.
