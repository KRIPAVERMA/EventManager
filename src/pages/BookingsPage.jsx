import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import API from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  HiOutlineTicket, HiOutlineCalendar, HiOutlineLocationMarker,
  HiOutlineCash, HiOutlineXCircle, HiOutlineCheckCircle, HiOutlineClock,
} from 'react-icons/hi';

const statusColors = {
  confirmed: '#22c55e',
  pending: '#f59e0b',
  cancelled: '#ef4444',
};

const paymentStatusColors = {
  completed: '#22c55e',
  pending: '#f59e0b',
  failed: '#ef4444',
  refunded: '#6b7280',
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await API.get('/bookings/my-bookings');
        if (data.success) setBookings(data.data);
      } catch {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled');
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, bookingStatus: 'cancelled', paymentStatus: 'refunded' } : b
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <div className="page-center"><LoadingSpinner size="lg" text="Loading bookings..." /></div>;

  return (
    <div className="bookings-page">
      <div className="container">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <HiOutlineTicket size={48} />
            <h3>No bookings yet</h3>
            <p>Browse events and book your first ticket!</p>
            <Link to="/events" className="btn btn-primary">Browse Events</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-item">
                <div className="booking-event-image">
                  <img
                    src={booking.event?.image && booking.event.image !== 'default-event.jpg'
                      ? booking.event.image
                      : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop'}
                    alt={booking.event?.title}
                  />
                </div>
                <div className="booking-info">
                  <Link to={`/events/${booking.event?._id}`} className="booking-event-title">
                    {booking.event?.title || 'Event'}
                  </Link>
                  <div className="booking-meta">
                    <span><HiOutlineCalendar /> {booking.event?.date ? format(new Date(booking.event.date), 'MMM dd, yyyy') : 'N/A'}</span>
                    <span><HiOutlineClock /> {booking.event?.startTime} — {booking.event?.endTime}</span>
                    <span><HiOutlineLocationMarker /> {booking.event?.venue?.city || 'N/A'}</span>
                  </div>
                  <div className="booking-tickets-summary">
                    {booking.tickets?.map((t, i) => (
                      <span key={i} className="ticket-badge">
                        {t.quantity}x {t.ticketType}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="booking-right">
                  <div className="booking-amount">${booking.totalAmount?.toFixed(2)}</div>
                  <div className="booking-statuses">
                    <span className="status-badge" style={{ backgroundColor: statusColors[booking.bookingStatus] || '#6b7280' }}>
                      {booking.bookingStatus}
                    </span>
                    <span className="status-badge outline" style={{ color: paymentStatusColors[booking.paymentStatus], borderColor: paymentStatusColors[booking.paymentStatus] }}>
                      {booking.paymentStatus === 'completed' ? 'Paid' : booking.paymentStatus}
                    </span>
                  </div>
                  <div className="booking-actions">
                    <Link to={`/bookings/${booking._id}`} className="btn btn-ghost btn-sm">View Details</Link>
                    {booking.bookingStatus === 'pending' && booking.paymentStatus === 'pending' && (
                      <Link to={`/bookings/${booking._id}/payment`} className="btn btn-primary btn-sm">Pay Now</Link>
                    )}
                    {booking.bookingStatus !== 'cancelled' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(booking._id)}>Cancel</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
