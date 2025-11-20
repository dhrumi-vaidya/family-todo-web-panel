import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Badge, Dropdown, ButtonGroup, Alert, Table } from 'react-bootstrap';
import { useFamily } from '../context/FamilyContext';
import { useAuth } from '../context/AuthContext';
import { familyService } from '../services/familyService';
import { invitationService } from '../services/invitationService';
import InviteMemberModal from '../components/InviteMemberModal';
import { toast } from 'react-toastify';
import './FamilyTree.css';
import { formatDate } from '../utils/dateUtils';

const FamilyTree = () => {
  const { family, members, fetchMembers } = useFamily();
  const { user } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [regularMembers, setRegularMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState([]);

  useEffect(() => {
    if (family) {
      fetchMembers();
    }
  }, [family]);

  useEffect(() => {
    if (members.length > 0) {
      const adminMember = members.find(m => m.role === 'admin');
      const others = members.filter(m => m.role !== 'admin');
      setAdmin(adminMember);
      setRegularMembers(others);
      const userIsAdmin = user?.id === adminMember?._id;
      setIsAdmin(userIsAdmin);

      if (userIsAdmin) {
        loadPendingInvitations();
      }
    }
  }, [members, user]);

  const loadPendingInvitations = async () => {
    try {
      const invitations = await invitationService.getPendingInvitations();
      setPendingInvitations(invitations);
    } catch (error) {
      console.error('Error loading pending invitations:', error);
    }
  };

  const handleApproveReject = async (invitationId, approved) => {
    try {
      await invitationService.reviewInvitation(invitationId, approved);
      toast.success(approved ? 'Member approved!' : 'Request rejected');
      loadPendingInvitations();
      if (approved) {
        fetchMembers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process request');
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await familyService.updateMemberRole(memberId, newRole);
      toast.success('Member role updated successfully!');
      fetchMembers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member from the family?')) {
      try {
        await familyService.removeMember(memberId);
        toast.success('Member removed successfully!');
        fetchMembers();
      } catch (error) {
        console.error('Error removing member:', error);
        toast.error(error.response?.data?.message || 'Failed to remove member');
      }
    }
  };

  if (!family) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          <h5>👨‍👩‍👧‍👦 No Family Yet</h5>
          <p>Create or join a family to view the family tree!</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🌳 Family Tree - {family.name}</h2>
        <Button variant="primary" onClick={() => setShowInviteModal(true)}>
          + Invite Member
        </Button>
      </div>

      {/* Pending Approvals (Admin Only) */}
      {isAdmin && pendingInvitations.length > 0 && (
        <Card className="mb-4 shadow-sm">
          <Card.Header style={{ backgroundColor: '#ffc107', color: '#000' }}>
            <h5 className="mb-0">⏳ Pending Approvals ({pendingInvitations.length})</h5>
          </Card.Header>
          <Card.Body>
            <Table responsive hover>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Invited By</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingInvitations.map(invitation => (
                  <tr key={invitation._id}>
                    <td><strong>{invitation.userId?.name}</strong></td>
                    <td>{invitation.userId?.email}</td>
                    <td>{invitation.invitedBy?.name}</td>
                    <td>{formatDate(invitation.createdAt)}</td>
                    <td>
                      <ButtonGroup size="sm">
                        <Button
                          variant="success"
                          onClick={() => handleApproveReject(invitation._id, true)}
                        >
                          ✅ Approve
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleApproveReject(invitation._id, false)}
                        >
                          ❌ Reject
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Family Tree Visualization */}
      <div className="family-tree-container">
        {/* Admin Node */}
        {admin && (
          <div className="tree-admin-section">
            <div className="tree-node admin-node">
              <div className="node-header">
                <Badge bg="danger" className="mb-2">
                  👑 Family Admin
                </Badge>
              </div>
              <div className="node-body">
                <h5>{admin.name}</h5>
                <p className="text-muted mb-1">{admin.email}</p>
                {admin.phone && <p className="text-muted mb-0">📞 {admin.phone}</p>}
                <Badge bg="info" className="mt-2">
                  Joined: {formatDate(admin.createdAt)}
                </Badge>
                {admin._id === user?.id && (
                  <Badge bg="success" className="ms-2 mt-2">You</Badge>
                )}
              </div>
            </div>

            {/* Vertical Line */}
            {regularMembers.length > 0 && <div className="tree-line-vertical"></div>}
          </div>
        )}

        {/* Members Nodes */}
        {regularMembers.length > 0 && (
          <div className="tree-members-section">
            <div className="tree-horizontal-line"></div>
            <div className="tree-members-grid">
              {regularMembers.map((member, index) => (
                <div key={member._id} className="tree-member-column">
                  <div className="tree-line-to-node"></div>
                  <div className="tree-node member-node">
                    <div className="node-header">
                      <Badge bg="secondary">Member</Badge>
                    </div>
                    <div className="node-body">
                      <h6>{member.name}</h6>
                      <p className="small text-muted mb-1">{member.email}</p>
                      {member.phone && (
                        <p className="small text-muted mb-0">📞 {member.phone}</p>
                      )}
                      <Badge bg="info" className="mt-2 small">
                        {formatDate(member.createdAt)}
                      </Badge>
                      {member._id === user?.id && (
                        <Badge bg="success" className="ms-2 mt-2 small">You</Badge>
                      )}
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && member._id !== user?.id && (
                      <div className="node-actions mt-2">
                        <ButtonGroup size="sm" className="w-100">
                          <Dropdown as={ButtonGroup}>
                            <Dropdown.Toggle variant="outline-primary" size="sm">
                              ⚙️
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleRoleChange(member._id, 'admin')}>
                                👑 Make Admin
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                onClick={() => handleRemoveMember(member._id)}
                                className="text-danger"
                              >
                                🗑️ Remove Member
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </ButtonGroup>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Members Message */}
        {regularMembers.length === 0 && (
          <div className="text-center mt-4 p-4 bg-light rounded">
            <p className="text-muted mb-0">No other family members yet. Share the invite code to grow your family!</p>
          </div>
        )}
      </div>

      {/* Family Info Card */}
      <Card className="mt-4 shadow-sm">
        <Card.Header style={{ backgroundColor: '#0d6efd', color: 'white' }}>
          <h5 className="mb-0">Family Information</h5>
        </Card.Header>
        <Card.Body>
          <p><strong>Family Name:</strong> {family.name}</p>
          <p><strong>Total Members:</strong> {members.length}</p>
          <p><strong>Created:</strong> {formatDate(family.createdAt)}</p>
          {family.inviteCode && (
            <div className="mt-3 p-3 bg-light rounded">
              <strong>Invite Code:</strong>
              <code className="ms-2 p-2 bg-white rounded d-inline-block">{family.inviteCode}</code>
              <p className="small text-muted mt-2 mb-0">Share this code with family members to invite them</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FamilyTree;
