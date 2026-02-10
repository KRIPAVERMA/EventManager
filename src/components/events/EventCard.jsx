import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineTicket } from 'react-icons/hi';

const categoryColors = {
  concert: '#ef4444',
  conference: '#3b82f6',
  workshop: '#f59e0b',
  sports: '#22c55e',
  theater: '#a855f7',
  festival: '#ec4899',
  meetup: '#06b6d4',
  other: '#6b7280',
};

const EventCard = ({ event }) => {
  const lowestPrice = event.ticketTypes?.reduce(
    (min, t) => (t.price < min ? t.price : min),
    event.ticketTypes[0]?.price || 0
  );

  const isAvailable = event.availableTickets > 0 && event.status === 'published';
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <Link to={`/events/${event._id}`} className="event-card">
      <div className="event-card-image">
        <img
          src={event.image && event.image !== 'default-event.jpg'
            ? event.image
            : `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop`}
          alt={event.title}
        />
        <span
          className="event-card-category"
          style={{ backgroundColor: categoryColors[event.category] || categoryColors.other }}
        >
          {event.category}
        </span>
        {event.isFeatured && <span className="event-card-featured">Featured</span>}
        {isPast && <div className="event-card-overlay"><span>Past Event</span></div>}
      </div>

      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>

        <div className="event-card-info">
          <div className="event-card-detail">
            <HiOutlineCalendar />
            <span>{format(eventDate, 'MMM dd, yyyy')} &middot; {event.startTime}</span>
          </div>
          <div className="event-card-detail">
            <HiOutlineLocationMarker />
            <span>{event.venue?.city || 'TBA'}</span>
          </div>
          <div className="event-card-detail">
            <HiOutlineTicket />
            <span>{event.availableTickets} tickets left</span>
          </div>
        </div>

        <div className="event-card-footer">
          <span className="event-card-price">
            {lowestPrice > 0 ? `From $${lowestPrice.toFixed(2)}` : 'Free'}
          </span>
          <span className={`event-card-status ${isAvailable ? 'available' : 'unavailable'}`}>
            {!isAvailable ? (isPast ? 'Ended' : 'Sold Out') : 'Available'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
