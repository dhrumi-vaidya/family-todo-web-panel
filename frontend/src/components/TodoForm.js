import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useFamily } from '../context/FamilyContext';
import { todoService } from '../services/todoService';

const TodoForm = ({ show, handleClose, todo, onSuccess }) => {
    const { user } = useAuth();
    const { members } = useFamily();

    const getInitialFormData = () => ({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        scheduledTime: '',
        assignedTo: user?.id || '',
        isCalendarEvent: false
    });

    const [formData, setFormData] = useState(getInitialFormData());
    const [loading, setLoading] = useState(false);

    // Reset form when todo prop changes or modal opens/closes
    useEffect(() => {
        if (show) {
            if (todo) {
                // Edit mode - populate form with todo data
                setFormData({
                    title: todo.title || '',
                    description: todo.description || '',
                    priority: todo.priority || 'medium',
                    dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
                    scheduledTime: todo.scheduledTime ? new Date(todo.scheduledTime).toISOString().slice(0, 16) : '',
                    assignedTo: todo.assignedTo?._id || user?.id || '',
                    isCalendarEvent: todo.isCalendarEvent || false
                });
            } else {
                // Create mode - reset to default
                setFormData(getInitialFormData());
            }
        }
    }, [show, todo, user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            alert('Title is required');
            return;
        }

        setLoading(true);

        try {
            const data = {
                ...formData,
                dueDate: formData.dueDate || undefined,
                scheduledTime: formData.scheduledTime || undefined
            };

            if (todo) {
                await todoService.updateTodo(todo._id, data);
            } else {
                await todoService.createTodo(data);
            }

            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Error saving todo:', error);
            alert('Failed to save todo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{todo ? 'Edit Todo' : 'Create New Todo'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Title *</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter todo title"
                            maxLength={100}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter description (optional)"
                            maxLength={500}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Assign To *</Form.Label>
                        <Form.Select
                            name="assignedTo"
                            value={formData.assignedTo}
                            onChange={handleChange}
                            required
                        >
                            {members.map(member => (
                                <option key={member._id} value={member._id}>{member.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Priority *</Form.Label>
                        <Form.Select name="priority" value={formData.priority} onChange={handleChange}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Scheduled Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="scheduledTime"
                            value={formData.scheduledTime}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Show on calendar"
                            name="isCalendarEvent"
                            checked={formData.isCalendarEvent}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : todo ? 'Update' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default TodoForm;
