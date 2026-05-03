import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { timeSlots } from '../../data/mockData';
import Header from '../../components/Header';
import GoogleMap from '../../components/GoogleMap';
import './Inspection.css';

const RAIPUR_CENTER = { lat: 21.2514, lng: 81.6296 };
const RAIPUR_BOUNDS = {
  north: 21.43,
  south: 21.08,
  east: 81.82,
  west: 81.45
};
const DEFAULT_RAIPUR_LOCATION = 'Raipur, Chhattisgarh';
const SERVICE_UNAVAILABLE_MESSAGE = 'Service not available in your area. We currently serve Raipur, Chhattisgarh only.';

function isWithinRaipur({ lat, lng }) {
  return (
    lat >= RAIPUR_BOUNDS.south &&
    lat <= RAIPUR_BOUNDS.north &&
    lng >= RAIPUR_BOUNDS.west &&
    lng <= RAIPUR_BOUNDS.east
  );
}

export default function PickupDetails() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [location, setLocation] = useState(DEFAULT_RAIPUR_LOCATION);
  const [mapCenter, setMapCenter] = useState(RAIPUR_CENTER);
  const [locationError, setLocationError] = useState('');

  // Tomorrow as default date (YYYY-MM-DD format for input)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Min date = today, Max date = 30 days from now
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(tomorrowStr);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [addressDetails, setAddressDetails] = useState('');

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleLocationSelect = (loc) => {
    setLocation(loc.address);
    setMapCenter({ lat: loc.lat, lng: loc.lng });
    setLocationError(isWithinRaipur(loc) ? '' : SERVICE_UNAVAILABLE_MESSAGE);
  };

  const handleNext = () => {
    if (!isWithinRaipur(mapCenter)) {
      setLocationError(SERVICE_UNAVAILABLE_MESSAGE);
      return;
    }

    const fullLocation = addressDetails ? `${location} (${addressDetails})` : location;
    dispatch({ type: 'SET_PICKUP_DETAILS', payload: { location: fullLocation, date: formatDate(selectedDate), timeSlot: selectedSlot } });
    navigate('/inspection/confirm');
  };

  const isValid = selectedDate && selectedSlot && !locationError && isWithinRaipur(mapCenter);

  return (
    <div className="screen screen-with-header" id="pickup-details-screen">
      <Header title="Pickup Details" />
      <div className="screen-content">
        <h3 className="section-label">Select Location</h3>
        <GoogleMap
          center={mapCenter}
          zoom={15}
          height="160px"
          showSearch={true}
          showUserLocation={false}
          onLocationSelect={handleLocationSelect}
          searchBounds={RAIPUR_BOUNDS}
          searchPlaceholder="Search location in Raipur..."
          markers={[{ position: mapCenter, title: 'Pickup Location', label: location }]}
        />
        
        <div className="pickup-location" style={{ marginTop: 12 }}>
          <span className="pickup-location-text">{location}</span>
          <button className="pickup-change" onClick={() => {
            if (navigator.geolocation) {
              setLocation('Detecting...');
              navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                setMapCenter({ lat: latitude, lng: longitude });
                
                // Reverse geocode to get real address
                const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
                if (apiKey && !apiKey.includes('XXXX')) {
                  try {
                    const res = await fetch(
                      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
                    );
                    const data = await res.json();
                    if (data.status === 'OK' && data.results.length > 0) {
                      const addr = data.results[0].formatted_address;
                      setLocation(addr);
                    } else {
                      setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                    }
                  } catch {
                    setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                  }
                } else {
                  setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                }
                setLocationError(isWithinRaipur({ lat: latitude, lng: longitude }) ? '' : SERVICE_UNAVAILABLE_MESSAGE);
              }, () => {
                setLocation('Location access denied');
                setMapCenter(RAIPUR_CENTER);
                setLocationError('');
              });
            }
          }}>Use Current</button>
        </div>

        {locationError && (
          <p style={{
            marginTop: 8,
            padding: '10px 12px',
            borderRadius: 10,
            background: '#FEF2F2',
            color: '#DC2626',
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.4
          }}>
            {locationError}
          </p>
        )}

        <div className="form-group" style={{ marginTop: 12 }}>
          <label className="form-label">Additional Address Details</label>
          <input
            type="text"
            className="form-input"
            placeholder="Flat/House No., Floor, Building, Landmark..."
            value={addressDetails}
            onChange={(e) => setAddressDetails(e.target.value)}
            id="address-details"
          />
        </div>

        <h3 className="section-label" style={{ marginTop: 8 }}>Select Date</h3>
        <div className="date-picker-wrapper">
          <input
            type="date"
            className="date-picker-input"
            value={selectedDate}
            min={today}
            max={maxDateStr}
            onChange={(e) => setSelectedDate(e.target.value)}
            id="pickup-date"
          />
          <div className="date-picker-display">
            <div>
              <p className="date-label">📅 Selected Date</p>
              <p className="date-value">{selectedDate ? formatDate(selectedDate) : 'Tap to select date'}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-500)" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
        </div>

        <h3 className="section-label">Select Time Slot</h3>
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
      <div className="bottom-action">
        <button className="btn btn-primary" onClick={handleNext} disabled={!isValid} style={{ opacity: isValid ? 1 : 0.5 }} id="btn-next-pickup">
          Next
        </button>
      </div>
    </div>
  );
}
