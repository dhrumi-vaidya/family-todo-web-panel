import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useFamily } from '../context/FamilyContext';
import { calendarService } from '../services/calendarService';

const EventModal = ({ show, handleClose, event, isPersonal, onSuccess }) => {
    const { members } = useFamily();
    const [formData, setFormData] = useState({
        title: event?.title || '',
        description: event?.description || '',
        startDateTime: event?.startDateTime
            ? new Date(event.startDateTime).toISOString().slice(0, 16)
            : '',
        endDateTime: event?.endDateTime
            ? new Date(event.endDateTime).toISOString().slice(0, 16)
            : '',
        location: event?.location || '',
        color: event?.color || '#3788d8',
        isPersonal: event?.isPersonal !== undefined ? event.isPersonal : isPersonal,
        attendees: event?.attendees?.map(a => a._id) || []
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked, options } = e.target;

        if (name === 'attendees') {
            const selected = Array.from(options)
                .filter(option => option.selected)
                .map(option => option.value);
            setFormData(prev => ({ ...prev, attendees: selected }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (event) {
                await calendarService.updateEvent(event._id, formData);
            } else {
                await calendarService.createEvent(formData);
            }

            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Failed to save event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{event ? 'Edit Event' : 'Create New Event'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Start Date & Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="startDateTime"
                            value={formData.startDateTime}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>End Date & Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="endDateTime"
                            value={formData.endDateTime}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Optional"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Color</Form.Label>
                        <Form.Control
                            type="color"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {!isPersonal && (
                        <Form.Group className="mb-3">
                            <Form.Label>Attendees</Form.Label>
                            <Form.Select
                                multiple
                                name="attendees"
                                value={formData.attendees}
                                onChange={handleChange}
                            >
                                {members.map(member => (
                                    <option key={member._id} value={member._id}>{member.name}</option>
                                ))}
                            </Form.Select>
                            <Form.Text className="text-muted">
                                Hold Ctrl/Cmd to select multiple
                            </Form.Text>
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Personal event (only visible to me)"
                            name="isPersonal"
                            checked={formData.isPersonal}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : event ? 'Update' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EventModal;
