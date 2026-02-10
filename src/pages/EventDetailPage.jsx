import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  HiOutlineCalendar, HiOutlineClock, HiOutlineLocationMarker,
  HiOutlineTicket, HiOutlineTag, HiOutlineUser, HiOutlineArrowLeft,
  HiOutlineMinus, HiOutlinePlus, HiOutlineShieldCheck,
} from 'react-icons/hi';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState({});
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await API.get(`/events/${id}`);
        if (data.success) {
          setEvent(data.data);
          // Init ticket selection
          const initial = {};
          data.data.ticketTypes?.forEach((t) => { initial[t.name] = 0; });
          setTickets(initial);
        }
      } catch {
        toast.error('Event not found');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const updateTicket = (name, delta, max) => {
    setTickets((prev) => ({
      ...prev,
      [name]: Math.max(0, Math.min((prev[name] || 0) + delta, max)),
    }));
  };

  const totalTickets = Object.values(tickets).reduce((a, b) => a + b, 0);
  const totalPrice = event?.ticketTypes?.reduce((sum, t) => sum + (tickets[t.name] || 0) * t.price, 0) || 0;

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets');
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }
    if (totalTickets === 0) {
      toast.error('Please select at least one ticket');
      return;
    }

    const ticketList = Object.entries(tickets)
      .filter(([, qty]) => qty > 0)
      .map(([ticketType, quantity]) => ({ ticketType, quantity }));

    setBooking(true);
    try {
      const { data } = await API.post('/bookings', { eventId: id, tickets: ticketList });
      if (data.success) {
        toast.success('Booking created! Proceed to payment.');
        navigate(`/bookings/${data.data._id}/payment`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="page-center"><LoadingSpinner size="lg" text="Loading event..." /></div>;
  if (!event) return null;

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const isAvailable = event.availableTickets > 0 && event.status === 'published' && !isPast;

  return (
    <div className="event-detail-page">
      <div className="container">
        <button className="btn btn-ghost back-btn" onClick={() => navigate(-1)}>
          <HiOutlineArrowLeft /> Back
        </button>

        <div className="event-detail-grid">
          {/* Left Column */}
          <div className="event-detail-main">
            <div className="event-detail-image">
              <img
                src={event.image && event.image !== 'default-event.jpg'
                  ? event.image
                  : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop'}
                alt={event.title}
              />
              <span className="event-detail-category">{event.category}</span>
              {event.isFeatured && <span className="event-detail-featured">Featured</span>}
            </div>

            <div className="event-detail-content">
              <h1>{event.title}</h1>

              <div className="event-detail-meta">
                <div className="meta-item">
                  <HiOutlineCalendar />
                  <span>{format(eventDate, 'EEEE, MMMM dd, yyyy')}</span>
                </div>
                <div className="meta-item">
                  <HiOutlineClock />
                  <span>{event.startTime} — {event.endTime}</span>
                </div>
                <div className="meta-item">
                  <HiOutlineLocationMarker />
                  <span>
                    {event.venue?.name}, {event.venue?.address}, {event.venue?.city}
                    {event.venue?.state ? `, ${event.venue.state}` : ''}, {event.venue?.country}
                  </span>
                </div>
                {event.organizer && (
                  <div className="meta-item">
                    <HiOutlineUser />
                    <span>Organized by {event.organizer.name}</span>
                  </div>
                )}
              </div>

              <div className="event-detail-tags">
                {event.tags?.map((tag) => (
                  <span key={tag} className="tag"><HiOutlineTag /> {tag}</span>
                ))}
              </div>

              <div className="event-detail-description">
                <h2>About This Event</h2>
                <p>{event.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column — Booking */}
          <div className="event-detail-sidebar">
            <div className="booking-card">
              <h3>Select Tickets</h3>

              {!isAvailable ? (
                <div className="booking-unavailable">
                  <HiOutlineTicket size={40} />
                  <p>{isPast ? 'This event has ended' : 'Tickets are not available'}</p>
                </div>
              ) : (
                <>
                  <div className="ticket-types">
                    {event.ticketTypes?.map((ticket) => (
                      <div key={ticket._id || ticket.name} className="ticket-type">
                        <div className="ticket-info">
                          <h4>{ticket.name}</h4>
                          <p className="ticket-desc">{ticket.description}</p>
                          <p className="ticket-price">${ticket.price.toFixed(2)}</p>
                          <p className="ticket-avail">{ticket.available} left</p>
                        </div>
                        <div className="ticket-qty">
                          <button
                            className="qty-btn"
                            onClick={() => updateTicket(ticket.name, -1, ticket.available)}
                            disabled={!tickets[ticket.name]}
                          >
                            <HiOutlineMinus />
                          </button>
                          <span className="qty-value">{tickets[ticket.name] || 0}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateTicket(ticket.name, 1, ticket.available)}
                            disabled={tickets[ticket.name] >= ticket.available}
                          >
                            <HiOutlinePlus />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalTickets > 0 && (
                    <div className="booking-summary">
                      <div className="summary-row">
                        <span>Total ({totalTickets} ticket{totalTickets > 1 ? 's' : ''})</span>
                        <span className="summary-price">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <button
                    className="btn btn-primary btn-block btn-lg"
                    onClick={handleBooking}
                    disabled={totalTickets === 0 || booking}
                  >
                    {booking ? 'Creating Booking...' : totalTickets > 0 ? `Book Now — $${totalPrice.toFixed(2)}` : 'Select Tickets'}
                  </button>

                  <div className="booking-secure">
                    <HiOutlineShieldCheck />
                    <span>Secure checkout with Stripe</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
