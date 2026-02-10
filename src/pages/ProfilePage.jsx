import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  HiOutlineUser, HiOutlineMail, HiOutlinePhone,
  HiOutlineLockClosed, HiOutlinePencil, HiOutlineCheck,
  HiOutlineX, HiOutlineShieldCheck,
} from 'react-icons/hi';

const ProfilePage = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updates = {};
      if (form.name !== user?.name) updates.name = form.name;
      if (form.email !== user?.email) updates.email = form.email;
      if (form.phone !== user?.phone) updates.phone = form.phone;

      if (Object.keys(updates).length === 0) {
        toast('No changes to save');
        setEditMode(false);
        setSaving(false);
        return;
      }

      await updateProfile(updates);
      toast.success('Profile updated!');
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setChangingPassword(true);
    try {
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password updated!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1>My Profile</h1>
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2>{user?.name}</h2>
                <p className="profile-role">
                  <HiOutlineShieldCheck />
                  {user?.role === 'admin' ? 'Administrator' : 'Member'}
                </p>
                <p className="profile-joined">Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="profile-form-header">
                <h3>Personal Information</h3>
                {!editMode ? (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditMode(true)}>
                    <HiOutlinePencil /> Edit
                  </button>
                ) : (
                  <div className="form-actions-inline">
                    <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                      <HiOutlineCheck /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditMode(false); setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' }); }}>
                      <HiOutlineX /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label><HiOutlineUser /> Name</label>
                {editMode ? (
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={50} />
                ) : (
                  <p className="form-value">{user?.name}</p>
                )}
              </div>

              <div className="form-group">
                <label><HiOutlineMail /> Email</label>
                {editMode ? (
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                ) : (
                  <p className="form-value">{user?.email}</p>
                )}
              </div>

              <div className="form-group">
                <label><HiOutlinePhone /> Phone</label>
                {editMode ? (
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Not set" maxLength={20} />
                ) : (
                  <p className="form-value">{user?.phone || 'Not set'}</p>
                )}
              </div>
            </form>
          </div>

          <div className="profile-card">
            <div className="profile-form-header">
              <h3><HiOutlineLockClosed /> Security</h3>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowPasswordSection(!showPasswordSection)}>
                {showPasswordSection ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showPasswordSection && (
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password" required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password" required minLength={6}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Min 6 characters"
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password" required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={changingPassword}>
                  {changingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
