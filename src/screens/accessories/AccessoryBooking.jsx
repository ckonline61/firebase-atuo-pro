import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { timeSlots } from '../../data/mockData';
import Header from '../../components/Header';
import './Accessories.css';

export default function AccessoryBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const accessory = location.state?.accessory || { name: 'Android Music System', price: 7999 };
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');
  const [pickupLocation] = useState('Connaught Place, Delhi');
  const [date] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  });

  return (
    <div className="screen screen-with-header" id="accessory-booking-screen">
      <Header title="Installation Details" />
      <div className="screen-content">
        <div className="form-group">
          <label className="form-label">Select Date</label>
          <div className="date-display">
            <p className="date-value">{date}</p>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Select Time Slot</label>
          <div className="time-slots">
            {timeSlots.map(slot => (
              <button
                key={slot}
                className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <div className="pickup-location">
            <span className="pickup-location-text">{pickupLocation}</span>
            <button className="pickup-change">Change</button>
          </div>
        </div>

        <div className="acc-booking-total">
          <div>
            <p className="acc-booking-total-label">Total Amount</p>
            <p className="acc-booking-expand">View Price Details ▾</p>
          </div>
          <p className="acc-booking-total-price">₹ {accessory.price.toLocaleString()}</p>
        </div>
      </div>
      <div className="bottom-action">
        <button className="btn btn-primary" onClick={() => navigate('/inspection/confirmed', { state: { bookingId: 'ACC' + Date.now().toString().slice(-8) } })} id="btn-proceed-acc-payment">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
