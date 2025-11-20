import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Badge, ButtonGroup, Dropdown } from 'react-bootstrap';
import { billService } from '../services/billService';
import BillForm from '../components/BillForm';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/dateUtils';

const Bills = () => {
    const [bills, setBills] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBill, setEditingBill] = useState(null);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBills();
    }, []);

    useEffect(() => {
        filterBills();
    }, [bills, filter]);

    const loadBills = async () => {
        try {
            setLoading(true);
            const data = await billService.getBills();
            setBills(data);
        } catch (error) {
            if (error.response?.status !== 400) {
                console.error('Error loading bills:', error);
                toast.error('Failed to load bills');
            }
        } finally {
            setLoading(false);
        }
    };

    const filterBills = () => {
        if (filter === 'all') {
            setFilteredBills(bills);
        } else if (filter === 'paid') {
            setFilteredBills(bills.filter(b => b.isPaid));
        } else {
            setFilteredBills(bills.filter(b => !b.isPaid));
        }
    };

    const handleEdit = (bill) => {
        setEditingBill(bill);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingBill(null);
    };

    const handleMarkPaid = async (billId) => {
        try {
            await billService.markBillPaid(billId);
            toast.success('Bill marked as paid!');
            loadBills();
        } catch (error) {
            console.error('Error marking paid:', error);
            toast.error('Failed to update bill');
        }
    };

    const handleDelete = async (billId) => {
        if (window.confirm('Are you sure you want to delete this bill?')) {
            try {
                await billService.deleteBill(billId);
                toast.success('Bill deleted successfully!');
                loadBills();
            } catch (error) {
                console.error('Error deleting bill:', error);
                toast.error('Failed to delete bill');
            }
        }
    };

    const getTotalAmount = () => filteredBills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2);
    const getUnpaidAmount = () => filteredBills.filter(b => !b.isPaid).reduce((sum, bill) => sum + bill.amount, 0).toFixed(2);

    const getCategoryBadge = (category) => {
        const colors = {
            utilities: 'warning',
            rent: 'danger',
            groceries: 'success',
            insurance: 'info',
            subscription: 'primary',
            other: 'secondary'
        };
        return <Badge bg={colors[category] || 'secondary'}>{category}</Badge>;
    };

    const getPaymentStatus = (bill) => {
        if (bill.isPaid) {
            return { color: '#28a745', text: '✅ Paid' };
        }
        const dueDate = new Date(bill.dueDate);
        const today = new Date();
        if (dueDate < today) {
            return { color: '#dc3545', text: '⚠️ Overdue' };
        }
        return { color: '#fd7e14', text: '⏳ Unpaid' };
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <div className="loading-spinner"></div>
                <p>Loading bills...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4" fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>💰 Family Bills & Payments</h2>
                <Button variant="primary" onClick={() => setShowForm(true)}>
                    + Add Bill
                </Button>
            </div>

            {/* Summary Cards */}
            <Row className="mb-4">
                <Col md={4}>
                    <div className="stat-card shadow-sm text-center p-3 bg-white rounded">
                        <h3>₹{getTotalAmount()}</h3>
                        <p className="mb-0 text-muted">Total Bills</p>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stat-card shadow-sm text-center p-3 bg-white rounded">
                        <h3 style={{ color: '#dc3545' }}>₹{getUnpaidAmount()}</h3>
                        <p className="mb-0 text-muted">Unpaid</p>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stat-card shadow-sm text-center p-3 bg-white rounded">
                        <h3 style={{ color: '#28a745' }}>{bills.filter(b => b.isPaid).length}</h3>
                        <p className="mb-0 text-muted">Paid Bills</p>
                    </div>
                </Col>
            </Row>

            {/* Filter Badges */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex gap-2">
                        <Badge
                            bg={filter === 'all' ? 'primary' : 'secondary'}
                            style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}
                            onClick={() => setFilter('all')}
                        >
                            All ({bills.length})
                        </Badge>
                        <Badge
                            bg={filter === 'unpaid' ? 'danger' : 'secondary'}
                            style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}
                            onClick={() => setFilter('unpaid')}
                        >
                            Unpaid ({bills.filter(b => !b.isPaid).length})
                        </Badge>
                        <Badge
                            bg={filter === 'paid' ? 'success' : 'secondary'}
                            style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}
                            onClick={() => setFilter('paid')}
                        >
                            Paid ({bills.filter(b => b.isPaid).length})
                        </Badge>
                    </div>
                </Col>
            </Row>

            {/* Table View */}
            {filteredBills.length === 0 ? (
                <div className="text-center text-muted py-5">
                    <h4>No bills found</h4>
                    <p>Add your first bill to track family expenses!</p>
                </div>
            ) : (
                <Table responsive hover className="bg-white shadow-sm">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                            <th>Bill Name</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBills.map(bill => {
                            const paymentStatus = getPaymentStatus(bill);
                            return (
                                <tr key={bill._id}>
                                    <td>
                                        <strong>{bill.title}</strong>
                                        {bill.description && <><br /><small className="text-muted">{bill.description}</small></>}
                                    </td>
                                    <td>{getCategoryBadge(bill.category)}</td>
                                    <td><strong>₹{bill.amount.toFixed(2)}</strong></td>
                                    <td>{formatDate(bill.dueDate)}</td>
                                    <td>{bill.assignedTo?.name || 'Unassigned'}</td>
                                    <td>
                                        {!bill.isPaid ? (
                                            <Dropdown>
                                                <Dropdown.Toggle
                                                    style={{
                                                        backgroundColor: paymentStatus.color,
                                                        border: 'none',
                                                        borderRadius: '20px',
                                                        padding: '0.4rem 1rem',
                                                        fontSize: '0.85rem'
                                                    }}
                                                    size="sm"
                                                >
                                                    {paymentStatus.text}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleMarkPaid(bill._id)}>
                                                        ✅ Mark as Paid
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        ) : (
                                            <Badge
                                                bg="success"
                                                style={{ borderRadius: '20px', padding: '0.4rem 1rem' }}
                                            >
                                                {paymentStatus.text}
                                            </Badge>
                                        )}
                                    </td>
                                    <td>
                                        <ButtonGroup size="sm">
                                            <Button variant="outline-primary" onClick={() => handleEdit(bill)} title="Edit">
                                                ✏️
                                            </Button>
                                            <Button variant="outline-danger" onClick={() => handleDelete(bill._id)} title="Delete">
                                                🗑️
                                            </Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}

            <BillForm
                show={showForm}
                handleClose={handleCloseForm}
                bill={editingBill}
                onSuccess={loadBills}
            />
        </Container>
    );
};

export default Bills;
