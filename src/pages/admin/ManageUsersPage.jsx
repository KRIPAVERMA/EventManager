import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  HiOutlineSearch, HiOutlineUsers, HiOutlineTrash,
  HiOutlineShieldCheck, HiOutlineChevronLeft, HiOutlineChevronRight,
} from 'react-icons/hi';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async (page = 1, searchQuery = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (searchQuery) params.set('search', searchQuery);
      const { data } = await API.get(`/admin/users?${params}`);
      if (data.success) {
        setUsers(data.data);
        setPagination({ total: data.total, totalPages: data.totalPages, currentPage: data.currentPage });
      }
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, search);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success('Role updated');
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: newRole } : u));
      if (selectedUser?._id === userId) setSelectedUser(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      toast.success('User deleted');
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const viewUser = async (userId) => {
    try {
      const { data } = await API.get(`/admin/users/${userId}`);
      if (data.success) setSelectedUser(data.data);
    } catch {
      toast.error('Failed to load user details');
    }
  };

  return (
    <div className="admin-manage-users">
      <div className="admin-page-header">
        <div>
          <h1>Manage Users</h1>
          <p>{pagination.total} total users</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="admin-search-bar">
        <HiOutlineSearch />
        <input
          type="text" placeholder="Search by name or email..."
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-sm">Search</button>
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="admin-table">
            <div className="admin-table-header">
              <span>User</span>
              <span>Role</span>
              <span>Joined</span>
              <span>Actions</span>
            </div>
            {users.map((user) => (
              <div key={user._id} className="admin-table-row">
                <div className="table-cell-user">
                  <div className="user-avatar-sm">{user.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <h4>{user.name}</h4>
                    <span className="text-sm text-muted">{user.email}</span>
                    {user.phone && <span className="text-sm text-muted"> &middot; {user.phone}</span>}
                  </div>
                </div>
                <div className="table-cell">
                  <span className={`status-badge small ${user.role}`}>
                    <HiOutlineShieldCheck /> {user.role}
                  </span>
                </div>
                <div className="table-cell">
                  <span>{format(new Date(user.createdAt), 'MMM dd, yyyy')}</span>
                </div>
                <div className="table-cell actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => viewUser(user._id)}>View</button>
                  <select
                    className="role-select"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button className="btn-icon danger" onClick={() => handleDelete(user._id, user.name)}>
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button className="btn btn-ghost btn-sm" disabled={pagination.currentPage <= 1}
                onClick={() => fetchUsers(pagination.currentPage - 1, search)}>
                <HiOutlineChevronLeft /> Previous
              </button>
              <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
              <button className="btn btn-ghost btn-sm" disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => fetchUsers(pagination.currentPage + 1, search)}>
                Next <HiOutlineChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="btn-icon" onClick={() => setSelectedUser(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="user-detail-info">
                <p><strong>Name:</strong> {selectedUser.user?.name}</p>
                <p><strong>Email:</strong> {selectedUser.user?.email}</p>
                <p><strong>Role:</strong> {selectedUser.user?.role}</p>
                <p><strong>Phone:</strong> {selectedUser.user?.phone || 'N/A'}</p>
              </div>
              {selectedUser.bookings?.length > 0 && (
                <div className="user-bookings-list">
                  <h3>Bookings ({selectedUser.bookings.length})</h3>
                  {selectedUser.bookings.map((b) => (
                    <div key={b._id} className="user-booking-item">
                      <span>{b.event?.title}</span>
                      <span>${b.totalAmount?.toFixed(2)}</span>
                      <span className={`status-badge small ${b.bookingStatus}`}>{b.bookingStatus}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
