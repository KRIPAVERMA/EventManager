import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import API from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineClock, HiOutlineTicket } from 'react-icons/hi';

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      setLoading(true);
      try {
        const month = currentMonth.getMonth() + 1;
        const year = currentMonth.getFullYear();
        const { data } = await API.get(`/events/calendar?month=${month}&year=${year}`);
        if (data.success) setEvents(data.data);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendarEvents();
  }, [currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  const getEventsForDate = (date) => events.filter((e) => isSameDay(new Date(e.date), date));
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-page">
      <div className="container">
        <div className="calendar-header-section">
          <h1>Event Calendar</h1>
          <p>Browse events by date</p>
        </div>

        <div className="calendar-layout">
          <div className="calendar-main">
            <div className="calendar-nav">
              <button className="btn btn-ghost" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <HiOutlineChevronLeft />
              </button>
              <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
              <button className="btn btn-ghost" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <HiOutlineChevronRight />
              </button>
            </div>

            {loading ? (
              <LoadingSpinner text="Loading calendar..." />
            ) : (
              <div className="calendar-grid">
                {dayNames.map((d) => (
                  <div key={d} className="calendar-day-name">{d}</div>
                ))}
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="calendar-day empty" />
                ))}
                {days.map((day) => {
                  const dayEvents = getEventsForDate(day);
                  const isToday = isSameDay(day, new Date());
                  const isSelected = selectedDate && isSameDay(day, selectedDate);

                  return (
                    <button
                      key={day.toISOString()}
                      className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <span className="day-number">{format(day, 'd')}</span>
                      {dayEvents.length > 0 && (
                        <div className="day-events-dots">
                          {dayEvents.slice(0, 3).map((e) => (
                            <span key={e._id} className="event-dot" title={e.title} />
                          ))}
                          {dayEvents.length > 3 && <span className="more-dots">+{dayEvents.length - 3}</span>}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="calendar-sidebar">
            <h3>
              {selectedDate
                ? format(selectedDate, 'EEEE, MMMM dd')
                : 'Select a date to view events'}
            </h3>
            {selectedDate && selectedEvents.length === 0 && (
              <div className="empty-state small">
                <p>No events on this day</p>
              </div>
            )}
            <div className="calendar-event-list">
              {selectedEvents.map((event) => (
                <Link key={event._id} to={`/events/${event._id}`} className="calendar-event-item">
                  <div className="calendar-event-info">
                    <h4>{event.title}</h4>
                    <div className="calendar-event-meta">
                      <span><HiOutlineClock /> {event.startTime} — {event.endTime}</span>
                      <span><HiOutlineTicket /> {event.availableTickets} available</span>
                    </div>
                    <span className="calendar-event-venue">{event.venue?.name}</span>
                  </div>
                  <span className={`calendar-event-category ${event.category}`}>{event.category}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
