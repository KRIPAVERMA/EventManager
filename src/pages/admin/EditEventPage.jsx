import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

const categories = ['concert', 'conference', 'workshop', 'sports', 'theater', 'festival', 'meetup', 'other'];

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await API.get(`/events/${id}`);
        if (data.success) {
          const e = data.data;
          setForm({
            title: e.title, description: e.description, category: e.category,
            date: e.date?.split('T')[0], startTime: e.startTime, endTime: e.endTime,
            venue: { name: e.venue?.name || '', address: e.venue?.address || '', city: e.venue?.city || '', state: e.venue?.state || '', country: e.venue?.country || '' },
            totalTickets: e.totalTickets, status: e.status, isFeatured: e.isFeatured,
            tags: e.tags?.join(', ') || '',
          });
          setTicketTypes(e.ticketTypes?.map((t) => ({
            name: t.name, price: t.price, quantity: t.quantity,
            available: t.available, description: t.description || '',
          })) || []);
        }
      } catch {
        toast.error('Event not found');
        navigate('/admin/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('venue.')) {
      const field = name.split('.')[1];
      setForm((prev) => ({ ...prev, venue: { ...prev.venue, [field]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleTicketChange = (index, field, value) => {
    setTicketTypes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addTicket = () => setTicketTypes((prev) => [...prev, { name: '', price: '', quantity: '', available: '', description: '' }]);
  const removeTicket = (index) => setTicketTypes((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const tickets = ticketTypes.map((t) => ({
        name: t.name, price: parseFloat(t.price), quantity: parseInt(t.quantity),
        available: parseInt(t.available), description: t.description,
      }));
      const totalTickets = tickets.reduce((s, t) => s + t.quantity, 0);
      const availableTickets = tickets.reduce((s, t) => s + t.available, 0);
      const tags = form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

      const payload = { ...form, totalTickets, availableTickets, ticketTypes: tickets, tags };

      const { data } = await API.put(`/events/${id}`, payload);
      if (data.success) {
        toast.success('Event updated!');
        navigate('/admin/events');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <div className="page-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="admin-create-event">
      <button className="btn btn-ghost back-btn" onClick={() => navigate('/admin/events')}>
        <HiOutlineArrowLeft /> Back to Events
      </button>
      <div className="admin-page-header">
        <h1>Edit Event</h1>
      </div>

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid-2">
            <div className="form-group full-width">
              <label>Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required maxLength={100} />
            </div>
            <div className="form-group full-width">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required maxLength={2000} rows={4} />
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
            <div className="form-group"><label>Venue Name *</label><input type="text" name="venue.name" value={form.venue.name} onChange={handleChange} required /></div>
            <div className="form-group"><label>Address *</label><input type="text" name="venue.address" value={form.venue.address} onChange={handleChange} required /></div>
            <div className="form-group"><label>City *</label><input type="text" name="venue.city" value={form.venue.city} onChange={handleChange} required /></div>
            <div className="form-group"><label>State</label><input type="text" name="venue.state" value={form.venue.state} onChange={handleChange} /></div>
            <div className="form-group"><label>Country *</label><input type="text" name="venue.country" value={form.venue.country} onChange={handleChange} required /></div>
          </div>
        </div>

        <div className="form-section">
          <h3>Ticket Types</h3>
          {ticketTypes.map((ticket, i) => (
            <div key={i} className="ticket-type-form">
              <div className="form-grid-2">
                <div className="form-group"><label>Name *</label><input type="text" value={ticket.name} onChange={(e) => handleTicketChange(i, 'name', e.target.value)} required /></div>
                <div className="form-group"><label>Price ($) *</label><input type="number" min="0" step="0.01" value={ticket.price} onChange={(e) => handleTicketChange(i, 'price', e.target.value)} required /></div>
                <div className="form-group"><label>Quantity *</label><input type="number" min="1" value={ticket.quantity} onChange={(e) => handleTicketChange(i, 'quantity', e.target.value)} required /></div>
                <div className="form-group"><label>Available</label><input type="number" min="0" value={ticket.available} onChange={(e) => handleTicketChange(i, 'available', e.target.value)} /></div>
                <div className="form-group full-width"><label>Description</label><input type="text" value={ticket.description} onChange={(e) => handleTicketChange(i, 'description', e.target.value)} /></div>
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
            <div className="form-group"><label>Total Tickets</label><input type="number" name="totalTickets" value={form.totalTickets} onChange={handleChange} min="1" /></div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-group"><label>Tags</label><input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="comma separated" /></div>
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
            {saving ? 'Saving...' : 'Update Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventPage;
