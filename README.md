# User Management System (UMS)

A User Management System built using Node.js, TypeScript, Express, MongoDB, and EJS.  
The application supports Admin and User roles with session-based authentication and role-based access control.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB
- EJS
- Express-session

## Features

### User
- User registration and login
- Session-based authentication
- Profile update functionality
- Secure access to user-specific pages

### Admin
- Admin login
- Admin dashboard
- View all users
- Create new users
- Edit user details
- Search users
- Role-based access control

## Project Structure

src/
├── config/
├── controllers/
├── routes/
├── types/
├── models/
├── middlewares/
├── views/
├── public/
└── app.ts

## Authentication & Authorization

- Session-based authentication using express-session
- Middleware for route protection
- Separate access for Admin and User
- Unauthorized access is restricted

## Installation & Setup

1. Clone the repository
   git clone https://github.com/VishnuDas-TP/UMS-Typescript.git



2. Install dependencies
   npm install

3. Create a .env file and add the following
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_secret_key

4. Start the development server
   npm run dev

## Scripts

- npm run dev – Start development server
- npm run build – Compile TypeScript
- npm start – Start production server

## Future Enhancements

- Password hashing
- Improved validation
- Enhanced security features

## Author

Vishnu
