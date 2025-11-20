import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/dateUtils';
import { onlyLetters, onlyPhoneChars, sanitizeName, sanitizePhone } from '../utils/validationUtils';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        role: ''
    });
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await profileService.getProfile();
            setProfile({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                bio: data.bio || '',
                role: data.role || 'member'
            });
        } catch (error) {
            console.error('Error loading profile:', error);
            toast.error('Failed to load profile');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const updated = await profileService.updateProfile({
                name: profile.name,
                phone: profile.phone,
                bio: profile.bio
            });

            updateUser(updated);
            toast.success('Profile updated successfully!');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to update profile';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('New passwords do not match');
            toast.error('Passwords do not match');
            return;
        }

        if (passwords.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await profileService.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });

            toast.success('Password changed successfully!');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to change password';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">👤 My Profile</h2>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

            <Row>
                {/* Profile Information */}
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm">
                        <Card.Header style={{ backgroundColor: '#0d6efd', color: 'white' }}>
                            <h5 className="mb-0">Profile Information</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleProfileUpdate}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: sanitizeName(e.target.value) })}
                                        onKeyPress={onlyLetters}
                                        placeholder="Enter your full name"
                                        maxLength={50}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        readOnly
                                    />
                                    <Form.Text className="text-muted">Email cannot be changed</Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: sanitizePhone(e.target.value) })}
                                        onKeyPress={onlyPhoneChars}
                                        placeholder="+91 XXXXXXXXXX"
                                        maxLength={15}
                                    />
                                    <Form.Text className="text-muted">Indian format: +91 XXXXXXXXXX</Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Bio</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        placeholder="Tell us about yourself..."
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={profile.role === 'admin' ? '👑 Admin' : 'Member'}
                                        disabled
                                        readOnly
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                                    {loading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Profile'
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Change Password */}
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm">
                        <Card.Header style={{ backgroundColor: '#dc3545', color: 'white' }}>
                            <h5 className="mb-0">🔒 Change Password</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handlePasswordChange}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Current Password *</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>New Password *</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                    <Form.Text className="text-muted">Minimum 6 characters</Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm New Password *</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="danger" type="submit" disabled={loading} className="w-100">
                                    {loading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                                            Changing...
                                        </>
                                    ) : (
                                        'Change Password'
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Account Info */}
                    <Card className="shadow-sm mt-4">
                        <Card.Header style={{ backgroundColor: '#6c757d', color: 'white' }}>
                            <h5 className="mb-0">ℹ️ Account Information</h5>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Account Created:</strong> {formatDate(user?.createdAt)}</p>
                            <p className="mb-0"><strong>User ID:</strong> <code>{user?.id}</code></p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
