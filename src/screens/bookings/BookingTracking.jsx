import { useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import GoogleMap from '../../components/GoogleMap';
import './Bookings.css';

export default function BookingTracking() {
  const { id } = useParams();
  const { state } = useApp();
  const booking = state.bookings.find(b => b.id === id) || state.bookings[0] || {};

  // Simulated mechanic location (slightly offset from customer)
  const customerLocation = { lat: 28.6328, lng: 77.2197 };
  const mechanicLocation = { lat: 28.6410, lng: 77.2250 };

  const markers = [
    { 
      position: customerLocation, 
      title: 'Your Location', 
      label: '📍 You',
      icon: undefined
    },
    { 
      position: mechanicLocation, 
      title: 'Mechanic', 
      label: '👨‍🔧 Rohit Sharma - 12 min away'
    }
  ];

  return (
    <div className="screen screen-with-header" id="booking-tracking-screen">
      <Header title="Booking Tracking" />
      <div className="screen-content">
        <p className="booking-card-id" style={{ marginBottom: 4 }}>{booking.id}</p>
        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>{booking.service || 'Pre-Purchase Inspection'}</h4>

        <div className="tracking-status">
          <span className="tracking-status-dot"></span>
          <span className="tracking-status-text">Mechanic On The Way</span>
        </div>

        <div className="tracking-eta">
          <p className="tracking-eta-label">Arriving in</p>
          <p>
            <span className="tracking-eta-time">12</span>
            <span className="tracking-eta-unit">min</span>
          </p>
        </div>

        <div className="mechanic-card">
          <div className="mechanic-avatar">👨‍🔧</div>
          <div className="mechanic-info">
            <p className="mechanic-name">{booking.mechanicName || 'Rohit Sharma'}</p>
            <p className="mechanic-rating">
              ⭐ {booking.mechanicRating || 4.8} • {booking.mechanicJobs || 125} jobs
            </p>
            <p className="mechanic-vehicle">{booking.mechanicVehicle || 'Maruti Ertiga - DL 12 AB 1234'}</p>
          </div>
          <div className="mechanic-actions">
            <button className="mechanic-action-btn">📞</button>
            <button className="mechanic-action-btn">💬</button>
          </div>
        </div>

        <GoogleMap
          center={{ lat: 28.6370, lng: 77.2220 }}
          zoom={14}
          height="220px"
          markers={markers}
          showUserLocation={true}
        />
      </div>
    </div>
  );
}
