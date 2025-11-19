# Family Todo & Calendar Web Panel

A collaborative to-do management and calendar system for families built with React, Node.js, MongoDB, and Bootstrap.

## Features

- 👥 **Family Management**: Create or join families with invite codes
- ✅ **Todo Management**: Create, assign, and track tasks
- 📅 **Dual Calendars**: Family and personal calendar views
- ⏰ **Scheduled Tasks**: Set specific times for tasks
- 🎯 **Priority Levels**: High, medium, and low priority tasks
- 📊 **Dashboard**: Overview of tasks and quick stats
- 🔐 **Secure Authentication**: JWT-based authentication

## Tech Stack

- **Frontend**: React, Bootstrap, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
cd /home/dhrumivaidya/Desktop/project
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (already created, but verify settings):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/family-todo
JWT_SECRET=family-todo-secret-key-2025
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Frontend `.env` is already configured with:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:
```bash
sudo systemctl start mongod
# or
mongod
```

### Start Backend Server

```bash
cd backend
npm run dev
# or
npm start
```

Backend will run on `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm start
```

Frontend will run on `http://localhost:3000`

## Usage

1. **Register**: Create a new account
2. **Create/Join Family**: After registration, create a new family or join existing one with invite code
3. **Dashboard**: View your stats and upcoming tasks
4. **My Todos**: Manage your personal tasks
5. **Family Todos**: View and manage all family tasks
6. **Calendars**: Use family and personal calendar views

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Family
- `POST /api/family/create` - Create family
- `POST /api/family/join` - Join family
- `GET /api/family/members` - Get family members
- `DELETE /api/family/leave` - Leave family

### Todos
- `POST /api/todos` - Create todo
- `GET /api/todos` - Get todos with filters
- `GET /api/todos/family` - Get all family todos
- `GET /api/todos/upcoming` - Get upcoming scheduled tasks
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Calendar
- `POST /api/calendar/events` - Create event
- `GET /api/calendar/personal` - Get personal events
- `GET /api/calendar/family` - Get family events
- `GET /api/calendar/month/:year/:month` - Get events by month
- `PUT /api/calendar/events/:id` - Update event
- `DELETE /api/calendar/events/:id` - Delete event

## Project Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   └── app.js         # Main server file
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── services/      # API services
    │   ├── context/       # React context
    │   ├── App.js         # Main app component
    │   └── App.css        # Styles
    └── package.json
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC
