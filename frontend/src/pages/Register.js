import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useFamily } from '../context/FamilyContext';
import { toast } from 'react-toastify';
import { onlyLetters, sanitizeName } from '../utils/validationUtils';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showFamilyModal, setShowFamilyModal] = useState(false);
    const [familyName, setFamilyName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const { register } = useAuth();
    const { createFamily, joinFamily } = useFamily();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register({ name, email, password });
            toast.success('Account created successfully!');
            setShowFamilyModal(true);
            setLoading(false);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMsg);
            toast.error(errorMsg);
            setLoading(false);
        }
    };

    const handleCreateFamily = async () => {
        try {
            setLoading(true);
            await createFamily({ name: familyName });
            toast.success(`Family "${familyName}" created successfully!`);
            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to create family';
            setError(errorMsg);
            toast.error(errorMsg);
            setLoading(false);
        }
    };

    const handleJoinFamily = async () => {
        try {
            setLoading(true);
            await joinFamily(inviteCode);
            toast.success('Successfully joined family!');
            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to join family';
            setError(errorMsg);
            toast.error(errorMsg);
            setLoading(false);
        }
    };

    const skipFamilySetup = () => {
        navigate('/dashboard');
    };

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: '16px' }}>
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h2 className="mb-2" style={{ fontWeight: '700' }}>Create Account</h2>
                                <p className="text-muted mb-0">Join the Family Todo Panel</p>
                            </div>

                            {error && <Alert variant="danger" style={{ borderRadius: '8px' }}>{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold" style={{ fontSize: '0.9rem' }}>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(sanitizeName(e.target.value))}
                                        onKeyPress={onlyLetters}
                                        style={{ borderRadius: '8px', padding: '0.75rem' }}
                                        maxLength={50}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold" style={{ fontSize: '0.9rem' }}>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ borderRadius: '8px', padding: '0.75rem' }}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold" style={{ fontSize: '0.9rem' }}>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Minimum 6 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ borderRadius: '8px', padding: '0.75rem' }}
                                        required
                                        minLength={6}
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 mb-3"
                                    style={{
                                        padding: '0.75rem',
                                        fontWeight: '600',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? 'Creating Account...' : 'Register'}
                                </Button>
                            </Form>

                            <div className="text-center pt-3" style={{ borderTop: '1px solid #e9ecef' }}>
                                <p className="mb-0 text-muted">
                                    Already have an account? <Link to="/login" style={{ fontWeight: '600' }}>Login here</Link>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showFamilyModal} onHide={skipFamilySetup} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Family Setup</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <p className="mb-4 text-muted">Would you like to create a new family or join an existing one?</p>

                    <div className="mb-4 p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                        <h6 className="mb-3 fw-bold">Create New Family</h6>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Enter family name"
                                value={familyName}
                                onChange={(e) => setFamilyName(e.target.value)}
                                style={{ borderRadius: '8px', padding: '0.75rem' }}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            className="w-100"
                            style={{ padding: '0.75rem', fontWeight: '600', borderRadius: '8px' }}
                            onClick={handleCreateFamily}
                            disabled={!familyName || loading}
                        >
                            Create Family
                        </Button>
                    </div>

                    <div className=" p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                        <h6 className="mb-3 fw-bold">Join Existing Family</h6>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Enter invite code"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                style={{ borderRadius: '8px', padding: '0.75rem' }}
                            />
                        </Form.Group>
                        <Button
                            variant="success"
                            className="w-100"
                            style={{ padding: '0.75rem', fontWeight: '600', borderRadius: '8px' }}
                            onClick={handleJoinFamily}
                            disabled={!inviteCode || loading}
                        >
                            Join Family
                        </Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={skipFamilySetup}
                        style={{ borderRadius: '8px', padding: '0.5rem 1.5rem', fontWeight: '500' }}
                    >
                        Skip for Now
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Register;
