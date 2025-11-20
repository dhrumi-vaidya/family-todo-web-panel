import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useFamily } from '../context/FamilyContext';
import { billService } from '../services/billService';
import { toast } from 'react-toastify';
import { sanitizeNumber, onlyNumbers } from '../utils/validationUtils';

const BillForm = ({ show, handleClose, bill, onSuccess }) => {
    const { members } = useFamily();

    const getInitialFormData = () => ({
        title: '',
        description: '',
        amount: '',
        dueDate: '',
        category: 'utilities',
        isRecurring: false,
        recurringPeriod: 'monthly',
        assignedTo: ''
    });

    const [formData, setFormData] = useState(getInitialFormData());
    const [loading, setLoading] = useState(false);

    // Reset form when bill prop changes or modal opens/closes
    useEffect(() => {
        if (show) {
            if (bill) {
                // Edit mode - populate form with bill data
                setFormData({
                    title: bill.title || '',
                    description: bill.description || '',
                    amount: bill.amount || '',
                    dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : '',
                    category: bill.category || 'utilities',
                    isRecurring: bill.isRecurring || false,
                    recurringPeriod: bill.recurringPeriod || 'monthly',
                    assignedTo: bill.assignedTo?._id || ''
                });
            } else {
                // Create mode - reset to default
                setFormData(getInitialFormData());
            }
        }
    }, [show, bill]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let newValue = type === 'checkbox' ? checked : value;

        // Sanitize amount field - only allow numbers and decimal
        if (name === 'amount') {
            newValue = sanitizeNumber(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            toast.error('Bill title is required');
            return;
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            toast.error('Amount must be greater than 0');
            return;
        }

        if (!formData.dueDate) {
            toast.error('Due date is required');
            return;
        }

        setLoading(true);

        try {
            const data = {
                ...formData,
                amount: parseFloat(formData.amount)
            };

            if (bill) {
                await billService.updateBill(bill._id, data);
                toast.success('Bill updated successfully!');
            } else {
                await billService.createBill(data);
                toast.success('Bill created successfully!');
            }

            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Error saving bill:', error);
            toast.error(error.response?.data?.message || 'Failed to save bill');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{bill ? 'Edit Bill' : 'Add New Bill'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Bill Title *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Electricity Bill"
                                    maxLength={100}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Amount (₹) *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    onKeyPress={onlyNumbers}
                                    placeholder="0.00"
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Additional details about the bill"
                            maxLength={300}
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category *</Form.Label>
                                <Form.Select name="category" value={formData.category} onChange={handleChange}>
                                    <option value="utilities">⚡ Utilities</option>
                                    <option value="rent">🏠 Rent/Mortgage</option>
                                    <option value="groceries">🛒 Groceries</option>
                                    <option value="insurance">🛡️ Insurance</option>
                                    <option value="subscription">📺 Subscription</option>
                                    <option value="other">📄 Other</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Due Date *</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Assign To</Form.Label>
                        <Form.Select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                            <option value="">Select member (optional)</option>
                            {members.map(member => (
                                <option key={member._id} value={member._id}>{member.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Recurring Bill"
                            name="isRecurring"
                            checked={formData.isRecurring}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {formData.isRecurring && (
                        <Form.Group className="mb-3">
                            <Form.Label>Recurring Period</Form.Label>
                            <Form.Select name="recurringPeriod" value={formData.recurringPeriod} onChange={handleChange}>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </Form.Select>
                        </Form.Group>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                Saving...
                            </>
                        ) : (
                            bill ? 'Update Bill' : 'Add Bill'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default BillForm;
