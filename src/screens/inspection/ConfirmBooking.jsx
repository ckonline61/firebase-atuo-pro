import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import './Inspection.css';

export default function ConfirmBooking() {
  const navigate = useNavigate();
  const { state } = useApp();
  const { service, carDetails, pickupDetails } = state.currentBooking;

  const carName = `${carDetails.brand || 'Honda'} ${carDetails.model || 'City'}`;
  const carInfo = `${carDetails.year || '2018'} • ${carDetails.fuelType || 'Petrol'} • ${carDetails.kmDriven || '45,000'} KM`;

  return (
    <div className="screen screen-with-header" id="confirm-booking-screen">
      <Header title="Confirm Booking" />
      <div className="screen-content">
        <h3 className="section-label">Booking Summary</h3>
        <div className="booking-summary">
          <div className="summary-car">
            <div className="summary-car-icon">🚗</div>
            <div className="summary-car-info">
              <h4>{carName}</h4>
              <p>{carInfo}</p>
            </div>
          </div>
          <div className="summary-row">
            <span className="summary-label">Service</span>
            <span className="summary-value">{service?.name || 'Pre-Purchase Inspection'}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Date & Time</span>
            <span className="summary-value">{pickupDetails.date}, {pickupDetails.timeSlot || '11:00 AM'}</span>
          </div>
          <div className="summary-row" style={{ flexDirection: 'column', gap: 2 }}>
            <span className="summary-label">Location</span>
            <span className="summary-value" style={{ fontSize: 13, lineHeight: 1.5 }}>
              📍 {pickupDetails.location || 'Connaught Place, Delhi'}
            </span>
          </div>
          <div className="summary-price">
            <div>
              <p className="summary-price-label">Estimated Price</p>
              <p className="summary-price-note">Inclusive of all taxes</p>
            </div>
            <span className="summary-price-value">₹ {service?.price || 999}</span>
          </div>
        </div>

        <div className="trust-badges">
          <div className="trust-badge">
            <span className="trust-badge-icon">✅</span>
            Verified Mechanics
          </div>
          <div className="trust-badge">
            <span className="trust-badge-icon">💎</span>
            100% Transparent Pricing
          </div>
        </div>
      </div>
      <div className="bottom-action">
        <button className="btn btn-primary" onClick={() => navigate('/inspection/payment')} id="btn-proceed-payment">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
