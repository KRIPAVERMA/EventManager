import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import EventCard from '../components/events/EventCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  HiOutlineSearch, HiOutlineFilter, HiOutlineX, HiOutlineChevronLeft,
  HiOutlineChevronRight, HiOutlineSortDescending,
} from 'react-icons/hi';

const categories = ['concert', 'conference', 'workshop', 'sports', 'theater', 'festival', 'meetup', 'other'];
const sortOptions = [
  { value: '', label: 'Soonest First' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'date_desc', label: 'Date: Latest First' },
];

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
    page: parseInt(searchParams.get('page')) || 1,
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      params.set('limit', '12');

      const { data } = await API.get(`/events?${params.toString()}`);
      if (data.success) {
        setEvents(data.data);
        setPagination({
          total: data.total,
          totalPages: data.totalPages,
          currentPage: data.currentPage,
        });
      }
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '1' && key !== 'page') params.set(key, value);
      if (key === 'page' && value > 1) params.set(key, value);
    });
    setSearchParams(params, { replace: true });
  }, [filters, fetchEvents]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '', category: '', city: '', startDate: '', endDate: '',
      minPrice: '', maxPrice: '', sort: '', page: 1,
    });
  };

  const activeFilterCount = Object.entries(filters)
    .filter(([key, val]) => val && key !== 'page' && key !== 'sort')
    .length;

  return (
    <div className="events-page">
      <div className="container">
        {/* Header */}
        <div className="events-header">
          <h1>Discover Events</h1>
          <p>Find the perfect event for you</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="events-toolbar">
          <div className="search-bar">
            <HiOutlineSearch />
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
            {filters.search && (
              <button className="clear-input" onClick={() => updateFilter('search', '')}>
                <HiOutlineX />
              </button>
            )}
          </div>

          <div className="toolbar-actions">
            <div className="sort-select">
              <HiOutlineSortDescending />
              <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <button
              className={`btn btn-outline btn-filter ${activeFilterCount > 0 ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <HiOutlineFilter />
              Filters
              {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <label>Category</label>
                <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}>
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>City</label>
                <input
                  type="text" placeholder="e.g. New York"
                  value={filters.city} onChange={(e) => updateFilter('city', e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>From Date</label>
                <input
                  type="date" value={filters.startDate}
                  onChange={(e) => updateFilter('startDate', e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>To Date</label>
                <input
                  type="date" value={filters.endDate}
                  onChange={(e) => updateFilter('endDate', e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Min Price ($)</label>
                <input
                  type="number" min="0" placeholder="0"
                  value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Max Price ($)</label>
                <input
                  type="number" min="0" placeholder="Any"
                  value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)}
                />
              </div>
            </div>

            <div className="filters-actions">
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear All</button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowFilters(false)}>Apply</button>
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div className="category-pills">
          <button
            className={`pill ${filters.category === '' ? 'active' : ''}`}
            onClick={() => updateFilter('category', '')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill ${filters.category === cat ? 'active' : ''}`}
              onClick={() => updateFilter('category', cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner text="Loading events..." />
        ) : events.length > 0 ? (
          <>
            <p className="results-count">{pagination.total} events found</p>
            <div className="events-grid">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={pagination.currentPage <= 1}
                  onClick={() => updateFilter('page', pagination.currentPage - 1)}
                >
                  <HiOutlineChevronLeft /> Previous
                </button>
                <div className="pagination-pages">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      const c = pagination.currentPage;
                      return p === 1 || p === pagination.totalPages || (p >= c - 2 && p <= c + 2);
                    })
                    .map((p, idx, arr) => (
                      <span key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && <span className="pagination-dots">...</span>}
                        <button
                          className={`pagination-btn ${p === pagination.currentPage ? 'active' : ''}`}
                          onClick={() => updateFilter('page', p)}
                        >
                          {p}
                        </button>
                      </span>
                    ))}
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={pagination.currentPage >= pagination.totalPages}
                  onClick={() => updateFilter('page', pagination.currentPage + 1)}
                >
                  Next <HiOutlineChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <HiOutlineSearch size={48} />
            <h3>No events found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
