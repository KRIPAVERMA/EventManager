import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

const categories = ['concert', 'conference', 'workshop', 'sports', 'theater', 'festival', 'meetup', 'other'];

const emptyTicket = { name: '', price: '', quantity: '', available: '', description: '' };

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'concert', date: '', startTime: '', endTime: '',
    venue: { name: '', address: '', city: '', state: '', country: 'USA' },
    totalTickets: '', status: 'published', isFeatured: false, tags: '',
  });
  const [ticketTypes, setTicketTypes] = useState([{ ...emptyTicket }]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('venue.')) {
      const venueField = name.split('.')[1];
      setForm((prev) => ({ ...prev, venue: { ...prev.venue, [venueField]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleTicketChange = (index, field, value) => {
    setTicketTypes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'quantity') updated[index].available = value;
      return updated;
    });
  };

  const addTicket = () => setTicketTypes((prev) => [...prev, { ...emptyTicket }]);
  const removeTicket = (index) => setTicketTypes((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const tickets = ticketTypes.map((t) => ({
        name: t.name,
        price: parseFloat(t.price),
        quantity: parseInt(t.quantity),
        available: parseInt(t.available || t.quantity),
        description: t.description,
      }));

      const totalTickets = parseInt(form.totalTickets) || tickets.reduce((s, t) => s + t.quantity, 0);
      const availableTickets = tickets.reduce((s, t) => s + t.available, 0);
      const tags = form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

      const payload = {
        ...form,
        totalTickets,
        availableTickets,
        ticketTypes: tickets,
        tags,
      };

      const { data } = await API.post('/events', payload);
      if (data.success) {
        toast.success('Event created!');
        navigate('/admin/events');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to create event';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-create-event">
      <button className="btn btn-ghost back-btn" onClick={() => navigate('/admin/events')}>
        <HiOutlineArrowLeft /> Back to Events
      </button>

      <div className="admin-page-header">
        <h1>Create New Event</h1>
      </div>

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid-2">
            <div className="form-group full-width">
              <label>Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required maxLength={100} placeholder="Event title" />
            </div>
            <div className="form-group full-width">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required maxLength={2000} rows={4} placeholder="Describe your event..." />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Start Time *</label>
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>End Time *</label>
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Venue</h3>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Venue Name *</label>
              <input type="text" name="venue.name" value={form.venue.name} onChange={handleChange} required placeholder="e.g. Madison Square Garden" />
            </div>
            <div className="form-group">
              <label>Address *</label>
              <input type="text" name="venue.address" value={form.venue.address} onChange={handleChange} required placeholder="123 Main St" />
            </div>
            <div className="form-group">
              <label>City *</label>
              <input type="text" name="venue.city" value={form.venue.city} onChange={handleChange} required placeholder="New York" />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" name="venue.state" value={form.venue.state} onChange={handleChange} placeholder="NY" />
            </div>
            <div className="form-group">
              <label>Country *</label>
              <input type="text" name="venue.country" value={form.venue.country} onChange={handleChange} required placeholder="USA" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Ticket Types</h3>
          {ticketTypes.map((ticket, i) => (
            <div key={i} className="ticket-type-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Ticket Name *</label>
                  <input type="text" value={ticket.name} onChange={(e) => handleTicketChange(i, 'name', e.target.value)} required placeholder="e.g. General Admission" />
                </div>
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input type="number" min="0" step="0.01" value={ticket.price} onChange={(e) => handleTicketChange(i, 'price', e.target.value)} required placeholder="49.99" />
                </div>
                <div className="form-group">
                  <label>Quantity *</label>
                  <input type="number" min="1" value={ticket.quantity} onChange={(e) => handleTicketChange(i, 'quantity', e.target.value)} required placeholder="100" />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input type="text" value={ticket.description} onChange={(e) => handleTicketChange(i, 'description', e.target.value)} placeholder="Brief description" />
                </div>
              </div>
              {ticketTypes.length > 1 && (
                <button type="button" className="btn btn-ghost btn-sm danger" onClick={() => removeTicket(i)}>
                  <HiOutlineTrash /> Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={addTicket}>
            <HiOutlinePlus /> Add Ticket Type
          </button>
        </div>

        <div className="form-section">
          <h3>Settings</h3>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Total Tickets</label>
              <input type="number" name="totalTickets" value={form.totalTickets} onChange={handleChange} placeholder="Auto-calculated from ticket types" min="1" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="music, live, summer" />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                Featured Event
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/events')}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;
