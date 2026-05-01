import { NavLink, useLocation } from 'react-router-dom';
import './BottomNav.css';

export default function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/home', label: 'Home', icon: 'home' },
    { path: '/bookings', label: 'My Bookings', icon: 'bookings' },
    { path: '/buy-cars', label: 'Marketplace', icon: 'marketplace' },
    { path: '/profile', label: 'Profile', icon: 'profile' }
  ];

  // Hide on splash, login, onboarding
  const hideOn = ['/', '/login', '/onboarding'];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <nav className="bottom-nav" id="bottom-nav">
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          id={`nav-${item.icon}`}
        >
          <span className="bottom-nav-icon">
            {item.icon === 'home' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            )}
            {item.icon === 'bookings' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            )}
            {item.icon === 'marketplace' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            )}
            {item.icon === 'profile' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            )}
          </span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
