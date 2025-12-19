import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FamilyProvider } from './context/FamilyContext';
import { ThemeProvider } from './context/ThemeContext';
import NavigationBar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyTodos from './pages/MyTodos';
import FamilyTodos from './pages/FamilyTodos';
import FamilyCalendar from './pages/FamilyCalendar';
import PersonalCalendar from './pages/PersonalCalendar';
import FamilySetup from './pages/FamilySetup';
import Bills from './pages/Bills';
import Budget from './pages/Budget';
import Profile from './pages/Profile';
import FamilyTree from './pages/FamilyTree';
import AcceptInvitation from './pages/AcceptInvitation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FamilyProvider>
          <Router>
            <div className="App">
              <NavigationBar />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/accept-invitation/:token" element={<AcceptInvitation />} />
                <Route
                  path="/family-setup"
                  element={
                    <PrivateRoute>
                      <FamilySetup />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-todos"
                  element={
                    <PrivateRoute>
                      <MyTodos />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/family-todos"
                  element={
                    <PrivateRoute>
                      <FamilyTodos />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/family-calendar"
                  element={
                    <PrivateRoute>
                      <FamilyCalendar />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/personal-calendar"
                  element={
                    <PrivateRoute>
                      <PersonalCalendar />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/bills"
                  element={
                    <PrivateRoute>
                      <Bills />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/budget"
                  element={
                    <PrivateRoute>
                      <Budget />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/family-tree"
                  element={
                    <PrivateRoute>
                      <FamilyTree />
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </div>
          </Router>
        </FamilyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
