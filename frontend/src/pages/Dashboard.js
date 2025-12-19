import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { useFamily } from '../context/FamilyContext';
import { todoService } from '../services/todoService';
import { budgetService } from '../services/budgetService';
import { calendarService } from '../services/calendarService';
import { formatDate } from '../utils/dateUtils';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const { user } = useAuth();
    const { family, members, fetchMembers } = useFamily();

    // State management
    const [loading, setLoading] = useState(true);
    const [activeGraph, setActiveGraph] = useState('tasks'); // 'tasks' or 'budget'
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calendarEvents, setCalendarEvents] = useState([]);

    // Budget data
    const [budgetSummary, setBudgetSummary] = useState({
        totalBudget: 0,
        totalSpent: 0,
        totalRemaining: 0,
        categories: []
    });

    // Task data
    const [taskStats, setTaskStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0
    });

    // Personal todos
    const [personalTodos, setPersonalTodos] = useState([]);

    // Chart data for tasks
    const [tasksChartData, setTasksChartData] = useState({
        labels: [],
        datasets: []
    });

    // Chart data for budget
    const [budgetChartData, setBudgetChartData] = useState({
        labels: [],
        datasets: []
    });

    const loadDashboardData = useCallback(async () => {
        try {
            setLoading(true);

            // Load personal todos
            const todos = await todoService.getTodos({ assignedTo: user.id });
            setPersonalTodos(todos.slice(0, 3)); // Show only top 3

            // Calculate task stats
            const stats = {
                total: todos.length,
                completed: todos.filter(t => t.status === 'completed').length,
                inProgress: todos.filter(t => t.status === 'in-progress').length,
                pending: todos.filter(t => t.status === 'pending').length
            };
            setTaskStats(stats);

            // Generate task completion chart data (last 7 days)
            generateTasksChartData(todos);

            // Load budget data if in family
            if (family) {
                try {
                    const budget = await budgetService.getCurrentBudget();
                    if (budget) {
                        const totalBudget = budget.categories.reduce((sum, cat) => sum + cat.allocated, 0);
                        const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent, 0);

                        setBudgetSummary({
                            totalBudget,
                            totalSpent,
                            totalRemaining: totalBudget - totalSpent,
                            categories: budget.categories
                        });

                        generateBudgetChartData(budget.categories);
                    }
                } catch (error) {
                    console.log('No budget data available');
                }
            }

            // Load personal calendar events
            try {
                const events = await calendarService.getPersonalEvents();
                setCalendarEvents(events || []);
            } catch (error) {
                console.log('No calendar events');
            }

        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    }, [user, family]);

    const generateTasksChartData = (todos) => {
        const last7Days = [];
        const completedCounts = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
            last7Days.push(dateStr);

            // Count tasks completed on this day
            const completed = todos.filter(t => {
                if (t.status === 'completed' && t.updatedAt) {
                    const updatedDate = new Date(t.updatedAt);
                    return updatedDate.toDateString() === date.toDateString();
                }
                return false;
            }).length;

            completedCounts.push(completed);
        }

        setTasksChartData({
            labels: last7Days,
            datasets: [
                {
                    label: 'Tasks Completed',
                    data: completedCounts,
                    borderColor: '#4c6ef5',
                    backgroundColor: 'rgba(76, 110, 245, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4c6ef5',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        });
    };

    const generateBudgetChartData = (categories) => {
        const categoryNames = categories.map(cat => cat.category);
        const spentAmounts = categories.map(cat => cat.spent);

        setBudgetChartData({
            labels: categoryNames,
            datasets: [
                {
                    label: 'Spending (₹)',
                    data: spentAmounts,
                    borderColor: '#f59f00',
                    backgroundColor: 'rgba(245, 159, 0, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#f59f00',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        });
    };

    useEffect(() => {
        if (user) {
            loadDashboardData();
        }
    }, [user, loadDashboardData]);

    useEffect(() => {
        if (family && members.length === 0) {
            fetchMembers();
        }
    }, [family, members.length, fetchMembers]);



    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                borderRadius: 8,
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    font: {
                        size: 12
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#dc3545';
            case 'medium': return '#f59f00';
            case 'low': return '#28a745';
            default: return '#6c757d';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <Badge bg="success">Completed</Badge>;
            case 'in-progress':
                return <Badge bg="primary">In Progress</Badge>;
            case 'pending':
                return <Badge style={{ backgroundColor: '#fd7e14' }}>Pending</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    const hasEventsOnDate = (date) => {
        return calendarEvents.some(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === date.toDateString();
        });
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </Container>
        );
    }

    const budgetPercentage = budgetSummary.totalBudget > 0
        ? ((budgetSummary.totalSpent / budgetSummary.totalBudget) * 100).toFixed(0)
        : 0;

    const completionRate = taskStats.total > 0
        ? ((taskStats.completed / taskStats.total) * 100).toFixed(0)
        : 0;

    return (
        <Container fluid className="dashboard-container p-4">
            {/* Welcome Header */}
            <Row className="mb-4">
                <Col>
                    <h2 className="mb-1">Welcome back, {user?.name}! 👋</h2>
                    <p className="text-muted">
                        {family ? `Family: ${family.name}` : 'You are not in a family yet'}
                    </p>
                </Col>
            </Row>

            <Row>
                {/* Left Column */}
                <Col lg={8}>
                    {/* Project Summary = Budget Summary */}
                    <Card className="shadow-sm mb-4" style={{ border: 'none', borderRadius: '12px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">
                                    <i className="bi bi-wallet2"></i> Budget Summary
                                </h5>
                            </div>

                            <Row className="mb-3">
                                <Col md={4} className="mb-3 mb-md-0">
                                    <Card className="text-center" style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white'
                                    }}>
                                        <Card.Body className="py-4">
                                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                                                💰
                                            </div>
                                            <h5 className="mb-0">₹{budgetSummary.totalBudget.toLocaleString()}</h5>
                                            <small style={{ opacity: 0.9 }}>Total Budget</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4} className="mb-3 mb-md-0">
                                    <Card className="text-center" style={{
                                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white'
                                    }}>
                                        <Card.Body className="py-4">
                                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                                                💸
                                            </div>
                                            <h5 className="mb-0">₹{budgetSummary.totalSpent.toLocaleString()}</h5>
                                            <small style={{ opacity: 0.9 }}>Total Spent</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="text-center" style={{
                                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white'
                                    }}>
                                        <Card.Body className="py-4">
                                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                                                💵
                                            </div>
                                            <h5 className="mb-0">₹{budgetSummary.totalRemaining.toLocaleString()}</h5>
                                            <small style={{ opacity: 0.9 }}>Remaining</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {budgetSummary.totalBudget > 0 && (
                                <div className="mt-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <small className="text-muted">Budget Utilization</small>
                                        <small className="fw-bold">{budgetPercentage}%</small>
                                    </div>
                                    <ProgressBar
                                        now={budgetPercentage}
                                        variant={budgetPercentage > 90 ? 'danger' : budgetPercentage > 70 ? 'warning' : 'success'}
                                        style={{ height: '8px', borderRadius: '4px' }}
                                    />
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Recent Activity = Switchable Graphs */}
                    <Card className="shadow-sm mb-4" style={{ border: 'none', borderRadius: '12px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0">
                                    <i className="bi bi-activity"></i> Recent Activity
                                </h5>
                                <div className="btn-group" role="group">
                                    <button
                                        type="button"
                                        className={`btn btn-sm ${activeGraph === 'tasks' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setActiveGraph('tasks')}
                                        style={{ borderRadius: '8px 0 0 8px' }}
                                    >
                                        📋 Tasks
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn btn-sm ${activeGraph === 'budget' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setActiveGraph('budget')}
                                        style={{ borderRadius: '0 8px 8px 0' }}
                                    >
                                        💰 Budget
                                    </button>
                                </div>
                            </div>

                            <div style={{ height: '300px' }}>
                                {activeGraph === 'tasks' ? (
                                    <div>
                                        <div className="text-center mb-3 p-3" style={{
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '8px',
                                            display: 'inline-block',
                                            minWidth: '200px'
                                        }}>
                                            <h3 className="mb-0" style={{ color: '#4c6ef5' }}>
                                                {taskStats.completed}/{taskStats.total}
                                            </h3>
                                            <small className="text-muted">Tasks Completed ({completionRate}%)</small>
                                        </div>
                                        <Line data={tasksChartData} options={chartOptions} />
                                    </div>
                                ) : (
                                    <div>
                                        {budgetSummary.categories.length > 0 ? (
                                            <Line data={budgetChartData} options={chartOptions} />
                                        ) : (
                                            <div className="text-center text-muted py-5">
                                                <i className="bi bi-graph-down" style={{ fontSize: '3rem' }}></i>
                                                <p className="mt-3">No budget data available</p>
                                                <Button as={Link} to="/budget" variant="outline-primary" size="sm">
                                                    Setup Budget
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Column */}
                <Col lg={4}>
                    {/* Our Team = Family Members */}
                    <Card className="shadow-sm mb-4" style={{ border: 'none', borderRadius: '12px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">
                                    <i className="bi bi-people"></i> Our Team
                                </h5>
                                {members.length > 0 && (
                                    <Badge bg="primary" pill>{members.length}</Badge>
                                )}
                            </div>

                            {family && members.length > 0 ? (
                                <div>
                                    <p className="text-muted small mb-3">Family members</p>
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {members.slice(0, 5).map((member, index) => (
                                            <div
                                                key={member._id}
                                                className="d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: '45px',
                                                    height: '45px',
                                                    borderRadius: '50%',
                                                    backgroundColor: ['#667eea', '#f093fb', '#4facfe', '#f59f00', '#28a745'][index % 5],
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.1rem',
                                                    position: 'relative',
                                                    cursor: 'pointer'
                                                }}
                                                title={member.name}
                                            >
                                                {member.name.charAt(0).toUpperCase()}
                                                {member.role === 'admin' && (
                                                    <span style={{
                                                        position: 'absolute',
                                                        bottom: '-2px',
                                                        right: '-2px',
                                                        fontSize: '0.8rem'
                                                    }}>
                                                        👑
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                        {members.length > 5 && (
                                            <div
                                                className="d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: '45px',
                                                    height: '45px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#e9ecef',
                                                    color: '#6c757d',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                +{members.length - 5}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3">
                                        {members.slice(0, 3).map(member => (
                                            <div key={member._id} className="d-flex align-items-center mb-2 p-2" style={{
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '8px'
                                            }}>
                                                <div style={{
                                                    width: '35px',
                                                    height: '35px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#667eea',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 'bold',
                                                    marginRight: '12px'
                                                }}>
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold" style={{ fontSize: '0.9rem' }}>
                                                        {member.name}
                                                        {member._id === user.id && (
                                                            <Badge bg="info" className="ms-2" style={{ fontSize: '0.7rem' }}>You</Badge>
                                                        )}
                                                    </div>
                                                    <small className="text-muted">{member.email}</small>
                                                </div>
                                                {member.role === 'admin' && <span>👑</span>}
                                            </div>
                                        ))}
                                    </div>

                                    {members.length > 3 && (
                                        <Button
                                            as={Link}
                                            to="/family"
                                            variant="outline-primary"
                                            size="sm"
                                            className="w-100 mt-3"
                                            style={{ borderRadius: '8px' }}
                                        >
                                            View All Members
                                        </Button>
                                    )}

                                    <div className="mt-3 p-3" style={{
                                        background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                                        borderRadius: '8px',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div className="text-center" style={{
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '50%',
                                                background: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '15px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }}>
                                                <div style={{
                                                    fontSize: '1.8rem',
                                                    fontWeight: 'bold',
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent'
                                                }}>
                                                    {completionRate}%
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <small className="text-muted d-block">Target achieved</small>
                                                <ProgressBar
                                                    now={completionRate}
                                                    style={{ height: '6px', borderRadius: '3px' }}
                                                    variant="primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted py-4">
                                    <i className="bi bi-people" style={{ fontSize: '2.5rem' }}></i>
                                    <p className="mt-3 mb-3">No family yet</p>
                                    <Button as={Link} to="/family-setup" variant="outline-primary" size="sm">
                                        Create or Join Family
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Personal Calendar */}
                    <Card className="shadow-sm mb-4" style={{ border: 'none', borderRadius: '12px' }}>
                        <Card.Body className="p-3">
                            <h5 className="mb-3 px-2">
                                <i className="bi bi-calendar-event"></i> Calendar
                            </h5>
                            <Calendar
                                onChange={setSelectedDate}
                                value={selectedDate}
                                tileClassName={({ date }) =>
                                    hasEventsOnDate(date) ? 'has-event' : null
                                }
                                className="dashboard-calendar"
                            />
                            <div className="mt-3 px-2">
                                <Button
                                    as={Link}
                                    to="/calendar"
                                    variant="outline-primary"
                                    size="sm"
                                    className="w-100"
                                    style={{ borderRadius: '8px' }}
                                >
                                    View Full Calendar
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Projects = Personal Todos List */}
                    <Card className="shadow-sm" style={{ border: 'none', borderRadius: '12px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">
                                    <i className="bi bi-list-task"></i> My Tasks
                                </h5>
                                <Link to="/my-todos" className="text-decoration-none small">
                                    View all
                                </Link>
                            </div>

                            {personalTodos.length > 0 ? (
                                <div>
                                    {personalTodos.map((todo, index) => (
                                        <Card
                                            key={todo._id}
                                            className="mb-3"
                                            style={{
                                                border: 'none',
                                                borderLeft: `4px solid ${getPriorityColor(todo.priority)}`,
                                                borderRadius: '8px',
                                                backgroundColor: '#f8f9fa'
                                            }}
                                        >
                                            <Card.Body className="p-3">
                                                <div className="d-flex align-items-start">
                                                    <div
                                                        className="me-3 d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '8px',
                                                            backgroundColor: ['#8b5cf6', '#f59f00', '#28a745'][index % 3],
                                                            color: 'white',
                                                            fontSize: '1.2rem',
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        {['S', 'C', 'H'][index % 3]}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1" style={{ fontSize: '0.95rem' }}>
                                                            {todo.title}
                                                        </h6>
                                                        {todo.dueDate && (
                                                            <small className="text-muted d-block mb-2">
                                                                <i className="bi bi-calendar3"></i> {formatDate(todo.dueDate)}
                                                            </small>
                                                        )}
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="d-flex align-items-center gap-2">
                                                                {getStatusBadge(todo.status)}
                                                                <Badge
                                                                    style={{
                                                                        backgroundColor: getPriorityColor(todo.priority),
                                                                        fontSize: '0.7rem'
                                                                    }}
                                                                >
                                                                    {todo.priority}
                                                                </Badge>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-1">
                                                                {todo.assignedTo && (
                                                                    <div style={{
                                                                        width: '24px',
                                                                        height: '24px',
                                                                        borderRadius: '50%',
                                                                        backgroundColor: '#667eea',
                                                                        color: 'white',
                                                                        fontSize: '0.7rem',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        fontWeight: 'bold'
                                                                    }}>
                                                                        {user.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted py-4">
                                    <i className="bi bi-clipboard-check" style={{ fontSize: '2.5rem' }}></i>
                                    <p className="mt-3 mb-3">No tasks yet</p>
                                    <Button as={Link} to="/my-todos" variant="outline-primary" size="sm">
                                        Create Task
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Custom CSS for calendar */}
            <style jsx>{`
                .dashboard-calendar {
                    width: 100%;
                    border: none;
                    border-radius: 8px;
                    font-size: 0.85rem;
                }
                
                .dashboard-calendar .react-calendar__tile {
                    border-radius: 6px;
                    aspect-ratio: 1;
                }
                
                .dashboard-calendar .react-calendar__tile--active {
                    background: #667eea !important;
                    color: white;
                }
                
                .dashboard-calendar .react-calendar__tile:hover {
                    background: #f8f9fa;
                }
                
                .dashboard-calendar .has-event {
                    background: #fff3cd;
                    font-weight: bold;
                }
                
                .dashboard-calendar .react-calendar__month-view__days__day--weekend {
                    color: #dc3545;
                }
                
                .dashboard-calendar .react-calendar__tile--now {
                    background: #e7f5ff;
                    font-weight: bold;
                }
            `}</style>
        </Container>
    );
};

export default Dashboard;
