import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useFamily } from '../context/FamilyContext';
import { profileService } from '../services/profileService';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/dateUtils';
import { onlyLetters, onlyPhoneChars, sanitizeName, sanitizePhone } from '../utils/validationUtils';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { family, members, fetchMembers } = useFamily();
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
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadProfile();
        if (user?.familyId) {
            fetchMembers();
        }
    }, [user?.familyId]);

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
            setIsEditing(false);
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

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="profile-page">
            <Container className="mt-4 mb-5">
                <div className="profile-header mb-4">
                    <h2>Profile</h2>
                    <p className="text-muted">Manage your personal information and family role.</p>
                </div>

                {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

                <Row>
                    {/* Left Column - Profile Card */}
                    <Col lg={5} className="mb-4">
                        <Card className="profile-main-card">
                            <Card.Body className="text-center">
                                <div className="profile-avatar-wrapper">
                                    <div className="profile-avatar">
                                        {getInitials(profile.name)}
                                    </div>
                                </div>
                                <h3 className="profile-name mt-3">{profile.name || 'User Name'}</h3>
                                <Badge bg="secondary" className="profile-badge mb-3">
                                    {profile.role === 'admin' ? '👑 Family Head' : '🏠 Family Member'}
                                </Badge>

                                {/* Quick Stats */}
                                <div className="social-media-section mt-4">
                                    <h6 className="section-title">Family Overview</h6>
                                    <div className="d-flex justify-content-around mt-3">
                                        <div className="stat-item text-center">
                                            <div className="h4 mb-0">{members?.length || 0}</div>
                                            <small className="text-muted">Members</small>
                                        </div>
                                        <div className="stat-item text-center">
                                            <div className="h4 mb-0">Active</div>
                                            <small className="text-muted">Status</small>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Right Column - Bio & Details */}
                    <Col lg={7} className="mb-4">
                        <Card className="profile-details-card">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="section-title mb-0">Account & Family Details</h5>
                                    <div className="availability-badge">
                                        <i className="bi bi-circle-fill text-success me-2"></i>
                                        Online
                                    </div>
                                </div>

                                <Form onSubmit={handleProfileUpdate}>
                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <div className="profile-detail-item">
                                                <label className="detail-label">System Role</label>
                                                <div className="detail-value">
                                                    {profile.role === 'admin' ? 'Administrator' : 'Member'}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <div className="profile-detail-item">
                                                <label className="detail-label">Family Position</label>
                                                <div className="detail-value">
                                                    {profile.role === 'admin' ? 'Head of Household' : 'Family Member'}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="detail-label">Full Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({ ...profile, name: sanitizeName(e.target.value) })}
                                                    onKeyPress={onlyLetters}
                                                    placeholder="Enter your full name"
                                                    maxLength={50}
                                                    disabled={!isEditing}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="detail-label">Email Address</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    value={profile.email}
                                                    disabled
                                                    readOnly
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="detail-label">Phone Number</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    value={profile.phone}
                                                    onChange={(e) => setProfile({ ...profile, phone: sanitizePhone(e.target.value) })}
                                                    onKeyPress={onlyPhoneChars}
                                                    placeholder="+91 XXXXXXXXXX"
                                                    maxLength={15}
                                                    disabled={!isEditing}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <div className="profile-detail-item">
                                                <label className="detail-label">Family Group</label>
                                                <div className="detail-value">{family?.name || 'No Family Joined'}</div>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={12} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="detail-label">Personal Note / Bio</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={profile.bio}
                                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                                    placeholder="Add a note about your role in the family..."
                                                    disabled={!isEditing}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <div className="profile-detail-item">
                                                <label className="detail-label">Member Since</label>
                                                <div className="detail-value">
                                                    {formatDate(user?.createdAt)}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <div className="profile-detail-item">
                                                <label className="detail-label">Responsibilities</label>
                                                <div className="detail-value">
                                                    <span className="tag-item">#Chores</span>
                                                    <span className="tag-item">#Bills</span>
                                                    <span className="tag-item">#Groceries</span>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className="mt-4">
                                        {!isEditing ? (
                                            <Button variant="primary" onClick={() => setIsEditing(true)}>
                                                Edit Profile
                                            </Button>
                                        ) : (
                                            <>
                                                <Button variant="success" type="submit" disabled={loading} className="me-2">
                                                    {loading ? (
                                                        <>
                                                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        'Save Changes'
                                                    )}
                                                </Button>
                                                <Button variant="secondary" onClick={() => {
                                                    setIsEditing(false);
                                                    loadProfile();
                                                }}>
                                                    Cancel
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>

                        {/* Change Password Card */}
                        <Card className="profile-details-card mt-4">
                            <Card.Body>
                                <h5 className="section-title mb-3">🔒 Security Settings</h5>
                                <Form onSubmit={handlePasswordChange}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="detail-label">Current Password *</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={passwords.currentPassword}
                                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                            required
                                        />
                                    </Form.Group>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="detail-label">New Password *</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={passwords.newPassword}
                                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                    required
                                                    minLength={6}
                                                />
                                                <Form.Text className="text-muted">Minimum 6 characters</Form.Text>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="detail-label">Confirm New Password *</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={passwords.confirmPassword}
                                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Button variant="danger" type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                                Changing...
                                            </>
                                        ) : (
                                            'Update Password'
                                        )}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Profile;
