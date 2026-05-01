import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import './HomeScreen.css';
import '../screens/profile/ProfilePages.css';

const SUPPORT_NUMBER = '8839533202';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { isEnabled } = useFeatureFlags();
  const [location, setLocation] = useState(state.userLocation || 'Detecting location...');
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Auto-detect location on first load
  useEffect(() => {
    if (!state.userLocation) {
      detectLocation();
    }
  }, []);

  const detectLocation = () => {
    setLoadingLocation(true);
    
    if (!navigator.geolocation) {
      setLocation('Location not supported');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Google Maps Geocoding API se address lena
          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
          
          if (apiKey && !apiKey.includes('XXXX')) {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
            );
            const data = await response.json();
            
            if (data.status === 'OK' && data.results.length > 0) {
              // Get a short, readable address
              const result = data.results[0];
              let shortAddress = '';
              
              // Extract locality and city
              for (const component of result.address_components) {
                if (component.types.includes('sublocality_level_1') || component.types.includes('locality')) {
                  if (shortAddress) shortAddress += ', ';
                  shortAddress += component.long_name;
                }
              }
              
              if (!shortAddress) {
                shortAddress = result.formatted_address.split(',').slice(0, 2).join(',');
              }
              
              setLocation(shortAddress);
              dispatch({ type: 'SET_LOCATION', payload: shortAddress });
            } else {
              setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
          } else {
            // Without API key, use coordinates
            setLocation(`Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`);
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          setLocation('Location detected');
        }
        setLoadingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocation('Location permission denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocation('Location unavailable');
            break;
          default:
            setLocation('Could not detect location');
        }
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi! I need help from Auto Pro.');
    window.open(`https://wa.me/91${SUPPORT_NUMBER}?text=${message}`, '_blank');
  };

  const handleEmergency = (type) => {
    const messages = {
      'jump-starter': 'Hi! I need a Jump Starter service urgently. Please help!',
      'roadside': 'Hi! I need Road Side Assistance urgently. Please help!'
    };
    const message = encodeURIComponent(messages[type]);
    window.open(`https://wa.me/91${SUPPORT_NUMBER}?text=${message}`, '_blank');
  };

  const allServices = [
    { id: 'inspection', featureKey: 'inspection', name: 'Book\nInspection', emoji: '🔍', color: '#FFF3E0', path: '/inspection/service' },
    { id: 'buy', featureKey: 'buy_cars', name: 'Buy\nCar', emoji: '🚗', color: '#E3F2FD', path: '/buy-cars' },
    { id: 'sell', featureKey: 'sell_car', name: 'Sell\nCar', emoji: '💰', color: '#E8F5E9', path: '/sell-car' },
    { id: 'accessories', featureKey: 'accessories', name: 'Accessories', emoji: '🔧', color: '#F3E5F5', path: '/accessories' }
  ];
  const services = allServices.filter(s => isEnabled(s.featureKey));

  const whyChoose = [
    { icon: '✅', title: 'Verified Mechanics' },
    { icon: '💎', title: 'Transparent Pricing' },
    { icon: '⚡', title: 'Quick Service' },
    { icon: '❤️', title: 'Trusted by Thousands' }
  ];

  return (
    <div className="home-screen screen" id="home-screen">
      {/* Top Bar */}
      <div className="home-topbar">
        <div className="home-location" onClick={detectLocation} style={{ cursor: 'pointer' }}>
          <div className="home-location-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--primary-red)" stroke="var(--primary-red)" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3" fill="white"/>
            </svg>
          </div>
          <div>
            <p className="home-location-label">Your Location</p>
            <p className="home-location-text">
              {loadingLocation ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }}></span>
                  Detecting...
                </span>
              ) : (
                <>
                  {location}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </>
              )}
            </p>
          </div>
        </div>
        <button className="home-notification" id="btn-notification">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span className="notification-dot"></span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="home-search" id="search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input type="text" placeholder="Search cars, services..." className="home-search-input" />
      </div>

      {/* Service Cards */}
      <div className="home-services">
        {services.map((service, index) => (
          <button
            key={service.id}
            className="home-service-card animate-fadeInUp"
            style={{ animationDelay: `${index * 0.1}s`, background: service.color }}
            onClick={() => navigate(service.path)}
            id={`service-${service.id}`}
          >
            <span className="service-emoji">{service.emoji}</span>
            <span className="service-name">{service.name}</span>
          </button>
        ))}
      </div>

      {/* Emergency Section */}
      {isEnabled('emergency') && (
      <div className="home-emergency-section">
        <h3 className="home-section-title">🚨 Emergency Services</h3>
        <div className="emergency-grid">
          <button
            className="emergency-card jump-starter animate-fadeInUp"
            style={{ animationDelay: '0.2s' }}
            onClick={() => handleEmergency('jump-starter')}
            id="emergency-jump-starter"
          >
            <span className="emergency-emoji">🔋</span>
            <span className="emergency-name">Jump Starter</span>
            <span className="emergency-desc">Battery dead? We'll help!</span>
          </button>
          <button
            className="emergency-card roadside animate-fadeInUp"
            style={{ animationDelay: '0.25s' }}
            onClick={() => handleEmergency('roadside')}
            id="emergency-roadside"
          >
            <span className="emergency-emoji">🛣️</span>
            <span className="emergency-name">Road Side Assistance</span>
            <span className="emergency-desc">Stuck on road? Call us!</span>
          </button>
        </div>
      </div>
      )}

      {/* Why Choose Auto Pro */}
      <div className="home-why-section">
        <h3 className="home-section-title">Why Choose Auto Pro?</h3>
        <div className="home-why-grid">
          {whyChoose.map((item, index) => (
            <div key={index} className="home-why-item animate-fadeInUp" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
              <span className="why-icon">{item.icon}</span>
              <span className="why-title">{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      {isEnabled('whatsapp_support') && (
      <button
        className="whatsapp-float"
        onClick={handleWhatsApp}
        id="whatsapp-float-btn"
        aria-label="Chat on WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="whatsapp-float-tooltip">Chat with us</span>
      </button>
      )}
    </div>
  );
}
