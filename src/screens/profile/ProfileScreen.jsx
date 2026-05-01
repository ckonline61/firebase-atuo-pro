import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import './Profile.css';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const user = state.user || { name: 'Aman Sharma', email: 'aman.sharma@gmail.com' };

  const menuItems = [
    { icon: '📋', label: 'My Bookings', path: '/bookings' },
    { icon: '📝', label: 'My Listings', path: '/profile/my-listings' },
    { icon: '❤️', label: 'Saved Cars', path: '/profile/saved-cars' },
    { icon: '💳', label: 'Payment Methods', path: '/profile/payment-methods' },
    { icon: '📍', label: 'Addresses', path: '/profile/addresses' },
    { icon: '🎁', label: 'Refer & Earn', path: '/profile/refer-earn' },
    { icon: '❓', label: 'Help & Support', path: '/profile/help-support' },
    { icon: '⚙️', label: 'Settings', path: '#' },
  ];

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <div className="screen screen-with-header" id="profile-screen">
      <Header title="Profile" showBack={false} />
      <div className="screen-content">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} />
            ) : (
              <span>{user.name?.charAt(0) || 'A'}</span>
            )}
          </div>
          <div className="profile-info">
            <h3 className="profile-name">{user.name}</h3>
            <p className="profile-edit">View Profile</p>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>

        <div className="profile-menu">
          {menuItems.map((item, i) => (
            <button
              key={i}
              className="profile-menu-item animate-fadeInUp"
              style={{ animationDelay: `${i * 0.04}s` }}
              onClick={() => item.path !== '#' ? navigate(item.path) : null}
              id={`profile-menu-${i}`}
            >
              <span className="profile-menu-icon">{item.icon}</span>
              <span className="profile-menu-label">{item.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          ))}
        </div>

        <button className="btn btn-outline mt-24" onClick={handleLogout} id="btn-logout" style={{ color: 'var(--primary-red)', borderColor: 'var(--primary-red)' }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
