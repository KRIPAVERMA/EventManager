import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  HiOutlineTicket, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineFilter,
} from 'react-icons/hi';

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });
  const [statusFilter, setStatusFilter] = useState('');

  const fetchBookings = async (page = 1, status = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (status) params.set('status', status);
      const { data } = await API.get(`/bookings?${params}`);
      if (data.success) {
        setBookings(data.data);
        setPagination({ total: data.total, totalPages: data.totalPages, currentPage: data.currentPage });
      }
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    fetchBookings(1, status);
  };

  const handleRefund = async (bookingId) => {
    if (!window.confirm('Process refund for this booking?')) return;
    try {
      await API.post('/payments/refund', { bookingId });
      toast.success('Refund processed');
      fetchBookings(pagination.currentPage, statusFilter);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Refund failed');
    }
  };

  return (
    <div className="admin-manage-bookings">
      <div className="admin-page-header">
        <div>
          <h1>Manage Bookings</h1>
          <p>{pagination.total} total bookings</p>
        </div>
      </div>

      <div className="admin-filters">
        <HiOutlineFilter />
        <button className={`pill ${statusFilter === '' ? 'active' : ''}`} onClick={() => handleFilterChange('')}>All</button>
        <button className={`pill ${statusFilter === 'confirmed' ? 'active' : ''}`} onClick={() => handleFilterChange('confirmed')}>Confirmed</button>
        <button className={`pill ${statusFilter === 'pending' ? 'active' : ''}`} onClick={() => handleFilterChange('pending')}>Pending</button>
        <button className={`pill ${statusFilter === 'cancelled' ? 'active' : ''}`} onClick={() => handleFilterChange('cancelled')}>Cancelled</button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <HiOutlineTicket size={48} />
          <h3>No bookings found</h3>
        </div>
      ) : (
        <>
          <div className="admin-table admin-table-bookings">
            <div className="admin-table-header admin-table-header-bookings">
              <span>Booking</span>
              <span>User</span>
              <span>Event</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {bookings.map((booking) => (
              <div key={booking._id} className="admin-table-row admin-table-row-bookings">
                <div className="table-cell">
                  <span className="text-sm fw-medium">#{booking._id?.slice(-8)}</span>
                  <span className="text-sm text-muted">{format(new Date(booking.createdAt), 'MMM dd, yyyy')}</span>
                </div>
                <div className="table-cell">
                  <span className="fw-medium">{booking.user?.name}</span>
                  <span className="text-sm text-muted">{booking.user?.email}</span>
                </div>
                <div className="table-cell">
                  <span className="fw-medium">{booking.event?.title}</span>
                </div>
                <div className="table-cell">
                  <span className="fw-medium">${booking.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="table-cell">
                  <span className={`status-badge small ${booking.bookingStatus}`}>{booking.bookingStatus}</span>
                  <span className={`status-badge small outline ${booking.paymentStatus}`}>{booking.paymentStatus}</span>
                </div>
                <div className="table-cell actions">
                  {booking.paymentStatus === 'completed' && booking.bookingStatus !== 'cancelled' && (
                    <button className="btn btn-ghost btn-sm danger" onClick={() => handleRefund(booking._id)}>Refund</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button className="btn btn-ghost btn-sm" disabled={pagination.currentPage <= 1}
                onClick={() => fetchBookings(pagination.currentPage - 1, statusFilter)}>
                <HiOutlineChevronLeft /> Previous
              </button>
              <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
              <button className="btn btn-ghost btn-sm" disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => fetchBookings(pagination.currentPage + 1, statusFilter)}>
                Next <HiOutlineChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageBookingsPage;
