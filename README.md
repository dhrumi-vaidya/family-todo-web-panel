# 👨‍👩‍👧‍👦 Family Todo Web Panel

A comprehensive family task and budget management application built with React, Node.js, Express, and MongoDB. Manage your family's todos, bills, budget, and calendar in one place with a beautiful, user-friendly interface.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with JWT
- Role-based access control (Admin/Member)
- Family creator automatically becomes admin
- Secure password hashing with bcrypt

### 👨‍👩‍👧 Family Management
- Create or join families with invite codes
- Email invitation system with admin approval
- Visual family tree with hierarchy
- Admin controls for member management
- Remove members or change roles (admin only)

### ✅ Task Management
- Create, edit, and delete todos
- Assign tasks to family members
- Priority levels (High, Medium, Low)
- Status tracking (Pending, In Progress, Completed)
- Due dates and scheduled times
- Table view with clickable status dropdowns
- Filter by status and family member

### 💰 Bills & Payments (INR Currency)
- Track family bills with categories
- Mark bills as paid/unpaid
- Recurring bill support
- Due date tracking with overdue alerts
- File attachment support (PDF/images)
- Assign bills to family members
- Table view with payment status dropdown

### 📊 Budget Management (INR Currency)
- Set monthly budgets
- Category-wise allocation
- Add custom budget categories
- Track spending vs allocated amounts
- Visual progress bars with color coding
- Budget overspending alerts

### 📅 Calendar
- Family calendar for shared events
- Personal calendar for individual events
- Scheduled tasks integration
- Month view with react-calendar
- Event creation and editing

### 👤 User Profile
- Edit profile (name, phone, bio)
- Change password
- View account information
- Role display

### 🎨 UI/UX Features
- Modern, responsive Bootstrap design
- Solid color scheme (no gradients)
- Toast notifications for user feedback
- Loading spinners for async operations
- Icon-based action buttons
- Table views with sortable columns
- Mobile-responsive layout

## 🚀 Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **React Bootstrap** - UI components
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Calendar** - Calendar component

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File uploads

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/dhrumi-vaidya/family-todo-web-panel.git
cd family-todo-web-panel
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy .env.example to .env and configure
cp .env.example .env
```

Edit `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/family-todo
JWT_SECRET=your_jwt_secret_key_here
PORT=5000

# Optional: Email configuration for invitations
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Family Todo App <noreply@familytodo.com>
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### 4. Start MongoDB
```bash
sudo systemctl start mongod
```

### 5. Run the Application

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Family
- `POST /api/family/create` - Create family (becomes admin)
- `POST /api/family/join` - Join family with invite code
- `GET /api/family/members` - Get family members
- `DELETE /api/family/leave` - Leave family
- `PUT /api/family/members/role` - Update member role (admin only)
- `DELETE /api/family/members/:id` - Remove member (admin only)

### Invitations
- `POST /api/invitations/send` - Send email invitation
- `GET /api/invitations/:token` - Get invitation details
- `POST /api/invitations/accept` - Accept invitation (register)
- `GET /api/invitations/pending/list` - Get pending approvals (admin)
- `POST /api/invitations/review` - Approve/reject invitation (admin)

### Todos
- `GET /api/todos` - Get todos (with filters)
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `GET /api/todos/upcoming` - Get upcoming scheduled tasks

### Bills
- `GET /api/bills` - Get bills (with filters)
- `POST /api/bills` - Create bill (supports file upload)
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete bill
- `PATCH /api/bills/:id/paid` - Mark bill as paid
- `GET /api/bills/upcoming` - Get upcoming bills

### Budget
- `POST /api/budget` - Set/update monthly budget
- `GET /api/budget/current` - Get current month budget
- `GET /api/budget/:year/:month` - Get specific month budget
- `PATCH /api/budget/:id/spending` - Update category spending

### Calendar
- `GET /api/calendar/events` - Get events
- `POST /api/calendar/events` - Create event
- `PUT /api/calendar/events/:id` - Update event
- `DELETE /api/calendar/events/:id` - Delete event

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/change-password` - Change password

## 🎯 Usage

### Getting Started
1. **Register**: Create an account
2. **Create/Join Family**: Set up your family or join with invite code
3. **Invite Members**: Send email invitations to family members
4. **Approve Members**: Admin approves new member requests
5. **Start Managing**: Add todos, bills, and set budgets!

### Family Hierarchy
- **Admin**: Family creator with full access
  - Approve/reject new members
  - Remove members
  - Change member roles
  - All member permissions
- **Member**: Regular family member
  - View family data
  - Create todos/bills/budgets
  - Send invitations
  - Manage own profile

### Email Invitations Workflow
1. Any member clicks "+ Invite Member"
2. Enters email and sends invitation
3. Invited person receives email with link
4. They register using the link
5. Admin sees request in "Pending Approvals"
6. Admin approves or rejects
7. User is notified via email

## 🔒 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- Input validation
- XSS protection

## 📱 Screenshots & Demo

### Table Views
- Clean, sortable tables with action columns
- Clickable status dropdowns for quick updates
- Icon-based actions (✏️ Edit, 🗑️ Delete)
- Responsive design for mobile

### Color Scheme
- **Pending**: Orange (#fd7e14)
- **In Progress**: Blue (#0d6efd)
- **Completed**: Green (#28a745)
- **Overdue/Danger**: Red (#dc3545)
- **Warning**: Yellow (#ffc107)

## 🛠️ Development

### Project Structure
```
family-todo-web-panel/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
└── README.md
```

### Available Scripts

**Backend**:
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

**Frontend**:
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Author

**Dhrumi Vaidya**
- GitHub: [@dhrumi-vaidya](https://github.com/dhrumi-vaidya)
- Email: dvtheta@gmail.com

## 🙏 Acknowledgments

- React team for the amazing library
- Bootstrap team for the UI components
- MongoDB team for the database
- All open-source contributors

## 📞 Support

For support, email dvtheta@gmail.com or open an issue on GitHub.

---

Made with ❤️ by Dhrumi Vaidya
