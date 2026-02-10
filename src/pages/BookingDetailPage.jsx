import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import API from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  HiOutlineCalendar, HiOutlineClock, HiOutlineLocationMarker,
  HiOutlineTicket, HiOutlineArrowLeft, HiOutlineXCircle,
  HiOutlineCheckCircle, HiOutlineCash, HiOutlineUser, HiOutlineMail,
} from 'react-icons/hi';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await API.get(`/bookings/${id}`);
        if (data.success) setBooking(data.data);
      } catch {
        toast.error('Booking not found');
        navigate('/bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const { data } = await API.put(`/bookings/${id}/cancel`);
      if (data.success) {
        toast.success('Booking cancelled');
        setBooking(data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <div className="page-center"><LoadingSpinner size="lg" /></div>;
  if (!booking) return null;

  return (
    <div className="booking-detail-page">
      <div className="container">
        <button className="btn btn-ghost back-btn" onClick={() => navigate('/bookings')}>
          <HiOutlineArrowLeft /> My Bookings
        </button>

        <div className="booking-detail-grid">
          <div className="booking-detail-main">
            <div className="booking-detail-card">
              <div className="booking-detail-header">
                <h1>Booking Details</h1>
                <div className="booking-detail-statuses">
                  <span className={`status-badge large ${booking.bookingStatus}`}>
                    {booking.bookingStatus === 'confirmed' && <HiOutlineCheckCircle />}
                    {booking.bookingStatus === 'cancelled' && <HiOutlineXCircle />}
                    {booking.bookingStatus}
                  </span>
                  <span className={`status-badge large outline ${booking.paymentStatus}`}>
                    <HiOutlineCash />
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="booking-detail-event">
                <h2>{booking.event?.title}</h2>
                <div className="booking-detail-event-meta">
                  <span><HiOutlineCalendar /> {booking.event?.date ? format(new Date(booking.event.date), 'EEEE, MMMM dd, yyyy') : ''}</span>
                  <span><HiOutlineClock /> {booking.event?.startTime} — {booking.event?.endTime}</span>
                  <span><HiOutlineLocationMarker /> {booking.event?.venue?.name}, {booking.event?.venue?.city}</span>
                </div>
              </div>

              <div className="booking-detail-tickets">
                <h3><HiOutlineTicket /> Tickets</h3>
                <div className="ticket-table">
                  <div className="ticket-table-header">
                    <span>Type</span>
                    <span>Qty</span>
                    <span>Price</span>
                    <span>Subtotal</span>
                  </div>
                  {booking.tickets?.map((t, i) => (
                    <div key={i} className="ticket-table-row">
                      <span>{t.ticketType}</span>
                      <span>{t.quantity}</span>
                      <span>${t.pricePerTicket?.toFixed(2)}</span>
                      <span>${(t.quantity * t.pricePerTicket).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="ticket-table-total">
                    <span>Total</span>
                    <span>${booking.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {booking.paymentId && (
                <div className="booking-detail-payment">
                  <h3>Payment Info</h3>
                  <p>Payment ID: <code>{booking.paymentId}</code></p>
                </div>
              )}

              <div className="booking-detail-info">
                <p>Booked on: {format(new Date(booking.createdAt), 'MMMM dd, yyyy \'at\' hh:mm a')}</p>
                {booking.reminderSent && <p className="reminder-sent">Reminder email sent</p>}
              </div>
            </div>
          </div>

          <div className="booking-detail-sidebar">
            <div className="booking-actions-card">
              <h3>Actions</h3>
              {booking.bookingStatus === 'pending' && booking.paymentStatus === 'pending' && (
                <Link to={`/bookings/${booking._id}/payment`} className="btn btn-primary btn-block">
                  Complete Payment
                </Link>
              )}
              {booking.event?._id && (
                <Link to={`/events/${booking.event._id}`} className="btn btn-outline btn-block">
                  View Event
                </Link>
              )}
              {booking.bookingStatus !== 'cancelled' && (
                <button className="btn btn-danger btn-block" onClick={handleCancel}>
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
