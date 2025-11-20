import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useFamily } from '../context/FamilyContext';

const FamilySetup = () => {
    const [familyName, setFamilyName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { createFamily, joinFamily } = useFamily();
    const navigate = useNavigate();

    const handleCreateFamily = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await createFamily({ name: familyName });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create family');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinFamily = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await joinFamily(inviteCode);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join family');
        } finally {
            setLoading(false);
        }
    };

    const skipSetup = () => {
        navigate('/dashboard');
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <h2 className="text-center mb-4">Family Setup</h2>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Card className="mb-4 shadow">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">Create New Family</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleCreateFamily}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Family Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter family name"
                                        value={familyName}
                                        onChange={(e) => setFamilyName(e.target.value)}
                                    />
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100"
                                    disabled={!familyName || loading}
                                >
                                    {loading ? 'Creating...' : 'Create Family'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4 shadow">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">Join Existing Family</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleJoinFamily}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Invite Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter invite code"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                    />
                                    <Form.Text className="text-muted">
                                        Ask a family member for the invite code
                                    </Form.Text>
                                </Form.Group>
                                <Button
                                    variant="success"
                                    type="submit"
                                    className="w-100"
                                    disabled={!inviteCode || loading}
                                >
                                    {loading ? 'Joining...' : 'Join Family'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    <div className="text-center">
                        <Button variant="link" onClick={skipSetup}>
                            Skip for now
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default FamilySetup;
