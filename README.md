
# ServicePro – Hyperlocal Service Marketplace

ServicePro is a robust MERN-stack platform designed to connect local residents with verified service providers (plumbers, electricians, cleaners, etc.) in real-time. This project was developed during my tenure as an Associate Full Stack Developer Intern at Infotact Solutions, where I spearheaded the core architecture and led a small team to delivery.


## Core Features
Live Booking Engine: Real-time service tracking from initial request to completion status.

Instant Messaging: A custom-built chat system for customers and providers to negotiate pricing and details securely.

Secure RBAC: Role-Based Access Control using JWT, ensuring providers can't access customer-sensitive data and vice versa.

Automated Confirmations: Integrated email triggers for booking milestones and payment receipts.


## Tech Stack

### Frontend
React.js, DaisyUI

### Backend
Node.js, Express.js

### Database
MongoDB (Optimized with Mongoose Schema design)

### Real Time Communication 
Socket.IO

### Security 
JWT, Bcrypt, Role-based Middleware


## Installation

### Clone the repository

```bash
  git clone https://github.com/your-username/service-pro.git
  cd service-pro
```
### Install dependencies 

```bash 
  cd backend
  npm install
```

```bash
   cd frontend
   npm install
```

### Configure environment
Create a .env file in the backend directory

```bash
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
```

### Start development server

```bash
    cd backend
    npm run dev
```

```bash 
    cd frontend
    npm run dev
```

