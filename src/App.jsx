import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import PaymentPage from './pages/PaymentPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import ManageEventsPage from './pages/admin/ManageEventsPage';
import CreateEventPage from './pages/admin/CreateEventPage';
import EditEventPage from './pages/admin/EditEventPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageBookingsPage from './pages/admin/ManageBookingsPage';
import EventBookingsPage from './pages/admin/EventBookingsPage';

import {
  HiOutlineViewGrid, HiOutlineCalendar, HiOutlineUsers,
  HiOutlineTicket, HiOutlineArrowLeft,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>Admin Panel</h3>
          <Link to="/" className="btn btn-ghost btn-sm">
            <HiOutlineArrowLeft /> Back to Site
          </Link>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <HiOutlineViewGrid /> Dashboard
          </NavLink>
          <NavLink to="/admin/events" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <HiOutlineCalendar /> Events
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <HiOutlineUsers /> Users
          </NavLink>
          <NavLink to="/admin/bookings" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <HiOutlineTicket /> Bookings
          </NavLink>
        </nav>
      </aside>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public */}
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Protected */}
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
        <Route path="bookings/:id" element={<ProtectedRoute><BookingDetailPage /></ProtectedRoute>} />
        <Route path="bookings/:id/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="admin" element={
          <AdminRoute>
            <AdminLayout><DashboardPage /></AdminLayout>
          </AdminRoute>
        } />
        <Route path="admin/events" element={
          <AdminRoute>
            <AdminLayout><ManageEventsPage /></AdminLayout>
          </AdminRoute>
        } />
        <Route path="admin/events/create" element={
          <AdminRoute>
            <AdminLayout><CreateEventPage /></AdminLayout>
          </AdminRoute>
        } />
        <Route path="admin/events/:id/edit" element={
          <AdminRoute>
            <AdminLayout><EditEventPage /></AdminLayout>
          </AdminRoute>
        } />
        <Route path="admin/events/:eventId/bookings" element={
          <AdminRoute>
            <AdminLayout><EventBookingsPage /></AdminLayout>
          </AdminRoute>
        } />
        <Route path="admin/users" element={
          <AdminRoute>
            <AdminLayout><ManageUsersPage /></AdminLayout>
          </AdminRoute>
        } />
        <Route path="admin/bookings" element={
          <AdminRoute>
            <AdminLayout><ManageBookingsPage /></AdminLayout>
          </AdminRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
