# EngiTrack — Secure Subscription-Based Engineering Desktop Application

EngiTrack is a secure desktop application prototype tailored for civil engineers. It features a complete authentication system, strict role-based access control (RBAC), subscription-based feature management, and a dedicated project management workspace.

## Tech Stack
- **Frontend**: Next.js, React Query (Data Fetching), Zustand (State Management), Zod (Validation)
- **Backend**: Node.js, Express, MongoDB (Database)
- **Desktop Wrapper**: Electron.js

## Setup & Installation

### 1. Database Setup
You will need a MongoDB database to run this application.
1. Create a `.env` file in your `backend/` directory and add your MongoDB connection string as `MONGODB_URI`. You will also need variables like `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT`, etc.
2. Open a terminal in the `backend/` directory, install dependencies, and seed the database with default accounts:
   ```bash
   cd backend
   npm install
   npm run seed
   ```
   **Default Test Accounts created:**
   - **Admin**: `admin@engitrack.com` / `admin123`
   - **Engineer**: `engineer@engitrack.com` / `engineer123`
   - **Viewer**: `viewer@engitrack.com` / `viewer123`

### 2. Start the Backend API
In the `backend/` directory, start your server:
```bash
npm run dev
```

### 3. Start the Frontend Application
Open a new terminal in the `frontend/` directory, install dependencies, and start the Next.js server:
```bash
cd frontend
npm install
npm run dev
```

### 4. Launch the Electron Desktop App
Once both the backend and frontend are running, open a new terminal in the `electron/` directory:
```bash
cd electron
npm install
npm start
```
This will launch the native desktop application container.

## Architecture Highlights

### Role-Based Access Control (RBAC)
EngiTrack uses a strict role-based system to ensure users only access what they are permitted to. Here is a breakdown of permissions:

| Feature | Viewer | Engineer | Admin |
| :--- | :---: | :---: | :---: |
| View Projects | ✅ | ✅ | ✅ |
| Create Projects | ❌ | ✅ | ✅ |
| Edit Own Projects | ❌ | ✅ | ✅ |
| Delete Projects | ❌ | ✅ (own only) | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| Change Roles | ❌ | ❌ | ✅ |
| Activate/Deactivate Accounts | ❌ | ❌ | ✅ |
| Manage Subscriptions | ❌ | ❌ | ✅ |
| View Login Logs | ❌ | ❌ | ✅ |

### Subscription Limits
The platform enforces subscription plans (Free Trial, Professional, Enterprise). Each plan comes with strict project creation limits. The backend dynamically intercepts project creation requests and validates the user's current active subscription against the maximum allowed projects. If the user exceeds their tier limits, the request is blocked.

### Security Implementation
- **HTTP-Only Cookies**: JWT tokens are stored securely in HTTP-only cookies rather than `localStorage`. This neutralizes Cross-Site Scripting (XSS) attacks by making tokens inaccessible to client-side scripts.
- **Backend Route Protection**: Express middleware validates the JWT from incoming cookies on every protected route. Role checks are also enforced here to ensure APIs cannot be bypassed.
- **Frontend Route Protection**: Next.js `middleware.ts` intercepts page requests on the server-side, verifying the authentication cookie before allowing users into protected dashboard routes.

## File Structure
```text
EngiTrack/
├── backend/          # Node.js Express API and MongoDB models
│   ├── src/          # API routes, controllers, and DB models
│   ├── seed.js       # Database seeder
│   └── package.json
├── frontend/         # Next.js web application
│   ├── app/          # App router and layouts
│   │   ├── (auth)/   # Login and Register pages
│   │   └── dashboard/ # Main application routes (admin, projects, etc.)
│   ├── components/   # Reusable UI components
│   ├── constants/    # Shared constants (e.g., query keys)
│   │   └── queryKeys.ts
│   ├── utils/        # Utility helpers (e.g., date formatting)
│   │   └── date.ts
│   ├── hooks/        # Custom React hooks (e.g., useAuth, useProjects)
│   ├── lib/          # Context Providers and API helpers
│   │   └── query-provider.tsx # React Query Provider
│   ├── middleware.ts # Route protection logic
│   └── package.json
├── electron/         # Electron desktop wrapper
│   ├── main.js       # Electron entry point
│   └── package.json
└── README.md         # Project documentation
```

---
**Author**: Biyash Shrestha  
**Portfolio**: [https://biyash-shrestha.vercel.app/](https://biyash-shrestha.vercel.app/)
