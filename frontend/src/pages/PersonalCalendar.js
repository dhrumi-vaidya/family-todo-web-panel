import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { calendarService } from '../services/calendarService';
import { todoService } from '../services/todoService';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import EventModal from '../components/EventModal';

const PersonalCalendar = () => {
    const { user } = useAuth();
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [todos, setTodos] = useState([]);
    const [selectedDateEvents, setSelectedDateEvents] = useState([]);
    const [showEventModal, setShowEventModal] = useState(false);

    useEffect(() => {
        loadEvents();
        loadTodos();
    }, [date]);

    useEffect(() => {
        filterEventsForDate(date);
    }, [events, todos, date]);

    const loadEvents = async () => {
        try {
            const data = await calendarService.getPersonalEvents();
            setEvents(data);
        } catch (error) {
            if (error.response?.status !== 400) {
                console.error('Error loading events:', error);
            }
        }
    };

    const loadTodos = async () => {
        try {
            const data = await todoService.getTodos({ assignedTo: user.id });
            const calendarTodos = data.filter(t => t.isCalendarEvent && t.scheduledTime);
            setTodos(calendarTodos);
        } catch (error) {
            if (error.response?.status !== 400) {
                console.error('Error loading todos:', error);
            }
        }
    };

    const filterEventsForDate = (selectedDate) => {
        const dateStr = selectedDate.toDateString();

        const dayEvents = events.filter(event => {
            const eventDate = new Date(event.startDateTime).toDateString();
            return eventDate === dateStr;
        });

        const dayTodos = todos.filter(todo => {
            const todoDate = new Date(todo.scheduledTime).toDateString();
            return todoDate === dateStr;
        });

        setSelectedDateEvents([...dayEvents, ...dayTodos]);
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = date.toDateString();
            const hasEvents = events.some(e => new Date(e.startDateTime).toDateString() === dateStr);
            const hasTodos = todos.some(t => new Date(t.scheduledTime).toDateString() === dateStr);

            if (hasEvents || hasTodos) {
                return <div className="calendar-dot"></div>;
            }
        }
        return null;
    };

    const handleDateClick = (value) => {
        setDate(value);
        filterEventsForDate(value);
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Personal Calendar</h2>
                <Button variant="primary" onClick={() => setShowEventModal(true)}>
                    + New Event
                </Button>
            </div>

            <Row>
                <Col md={8}>
                    <div className="calendar-container shadow-sm p-3 bg-white rounded">
                        <Calendar
                            onChange={handleDateClick}
                            value={date}
                            tileContent={tileContent}
                        />
                    </div>
                </Col>

                <Col md={4}>
                    <div className="shadow-sm p-3 bg-white rounded">
                        <h5 className="mb-3">
                            My Events on {date.toLocaleDateString()}
                        </h5>
                        {selectedDateEvents.length === 0 ? (
                            <p className="text-muted">No events scheduled for this day</p>
                        ) : (
                            selectedDateEvents.map((item, index) => (
                                <div key={index} className="mb-3 pb-2 border-bottom">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <strong>{item.title}</strong>
                                            <div className="small text-muted">
                                                {item.startDateTime
                                                    ? new Date(item.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                    : new Date(item.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                }
                                            </div>
                                            {item.description && (
                                                <div className="small">{item.description}</div>
                                            )}
                                            {item.location && (
                                                <div className="small text-muted">📍 {item.location}</div>
                                            )}
                                        </div>
                                        <Badge bg={item.scheduledTime ? 'info' : item.isPersonal ? 'success' : 'primary'}>
                                            {item.scheduledTime ? 'Task' : item.isPersonal ? 'Personal' : 'Family'}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Col>
            </Row>

            <EventModal
                show={showEventModal}
                handleClose={() => setShowEventModal(false)}
                isPersonal={true}
                onSuccess={() => {
                    loadEvents();
                    setShowEventModal(false);
                }}
            />
        </Container>
    );
};

export default PersonalCalendar;
