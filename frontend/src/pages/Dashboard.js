import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFamily } from '../context/FamilyContext';
import { todoService } from '../services/todoService';
import { billService } from '../services/billService';
import { formatDate, formatDateTime } from '../utils/dateUtils';

const Dashboard = () => {
    const { user } = useAuth();
    const { family, members, fetchMembers } = useFamily();
    const [stats, setStats] = useState({
        pending: 0,
        inProgress: 0,
        completed: 0
    });
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [upcomingBills, setUpcomingBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadDashboardData();
        }
    }, [user]);

    useEffect(() => {
        if (family && members.length === 0) {
            fetchMembers();
        }
    }, [family]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Load todos for stats
            const todos = await todoService.getTodos({ assignedTo: user.id });
            setStats({
                pending: todos.filter(t => t.status === 'pending').length,
                inProgress: todos.filter(t => t.status === 'in-progress').length,
                completed: todos.filter(t => t.status === 'completed').length
            });

            // Load upcoming scheduled tasks
            const upcoming = await todoService.getUpcomingTodos();
            setUpcomingTasks(upcoming.slice(0, 5));

            // Load upcoming bills if in family
            if (family) {
                try {
                    const bills = await billService.getUpcomingBills();
                    setUpcomingBills(bills.slice(0, 5));
                } catch (error) {
                    // Ignore if no bills
                }
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            {/* Welcome Header */}
            <Row className="mb-4">
                <Col>
                    <h2>Welcome back, {user?.name}! 👋</h2>
                    <p className="text-muted">
                        {family ? `Family: ${family.name}` : 'You are not in a family yet'}
                    </p>
                </Col>
            </Row>

            {/* Task Statistics */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="stat-card shadow-sm text-center">
                        <Card.Body>
                            <h3 style={{ color: '#fd7e14' }}>{stats.pending}</h3>
                            <p className="mb-0 text-muted">Pending Tasks</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="stat-card shadow-sm text-center">
                        <Card.Body>
                            <h3 style={{ color: '#0d6efd' }}>{stats.inProgress}</h3>
                            <p className="mb-0 text-muted">In Progress</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="stat-card shadow-sm text-center">
                        <Card.Body>
                            <h3 style={{ color: '#28a745' }}>{stats.completed}</h3>
                            <p className="mb-0 text-muted">Completed</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Family Members Overview */}
            {family && members.length > 0 && (
                <Row className="mb-4">
                    <Col>
                        <Card className="shadow-sm">
                            <Card.Header style={{ backgroundColor: '#0d6efd', color: 'white' }}>
                                <h5 className="mb-0">👨‍👩‍👧‍👦 Family Members</h5>
                            </Card.Header>
                            <Card.Body>
                                <Table responsive hover>
                                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map(member => (
                                            <tr key={member._id}>
                                                <td>
                                                    <strong>{member.name}</strong>
                                                    {member._id === user.id && <Badge bg="info" className="ms-2">You</Badge>}
                                                </td>
                                                <td>{member.email}</td>
                                                <td>
                                                    <Badge bg={member.role === 'admin' ? 'danger' : 'secondary'}>
                                                        {member.role === 'admin' ? '👑 Admin' : 'Member'}
                                                    </Badge>
                                                </td>
                                                <td>{formatDate(member.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                {family.inviteCode && (
                                    <div className="mt-3 p-3 bg-light rounded">
                                        <strong>Family Invite Code:</strong>
                                        <code className="ms-2 p-2 bg-white rounded">{family.inviteCode}</code>
                                        <small className="d-block text-muted mt-1">Share this code with family members to invite them</small>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <Row>
                {/* Upcoming Tasks */}
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header style={{ backgroundColor: '#0d6efd', color: 'white' }}>
                            <h5 className="mb-0">📅 Upcoming Scheduled Tasks</h5>
                        </Card.Header>
                        <Card.Body>
                            {upcomingTasks.length === 0 ? (
                                <p className="text-muted text-center py-3">No upcoming scheduled tasks</p>
                            ) : (
                                <Table responsive hover size="sm">
                                    <tbody>
                                        {upcomingTasks.map(task => (
                                            <tr key={task._id}>
                                                <td>
                                                    <strong>{task.title}</strong>
                                                    <br />
                                                    <small className="text-muted">
                                                        {formatDateTime(task.scheduledTime)}
                                                    </small>
                                                </td>
                                                <td>
                                                    <Badge bg={
                                                        task.status === 'completed' ? 'success' :
                                                            task.status === 'in-progress' ? 'primary' : 'warning'
                                                    } style={task.status === 'pending' ? { backgroundColor: '#fd7e14' } : {}}>
                                                        {task.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                            <div className="text-center mt-3">
                                <Button as={Link} to="/my-todos" variant="outline-primary" size="sm">
                                    View All Tasks →
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Upcoming Bills */}
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header style={{ backgroundColor: '#28a745', color: 'white' }}>
                            <h5 className="mb-0">💰 Upcoming Bills</h5>
                        </Card.Header>
                        <Card.Body>
                            {upcomingBills.length === 0 ? (
                                <p className="text-muted text-center py-3">No upcoming bills</p>
                            ) : (
                                <Table responsive hover size="sm">
                                    <tbody>
                                        {upcomingBills.map(bill => (
                                            <tr key={bill._id}>
                                                <td>
                                                    <strong>{bill.title}</strong>
                                                    <br />
                                                    <small className="text-muted">
                                                        Due: {formatDate(bill.dueDate)}
                                                    </small>
                                                </td>
                                                <td className="text-end">
                                                    <strong>₹{bill.amount.toFixed(2)}</strong>
                                                    <br />
                                                    <Badge bg={bill.isPaid ? 'success' : 'danger'}>
                                                        {bill.isPaid ? 'Paid' : 'Unpaid'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                            <div className="text-center mt-3">
                                <Button as={Link} to="/bills" variant="outline-success" size="sm">
                                    View All Bills →
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header style={{ backgroundColor: '#6c757d', color: 'white' }}>
                            <h5 className="mb-0">⚡ Quick Actions</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={3} className="mb-2">
                                    <Button as={Link} to="/my-todos" variant="outline-primary" className="w-100">
                                        📝 My Todos
                                    </Button>
                                </Col>
                                <Col md={3} className="mb-2">
                                    <Button as={Link} to="/family-todos" variant="outline-info" className="w-100">
                                        👨‍👩‍👧 Family Todos
                                    </Button>
                                </Col>
                                <Col md={3} className="mb-2">
                                    <Button as={Link} to="/bills" variant="outline-success" className="w-100">
                                        💰 Bills
                                    </Button>
                                </Col>
                                <Col md={3} className="mb-2">
                                    <Button as={Link} to="/budget" variant="outline-warning" className="w-100">
                                        📊 Budget
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* No Family Message */}
            {!family && (
                <Row>
                    <Col>
                        <Card className="shadow-sm text-center py-5">
                            <Card.Body>
                                <h4>👨‍👩‍👧‍👦 Join or Create a Family</h4>
                                <p className="text-muted">Get started by creating a family or joining an existing one</p>
                                <Button as={Link} to="/family-setup" variant="primary">
                                    Setup Family
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default Dashboard;
