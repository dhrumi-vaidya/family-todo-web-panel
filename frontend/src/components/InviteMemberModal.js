import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { invitationService } from '../services/invitationService';
import { toast } from 'react-toastify';

const InviteMemberModal = ({ show, handleClose, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [inviteLink, setInviteLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setInviteLink('');

        try {
            const result = await invitationService.sendInvitation(email);
            toast.success('Invitation sent successfully!');
            setInviteLink(result.inviteLink);
            setEmail('');

            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send invitation');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setEmail('');
        setInviteLink('');
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>📧 Invite Family Member</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Alert variant="info">
                        Send an email invitation to a new family member. They'll receive a link to create their account and join your family.
                    </Alert>

                    <Form.Group className="mb-3">
                        <Form.Label>Email Address *</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            required
                        />
                        <Form.Text className="text-muted">
                            The invite will be sent to this email address
                        </Form.Text>
                    </Form.Group>

                    {inviteLink && (
                        <Alert variant="success">
                            <strong>✅ Invitation sent!</strong>
                            <p className="small mb-0 mt-2">
                                Invitation link (for testing): <br />
                                <code className="small">{inviteLink}</code>
                            </p>
                            <p className="small text-muted mt-2 mb-0">
                                After they register, you'll need to approve their request.
                            </p>
                        </Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                Sending...
                            </>
                        ) : (
                            'Send Invitation'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default InviteMemberModal;
