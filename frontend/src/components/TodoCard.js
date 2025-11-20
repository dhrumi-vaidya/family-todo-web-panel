import React from 'react';
import { Card, Badge, Button, ButtonGroup } from 'react-bootstrap';
import { todoService } from '../services/todoService';
import { toast } from 'react-toastify';

const TodoCard = ({ todo, onUpdate, onDelete, onEdit }) => {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'secondary';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'in-progress': return 'primary';
            case 'pending': return 'warning'; // This will be overridden with orange in style
            default: return 'secondary';
        }
    };

    const getStatusStyle = (status) => {
        if (status === 'pending') {
            return { backgroundColor: '#fd7e14', color: 'white' };
        }
        return {};
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await todoService.updateTodo(todo._id, { status: newStatus });
            toast.success(`Task marked as ${newStatus}!`);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update task status');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            try {
                await todoService.deleteTodo(todo._id);
                toast.success('Task deleted successfully!');
                if (onDelete) onDelete();
            } catch (error) {
                console.error('Error deleting todo:', error);
                toast.error('Failed to delete task');
            }
        }
    };

    const handleEditClick = () => {
        if (onEdit) {
            onEdit(todo);
        }
    };

    return (
        <Card className={`mb-3 shadow-sm todo-card priority-${todo.priority}`}>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0">{todo.title}</h5>
                    <div>
                        <Badge bg={getPriorityColor(todo.priority)} className="me-2">
                            {todo.priority}
                        </Badge>
                        <Badge bg={getStatusColor(todo.status)} style={getStatusStyle(todo.status)}>
                            {todo.status}
                        </Badge>
                    </div>
                </div>

                {todo.description && (
                    <p className="text-muted mb-2">{todo.description}</p>
                )}

                <div className="small text-muted mb-3">
                    <div><strong>Assigned to:</strong> {todo.assignedTo?.name || 'Unknown'}</div>
                    <div><strong>Created by:</strong> {todo.createdBy?.name || 'Unknown'}</div>
                    {todo.dueDate && (
                        <div><strong>Due:</strong> {new Date(todo.dueDate).toLocaleDateString()}</div>
                    )}
                    {todo.scheduledTime && (
                        <div><strong>Scheduled:</strong> {new Date(todo.scheduledTime).toLocaleString()}</div>
                    )}
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <ButtonGroup size="sm">
                        {todo.status !== 'in-progress' && (
                            <Button
                                variant="outline-primary"
                                onClick={() => handleStatusChange('in-progress')}
                            >
                                In Progress
                            </Button>
                        )}
                        {todo.status !== 'completed' && (
                            <Button
                                variant="outline-success"
                                onClick={() => handleStatusChange('completed')}
                            >
                                Complete
                            </Button>
                        )}
                    </ButtonGroup>

                    <div>
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={handleEditClick}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default TodoCard;
