import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  HiOutlineUsers, HiOutlineCalendar, HiOutlineTicket,
  HiOutlineCash, HiOutlineTrendingUp, HiOutlineChevronRight,
} from 'react-icons/hi';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await API.get('/admin/dashboard');
        if (data.success) setStats(data.data);
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="page-center"><LoadingSpinner size="lg" text="Loading dashboard..." /></div>;
  if (!stats) return <div className="page-center"><p>Failed to load dashboard</p></div>;

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: <HiOutlineUsers />, color: '#3b82f6', link: '/admin/users' },
    { label: 'Total Events', value: stats.totalEvents, icon: <HiOutlineCalendar />, color: '#22c55e', link: '/admin/events' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: <HiOutlineTicket />, color: '#f59e0b', link: '/admin/bookings' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: <HiOutlineCash />, color: '#a855f7', link: '/admin/bookings' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Overview of your event booking platform</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.link} className="stat-card" style={{ '--stat-color': stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Revenue Chart */}
      {stats.bookingsByMonth?.length > 0 && (
        <div className="admin-card">
          <h2><HiOutlineTrendingUp /> Revenue by Month</h2>
          <div className="chart-bars">
            {stats.bookingsByMonth.map((m) => {
              const maxRevenue = Math.max(...stats.bookingsByMonth.map((b) => b.revenue));
              const height = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={`${m._id.year}-${m._id.month}`} className="chart-bar-wrapper">
                  <div className="chart-bar" style={{ height: `${Math.max(height, 5)}%` }}>
                    <span className="chart-bar-value">${m.revenue.toLocaleString()}</span>
                  </div>
                  <span className="chart-bar-label">
                    {format(new Date(m._id.year, m._id.month - 1), 'MMM yyyy')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="admin-grid-2">
        {/* Recent Bookings */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Recent Bookings</h2>
            <Link to="/admin/bookings" className="btn btn-ghost btn-sm">View All <HiOutlineChevronRight /></Link>
          </div>
          <div className="admin-table-simple">
            {stats.recentBookings?.length > 0 ? (
              stats.recentBookings.map((b) => (
                <div key={b._id} className="table-simple-row">
                  <div>
                    <p className="fw-medium">{b.user?.name}</p>
                    <p className="text-sm text-muted">{b.event?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="fw-medium">${b.totalAmount?.toFixed(2)}</p>
                    <p className="text-sm text-muted">{format(new Date(b.createdAt), 'MMM dd')}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No recent bookings</p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Upcoming Events</h2>
            <Link to="/admin/events" className="btn btn-ghost btn-sm">View All <HiOutlineChevronRight /></Link>
          </div>
          <div className="admin-table-simple">
            {stats.upcomingEvents?.length > 0 ? (
              stats.upcomingEvents.map((e) => (
                <div key={e._id} className="table-simple-row">
                  <div>
                    <p className="fw-medium">{e.title}</p>
                    <p className="text-sm text-muted">{format(new Date(e.date), 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="text-right">
                    <span className="badge">{e.availableTickets} left</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
