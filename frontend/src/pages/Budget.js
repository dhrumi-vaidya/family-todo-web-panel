import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form, ProgressBar, Badge } from 'react-bootstrap';
import { budgetService } from '../services/budgetService';
import { toast } from 'react-toastify';

const Budget = () => {
    const [budget, setBudget] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [formData, setFormData] = useState({
        totalBudget: '',
        categories: [
            { name: 'Utilities', allocated: '', spent: 0 },
            { name: 'Groceries', allocated: '', spent: 0 },
            { name: 'Rent', allocated: '', spent: 0 },
            { name: 'Entertainment', allocated: '', spent: 0 },
            { name: 'Transportation', allocated: '', spent: 0 },
            { name: 'Other', allocated: '', spent: 0 }
        ]
    });

    useEffect(() => {
        loadCurrentBudget();
    }, []);

    const loadCurrentBudget = async () => {
        try {
            setLoading(true);
            const data = await budgetService.getCurrentBudget();
            if (data) {
                setBudget(data);
                setFormData({
                    totalBudget: data.totalBudget,
                    categories: data.categories
                });
            }
        } catch (error) {
            if (error.response?.status !== 404 && error.response?.status !== 400) {
                console.error('Error loading budget:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            setFormData({
                ...formData,
                categories: [...formData.categories, { name: newCategoryName, allocated: '', spent: 0 }]
            });
            setNewCategoryName('');
        }
    };

    const handleRemoveCategory = (index) => {
        const newCategories = formData.categories.filter((_, i) => i !== index);
        setFormData({ ...formData, categories: newCategories });
    };

    const handleSaveBudget = async () => {
        try {
            const now = new Date();
            const data = {
                month: now.getMonth() + 1,
                year: now.getFullYear(),
                totalBudget: parseFloat(formData.totalBudget),
                categories: formData.categories.map(cat => ({
                    ...cat,
                    allocated: parseFloat(cat.allocated) || 0
                }))
            };

            await budgetService.setBudget(data);
            toast.success('Budget saved successfully!');
            setEditing(false);
            loadCurrentBudget();
        } catch (error) {
            console.error('Error saving budget:', error);
            toast.error('Failed to save budget');
        }
    };

    const handleCategoryChange = (index, field, value) => {
        const newCategories = [...formData.categories];
        newCategories[index][field] = value;
        setFormData({ ...formData, categories: newCategories });
    };

    const getTotalAllocated = () => {
        return formData.categories.reduce((sum, cat) => sum + (parseFloat(cat.allocated) || 0), 0);
    };

    const getTotalSpent = () => {
        if (!budget) return 0;
        return budget.categories.reduce((sum, cat) => sum + cat.spent, 0);
    };

    const getPercentage = (allocated, spent) => {
        if (!allocated) return 0;
        return Math.min((spent / allocated) * 100, 100);
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 90) return 'danger';
        if (percentage >= 70) return 'warning';
        return 'success';
    };

    const getCurrentMonth = () => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return months[new Date().getMonth()];
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <div className="loading-spinner"></div>
                <p>Loading budget...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📊 Family Budget - {getCurrentMonth()} {new Date().getFullYear()}</h2>
                {!editing ? (
                    <Button variant="primary" onClick={() => setEditing(true)}>
                        {budget ? 'Edit Budget' : 'Set Budget'}
                    </Button>
                ) : (
                    <div>
                        <Button variant="secondary" className="me-2" onClick={() => setEditing(false)}>
                            Cancel
                        </Button>
                        <Button variant="success" onClick={handleSaveBudget}>
                            Save Budget
                        </Button>
                    </div>
                )}
            </div>

            {/* Budget Overview */}
      {budget && !editing && (
        <Row className="mb-4">
          <Col md={4}>
            <Card className="stat-card shadow-sm text-center">
              <Card.Body>
                <h3>₹{budget.totalBudget.toFixed(2)}</h3>
                <p className="mb-0 text-muted">Total Budget</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card shadow-sm text-center">
              <Card.Body>
                <h3 style={{ color: '#dc3545' }}>₹{getTotalSpent().toFixed(2)}</h3>
                <p className="mb-0 text-muted">Total Spent</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card shadow-sm text-center">
              <Card.Body>
                <h3 style={{ color: '#28a745' }}>₹{(budget.totalBudget - getTotalSpent()).toFixed(2)}</h3>
                <p className="mb-0 text-muted">Remaining</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Budget Form or Display */}
      {editing ? (
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Form.Group className="mb-4">
              <Form.Label><strong>Total Monthly Budget (₹)</strong></Form.Label>
              <Form.Control
                type="number"
                value={formData.totalBudget}
                onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                placeholder="Enter total budget in INR"
                step="0.01"
              />
              <Form.Text className="text-muted">
                Total Allocated: ₹{getTotalAllocated().toFixed(2)} 
                {getTotalAllocated() > parseFloat(formData.totalBudget) && (
                  <span className="text-danger"> (Exceeds budget!)</span>
                )}
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Category Allocation</h5>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  style={{ width: '200px' }}
                />
                <Button variant="success" size="sm" onClick={handleAddCategory}>
                  + Add Category
                </Button>
              </div>
            </div>
            <Row>
              {formData.categories.map((category, index) => (
                <Col md={6} key={index} className="mb-3">
                  <Form.Group>
                    <div className="d-flex justify-content-between align-items-center">
                      <Form.Label>{category.name}</Form.Label>
                      {index >= 6 && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleRemoveCategory(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <Form.Control
                      type="number"
                      value={category.allocated}
                      onChange={(e) => handleCategoryChange(index, 'allocated', e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      ) : budget ? (
        <Row>
          {budget.categories.map((category, index) => {
            const percentage = getPercentage(category.allocated, category.spent);
            return (
              <Col md={6} key={index} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">{category.name}</h5>
                      <div className="text-end">
                        <div><strong>₹{category.spent.toFixed(2)}</strong> / ₹{category.allocated.toFixed(2)}</div>
                        <Badge bg={getProgressColor(percentage)}>
                          {percentage.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    <ProgressBar 
                      now={percentage} 
                      variant={getProgressColor(percentage)}
                      style={{ height: '20px' }}
                    />
                    <div className="mt-2 small text-muted">
                      Remaining: ₹{(category.allocated - category.spent).toFixed(2)}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
            ) : (
                <Card className="shadow-sm text-center py-5">
                    <Card.Body>
                        <h4 className="text-muted">No Budget Set</h4>
                        <p className="text-muted">Click "Set Budget" to create your monthly budget</p>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default Budget;
