import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
            toast.success('Login successful! Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: '16px' }}>
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h2 className="mb-2" style={{ fontWeight: '700' }}>Family Todo Panel</h2>
                                <p className="text-muted mb-0">Sign in to your account</p>
                            </div>

                            {error && <Alert variant="danger" style={{ borderRadius: '8px' }}>{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
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
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ borderRadius: '8px', padding: '0.75rem' }}
                                        required
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
                                    {loading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Logging in...
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                </Button>
                            </Form>

                            <div className="text-center pt-3" style={{ borderTop: '1px solid #e9ecef' }}>
                                <p className="mb-0 text-muted">
                                    Don't have an account? <Link to="/register" style={{ fontWeight: '600' }}>Register here</Link>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
