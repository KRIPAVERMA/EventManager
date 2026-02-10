import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash,
  HiOutlineEye, HiOutlineCalendar, HiOutlineTicket,
} from 'react-icons/hi';

const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await API.get('/events/admin/my-events');
      if (data.success) setEvents(data.data);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/events/${id}`);
      toast.success('Event deleted');
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="page-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="admin-manage-events">
      <div className="admin-page-header">
        <div>
          <h1>Manage Events</h1>
          <p>{events.length} events</p>
        </div>
        <Link to="/admin/events/create" className="btn btn-primary">
          <HiOutlinePlus /> Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <HiOutlineCalendar size={48} />
          <h3>No events yet</h3>
          <p>Create your first event to get started.</p>
          <Link to="/admin/events/create" className="btn btn-primary">Create Event</Link>
        </div>
      ) : (
        <div className="admin-table">
          <div className="admin-table-header">
            <span>Event</span>
            <span>Date</span>
            <span>Status</span>
            <span>Tickets</span>
            <span>Actions</span>
          </div>
          {events.map((event) => (
            <div key={event._id} className="admin-table-row">
              <div className="table-cell-event">
                <h4>{event.title}</h4>
                <span className="text-sm text-muted">{event.category} &middot; {event.venue?.city}</span>
              </div>
              <div className="table-cell">
                <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                <span className="text-sm text-muted">{event.startTime}</span>
              </div>
              <div className="table-cell">
                <span className={`status-badge small ${event.status}`}>{event.status}</span>
                {event.isFeatured && <span className="badge featured">Featured</span>}
              </div>
              <div className="table-cell">
                <span>{event.availableTickets} / {event.totalTickets}</span>
              </div>
              <div className="table-cell actions">
                <Link to={`/events/${event._id}`} className="btn-icon" title="View">
                  <HiOutlineEye />
                </Link>
                <Link to={`/admin/events/${event._id}/edit`} className="btn-icon" title="Edit">
                  <HiOutlinePencil />
                </Link>
                <Link to={`/admin/events/${event._id}/bookings`} className="btn-icon" title="View Bookings">
                  <HiOutlineTicket />
                </Link>
                <button className="btn-icon danger" title="Delete" onClick={() => handleDelete(event._id, event.title)}>
                  <HiOutlineTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEventsPage;
