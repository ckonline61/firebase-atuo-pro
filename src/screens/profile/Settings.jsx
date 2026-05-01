import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import './ProfilePages.css';

export default function Settings() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleDeleteAccount = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <div className="screen screen-with-header" id="settings-screen">
      <Header title="Settings" />
      <div className="screen-content">
        {/* Preferences */}
        <div className="settings-section animate-fadeInUp">
          <h4 className="payment-section-title">Preferences</h4>
          
          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-item-icon">🔔</span>
              <div>
                <p className="settings-item-label">Push Notifications</p>
                <p className="settings-item-desc">Booking updates & offers</p>
              </div>
            </div>
            <label className="settings-toggle">
              <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
              <span className="settings-toggle-slider"></span>
            </label>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-item-icon">📍</span>
              <div>
                <p className="settings-item-label">Location Services</p>
                <p className="settings-item-desc">For nearby services & pickup</p>
              </div>
            </div>
            <label className="settings-toggle">
              <input type="checkbox" checked={locationEnabled} onChange={(e) => setLocationEnabled(e.target.checked)} />
              <span className="settings-toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Legal */}
        <div className="settings-section animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <h4 className="payment-section-title">Legal</h4>
          
          <button className="settings-nav-item" onClick={() => navigate('/privacy-policy')}>
            <span className="settings-item-icon">🔒</span>
            <span className="settings-nav-label">Privacy Policy</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          <button className="settings-nav-item" onClick={() => navigate('/terms-conditions')}>
            <span className="settings-item-icon">📄</span>
            <span className="settings-nav-label">Terms & Conditions</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        {/* About */}
        <div className="settings-section animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
          <h4 className="payment-section-title">About</h4>
          
          <div className="settings-about-card">
            <img src="/logo.png" alt="Auto Pro" className="settings-about-logo" />
            <p className="settings-about-name">Auto Pro</p>
            <p className="settings-about-version">Version 1.0.0</p>
            <p className="settings-about-desc">Smart Car Inspection & Deals at Your Doorstep</p>
          </div>
        </div>

        {/* Account Actions */}
        <div className="settings-section animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <h4 className="payment-section-title">Account</h4>

          <button className="btn btn-outline mt-8" onClick={handleLogout} id="btn-settings-logout"
            style={{ color: 'var(--primary-red)', borderColor: 'var(--primary-red)' }}>
            🚪 Logout
          </button>

          <button className="settings-delete-btn mt-16" onClick={() => setShowDeleteConfirm(true)} id="btn-delete-account">
            🗑️ Delete My Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="settings-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="settings-modal animate-scaleIn" onClick={(e) => e.stopPropagation()}>
              <div className="settings-modal-icon">⚠️</div>
              <h3 className="settings-modal-title">Delete Account?</h3>
              <p className="settings-modal-text">
                This will permanently delete your account and all associated data including bookings, listings, and saved cars. This action cannot be undone.
              </p>
              <div className="settings-modal-buttons">
                <button className="btn btn-secondary btn-sm" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </button>
                <button className="btn btn-sm" onClick={handleDeleteAccount}
                  style={{ background: 'var(--primary-red)', color: 'white' }}>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
