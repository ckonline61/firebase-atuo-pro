import { useNavigate, useLocation } from 'react-router-dom';
import './Inspection.css';

export default function BookingConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.bookingId || 'AP24190S19001';

  return (
    <div className="confirmed-screen" id="booking-confirmed-screen">
      <div className="confirmed-check animate-scaleIn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
      <h1 className="confirmed-title animate-fadeInUp">Booking Confirmed!</h1>
      <p className="confirmed-subtitle animate-fadeInUp" style={{animationDelay: '0.1s'}}>
        Your inspection has been<br/>successfully booked.
      </p>
      <p className="confirmed-id animate-fadeInUp" style={{animationDelay: '0.2s'}}>
        Booking ID<br/>
        <span>{bookingId}</span>
      </p>
      <p className="confirmed-note animate-fadeInUp" style={{animationDelay: '0.3s'}}>
        We will assign a mechanic<br/>shortly and update you.
      </p>
      <div className="confirmed-buttons animate-fadeInUp" style={{animationDelay: '0.4s'}}>
        <button className="btn btn-primary" onClick={() => navigate('/bookings')} id="btn-view-booking">
          View Booking
        </button>
        <button className="confirmed-home-link" onClick={() => navigate('/home')} id="btn-go-home">
          Go to Home
        </button>
      </div>
    </div>
  );
}
