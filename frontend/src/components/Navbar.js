import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavigationBar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/dashboard">
                    📝 Family Todo
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link as={Link} to="/my-todos">My Todos</Nav.Link>
                        <Nav.Link as={Link} to="/family-todos">Family Todos</Nav.Link>
                        <NavDropdown title="Calendar" id="calendar-dropdown">
                            <NavDropdown.Item as={Link} to="/family-calendar">
                                Family Calendar
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/personal-calendar">
                                Personal Calendar
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} to="/bills">💰 Bills</Nav.Link>
                        <Nav.Link as={Link} to="/budget">📊 Budget</Nav.Link>
                        <Nav.Link as={Link} to="/family-tree">🌳 Family Tree</Nav.Link>
                    </Nav>
                    <Nav>
                        <NavDropdown title={user?.name || 'User'} id="user-dropdown" align="end">
                            <NavDropdown.Item as={Link} to="/profile">
                                👤 My Profile
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={logout}>
                                🚪 Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
