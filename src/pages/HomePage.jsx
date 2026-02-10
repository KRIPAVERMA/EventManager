import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import EventCard from '../components/events/EventCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  HiOutlineSearch, HiOutlineCalendar, HiOutlineTicket,
  HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineMusicNote,
  HiOutlineAcademicCap, HiOutlineDesktopComputer, HiOutlineUserGroup,
  HiOutlineFilm, HiOutlineStar, HiOutlinePuzzle, HiOutlineDotsHorizontal,
} from 'react-icons/hi';
import { MdSportsSoccer } from 'react-icons/md';

const categories = [
  { key: 'concert', label: 'Concerts', icon: <HiOutlineMusicNote />, color: '#ef4444' },
  { key: 'conference', label: 'Conferences', icon: <HiOutlineDesktopComputer />, color: '#3b82f6' },
  { key: 'workshop', label: 'Workshops', icon: <HiOutlineAcademicCap />, color: '#f59e0b' },
  { key: 'sports', label: 'Sports', icon: <MdSportsSoccer />, color: '#22c55e' },
  { key: 'theater', label: 'Theater', icon: <HiOutlineFilm />, color: '#a855f7' },
  { key: 'festival', label: 'Festivals', icon: <HiOutlineStar />, color: '#ec4899' },
  { key: 'meetup', label: 'Meetups', icon: <HiOutlineUserGroup />, color: '#06b6d4' },
  { key: 'other', label: 'Other', icon: <HiOutlineDotsHorizontal />, color: '#6b7280' },
];

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/events/featured');
        if (data.success) setFeaturedEvents(data.data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/events?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <h1 className="hero-title">
            Discover <span className="gradient-text">Amazing Events</span> Near You
          </h1>
          <p className="hero-subtitle">
            From concerts to conferences, find and book your next unforgettable experience.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-input">
              <HiOutlineSearch />
              <input
                type="text"
                placeholder="Search events, artists, venues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
          <div className="hero-stats">
            <div className="hero-stat">
              <HiOutlineCalendar />
              <span>500+ Events</span>
            </div>
            <div className="hero-stat">
              <HiOutlineTicket />
              <span>50K+ Tickets Sold</span>
            </div>
            <div className="hero-stat">
              <HiOutlineShieldCheck />
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Browse by Category</h2>
            <p>Explore events across all categories</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                to={`/events?category=${cat.key}`}
                className="category-card"
                style={{ '--cat-color': cat.color }}
              >
                <div className="category-icon">{cat.icon}</div>
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Featured Events</h2>
            <Link to="/events" className="btn btn-ghost">View All &rarr;</Link>
          </div>
          {loading ? (
            <LoadingSpinner text="Loading events..." />
          ) : featuredEvents.length > 0 ? (
            <div className="events-grid">
              {featuredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <HiOutlineLightningBolt size={48} />
              <h3>No featured events yet</h3>
              <p>Check back soon for amazing events!</p>
              <Link to="/events" className="btn btn-primary">Browse All Events</Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to experience something amazing?</h2>
            <p>Join thousands of event-goers and never miss out on your favorite events.</p>
            <div className="cta-buttons">
              <Link to="/events" className="btn btn-primary btn-lg">Explore Events</Link>
              <Link to="/register" className="btn btn-outline btn-lg">Sign Up Free</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
