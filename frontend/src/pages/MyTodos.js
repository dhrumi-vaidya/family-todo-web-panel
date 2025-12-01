import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Badge, Dropdown, ButtonGroup, Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { todoService } from '../services/todoService';
import TodoForm from '../components/TodoForm';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/dateUtils';

const MyTodos = () => {
    const { user } = useAuth();
    const [todos, setTodos] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);

    useEffect(() => {
        if (user) {
            loadTodos();
        }
    }, [user]);

    useEffect(() => {
        filterTodos();
    }, [todos, statusFilter]);

    const loadTodos = async () => {
        if (!user?._id) {
            console.warn('User not loaded yet');
            return;
        }
        try {
            const data = await todoService.getMyTodos(user._id);
            setTodos(data);
        } catch (error) {
            console.error('Error loading todos:', error);
            toast.error('Failed to load todos');
        }
    };

    const filterTodos = () => {
        if (statusFilter === 'all') {
            setFilteredTodos(todos);
        } else {
            setFilteredTodos(todos.filter(t => t.status === statusFilter));
        }
    };

    const handleEdit = (todo) => {
        setEditingTodo(todo);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingTodo(null);
    };

    const handleSuccess = () => {
        loadTodos();
        handleCloseForm();
    };

    const handleStatusChange = async (todoId, newStatus) => {
        try {
            await todoService.updateTodo(todoId, { status: newStatus });
            toast.success('Status updated!');
            loadTodos();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (todoId) => {
        if (window.confirm('Delete this todo?')) {
            try {
                await todoService.deleteTodo(todoId);
                toast.success('Todo deleted!');
                loadTodos();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const getPriorityBadge = (priority) => {
        const config = {
            high: { bg: 'danger', text: 'High' },
            medium: { bg: 'warning', text: 'Medium' },
            low: { bg: 'success', text: 'Low' }
        };
        const p = config[priority];
        return <Badge bg={p.bg} className="text-white">{p.text}</Badge>;
    };

    const getStatusConfig = (status) => {
        if (status === 'pending') return { color: '#fd7e14', text: 'Pending', icon: '⏳' };
        if (status === 'in-progress') return { color: '#0d6efd', text: 'In Progress', icon: '🔄' };
        return { color: '#28a745', text: 'Completed', icon: '✅' };
    };

    const stats = {
        total: todos.length,
        pending: todos.filter(t => t.status === 'pending').length,
        inProgress: todos.filter(t => t.status === 'in-progress').length,
        completed: todos.filter(t => t.status === 'completed').length
    };

    return (
        <Container className="mt-4" style={{ maxWidth: '1400px' }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">✅ My Todos</h2>
                    <p className="text-muted mb-0">Tasks assigned to you</p>
                </div>
                <Button variant="primary" onClick={() => setShowForm(true)}>
                    + New Todo
                </Button>
            </div>

            {/* Stats Cards */}
            <Row className="mb-4">
                <Col xs={6} md={3}>
                    <Card className="text-center shadow-sm border-0">
                        <Card.Body className="py-3">
                            <h3 className="mb-1">{stats.total}</h3>
                            <small className="text-muted">Total</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6} md={3}>
                    <Card className="text-center shadow-sm border-0" style={{ borderLeft: '4px solid #fd7e14' }}>
                        <Card.Body className="py-3">
                            <h3 className="mb-1 text-warning">{stats.pending}</h3>
                            <small className="text-muted">Pending</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6} md={3}>
                    <Card className="text-center shadow-sm border-0" style={{ borderLeft: '4px solid #0d6efd' }}>
                        <Card.Body className="py-3">
                            <h3 className="mb-1 text-primary">{stats.inProgress}</h3>
                            <small className="text-muted">In Progress</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6} md={3}>
                    <Card className="text-center shadow-sm border-0" style={{ borderLeft: '4px solid #28a745' }}>
                        <Card.Body className="py-3">
                            <h3 className="mb-1 text-success">{stats.completed}</h3>
                            <small className="text-muted">Completed</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filter */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Body>
                    <label className="form-label mb-2"><strong>Filter by Status</strong></label>
                    <div className="d-flex flex-wrap gap-2">
                        <Badge
                            bg={statusFilter === 'all' ? 'dark' : 'light'}
                            text={statusFilter === 'all' ? 'white' : 'dark'}
                            style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            onClick={() => setStatusFilter('all')}
                        >
                            All ({stats.total})
                        </Badge>
                        <Badge
                            style={{
                                cursor: 'pointer',
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                backgroundColor: statusFilter === 'pending' ? '#fd7e14' : '#e9ecef',
                                color: statusFilter === 'pending' ? 'white' : '#6c757d'
                            }}
                            onClick={() => setStatusFilter('pending')}
                        >
                            ⏳ Pending ({stats.pending})
                        </Badge>
                        <Badge
                            style={{
                                cursor: 'pointer',
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                backgroundColor: statusFilter === 'in-progress' ? '#0d6efd' : '#e9ecef',
                                color: statusFilter === 'in-progress' ? 'white' : '#6c757d'
                            }}
                            onClick={() => setStatusFilter('in-progress')}
                        >
                            🔄 In Progress ({stats.inProgress})
                        </Badge>
                        <Badge
                            style={{
                                cursor: 'pointer',
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                backgroundColor: statusFilter === 'completed' ? '#28a745' : '#e9ecef',
                                color: statusFilter === 'completed' ? 'white' : '#6c757d'
                            }}
                            onClick={() => setStatusFilter('completed')}
                        >
                            ✅ Completed ({stats.completed})
                        </Badge>
                    </div>
                </Card.Body>
            </Card>

            {/* Table */}
            <Card className="shadow-sm border-0">
                <Card.Body className="p-0">
                    {filteredTodos.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="mb-3" style={{ fontSize: '4rem', opacity: 0.3 }}>📝</div>
                            <h5 className="text-muted">No todos found</h5>
                            <p className="text-muted">Create your first todo to get started!</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <Table hover className="mb-0" style={{ minWidth: '800px' }}>
                                <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                    <tr>
                                        <th style={{ padding: '1rem' }}>Title</th>
                                        <th style={{ padding: '1rem', width: '25%' }}>Description</th>
                                        <th style={{ padding: '1rem', width: '100px' }}>Priority</th>
                                        <th style={{ padding: '1rem', width: '140px' }}>Status</th>
                                        <th style={{ padding: '1rem', width: '130px' }}>Assigned To</th>
                                        <th style={{ padding: '1rem', width: '120px' }}>Due Date</th>
                                        <th style={{ padding: '1rem', width: '100px', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTodos.map(todo => {
                                        const statusConfig = getStatusConfig(todo.status);
                                        return (
                                            <tr key={todo._id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                                                <td style={{ padding: '1rem' }}>
                                                    <strong>{todo.title}</strong>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{
                                                        maxWidth: '250px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {todo.description || <span className="text-muted">-</span>}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {getPriorityBadge(todo.priority)}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <Dropdown>
                                                        <Dropdown.Toggle
                                                            style={{
                                                                backgroundColor: statusConfig.color,
                                                                border: 'none',
                                                                borderRadius: '20px',
                                                                padding: '0.4rem 0.8rem',
                                                                fontSize: '0.85rem',
                                                                minWidth: '120px'
                                                            }}
                                                            size="sm"
                                                        >
                                                            {statusConfig.icon} {statusConfig.text}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {todo.status !== 'pending' && (
                                                                <Dropdown.Item onClick={() => handleStatusChange(todo._id, 'pending')}>
                                                                    ⏳ Pending
                                                                </Dropdown.Item>
                                                            )}
                                                            {todo.status !== 'in-progress' && (
                                                                <Dropdown.Item onClick={() => handleStatusChange(todo._id, 'in-progress')}>
                                                                    🔄 In Progress
                                                                </Dropdown.Item>
                                                            )}
                                                            {todo.status !== 'completed' && (
                                                                <Dropdown.Item onClick={() => handleStatusChange(todo._id, 'completed')}>
                                                                    ✅ Completed
                                                                </Dropdown.Item>
                                                            )}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {todo.assignedTo?.name || <span className="text-muted">Unassigned</span>}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {formatDate(todo.dueDate)}
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                    <ButtonGroup size="sm">
                                                        <Button
                                                            variant="outline-primary"
                                                            onClick={() => handleEdit(todo)}
                                                            title="Edit"
                                                            style={{ padding: '0.25rem 0.5rem' }}
                                                        >
                                                            ✏️
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            onClick={() => handleDelete(todo._id)}
                                                            title="Delete"
                                                            style={{ padding: '0.25rem 0.5rem' }}
                                                        >
                                                            🗑️
                                                        </Button>
                                                    </ButtonGroup>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <TodoForm
                show={showForm}
                handleClose={handleCloseForm}
                todo={editingTodo}
                onSuccess={handleSuccess}
            />
        </Container>
    );
};

export default MyTodos;
