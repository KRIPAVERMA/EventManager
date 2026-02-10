import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineTicket } from 'react-icons/hi';

const EventBookingsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await API.get(`/bookings/event/${eventId}`);
        if (data.success) setBookings(data.data);
      } catch {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [eventId]);

  if (loading) return <div className="page-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="admin-event-bookings">
      <button className="btn btn-ghost back-btn" onClick={() => navigate('/admin/events')}>
        <HiOutlineArrowLeft /> Back to Events
      </button>

      <div className="admin-page-header">
        <h1>Event Bookings</h1>
        <p>{bookings.length} total bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <HiOutlineTicket size={48} />
          <h3>No bookings for this event</h3>
        </div>
      ) : (
        <div className="admin-table">
          <div className="admin-table-header">
            <span>User</span>
            <span>Tickets</span>
            <span>Amount</span>
            <span>Booking Status</span>
            <span>Payment</span>
          </div>
          {bookings.map((b) => (
            <div key={b._id} className="admin-table-row">
              <div className="table-cell-user">
                <div className="user-avatar-sm">{b.user?.name?.charAt(0)?.toUpperCase()}</div>
                <div>
                  <h4>{b.user?.name}</h4>
                  <span className="text-sm text-muted">{b.user?.email}</span>
                </div>
              </div>
              <div className="table-cell">
                {b.tickets?.map((t, i) => (
                  <span key={i} className="ticket-badge">{t.quantity}x {t.ticketType}</span>
                ))}
              </div>
              <div className="table-cell">
                <span className="fw-medium">${b.totalAmount?.toFixed(2)}</span>
              </div>
              <div className="table-cell">
                <span className={`status-badge small ${b.bookingStatus}`}>{b.bookingStatus}</span>
              </div>
              <div className="table-cell">
                <span className={`status-badge small outline ${b.paymentStatus}`}>{b.paymentStatus}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventBookingsPage;
