import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { invitationService } from '../services/invitationService';
import { toast } from 'react-toastify';

const AcceptInvitation = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [invitation, setInvitation] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        confirmPassword: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadInvitation();
    }, [token]);

    const loadInvitation = async () => {
        try {
            setLoading(true);
            const data = await invitationService.getInvitation(token);
            setInvitation(data);
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid or expired invitation');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setSubmitting(true);

        try {
            const result = await invitationService.acceptInvitation(
                token,
                formData.name,
                formData.password
            );

            toast.success(result.message);

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to accept invitation');
            toast.error(error.response?.data?.message || 'Failed to accept invitation');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" />
                <p className="mt-3">Loading invitation...</p>
            </Container>
        );
    }

    if (error && !invitation) {
        return (
            <Container className="mt-5">
                <Card className="shadow-sm">
                    <Card.Body className="text-center py-5">
                        <h3 className="text-danger">❌ {error}</h3>
                        <p className="text-muted">This invitation link may have expired or is invalid.</p>
                        <Button variant="primary" onClick={() => navigate('/register')}>
                            Go to Register
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="mt-5" style={{ maxWidth: '500px' }}>
            <Card className="shadow-sm">
                <Card.Header style={{ backgroundColor: '#0d6efd', color: 'white' }}>
                    <h4 className="mb-0">🎉 Accept Family Invitation</h4>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Alert variant="info">
                        <strong>{invitation?.invitedBy}</strong> has invited you to join <strong>{invitation?.familyName}</strong>!
                    </Alert>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={invitation?.email || ''}
                                disabled
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Your Name *</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter your name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password *</Form.Label>
                            <Form.Control
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Create a password"
                                minLength={6}
                                required
                            />
                            <Form.Text className="text-muted">Minimum 6 characters</Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password *</Form.Label>
                            <Form.Control
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="Confirm password"
                                required
                            />
                        </Form.Group>

                        <Alert variant="warning" className="small">
                            <strong>Note:</strong> After registration, your request will be sent to the family admin for approval.
                        </Alert>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                    Creating Account...
                                </>
                            ) : (
                                'Accept Invitation & Create Account'
                            )}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AcceptInvitation;
