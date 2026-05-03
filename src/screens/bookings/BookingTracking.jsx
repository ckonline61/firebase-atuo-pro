import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { useApp } from '../../context/AppContext';
import { db } from '../../config/firebase';
import Header from '../../components/Header';
import './Bookings.css';

const defaultTimeline = [
  {
    title: 'Booking received',
    note: 'Your request has been received by Auto Pro.',
  },
];

export default function BookingTracking() {
  const { id } = useParams();
  const { state } = useApp();
  const fallbackBooking = state.bookings.find(b => b.id === id) || state.bookings[0] || {};
  const [booking, setBooking] = useState(fallbackBooking);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return undefined;

    const unsub = onSnapshot(
      doc(db, 'bookings', id),
      (snap) => {
        if (snap.exists()) {
          setBooking({ id: snap.id, ...snap.data() });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Tracking load error:', error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [id]);

  const timeline = booking.trackingUpdates?.length ? booking.trackingUpdates : defaultTimeline;

  return (
    <div className="screen screen-with-header" id="booking-tracking-screen">
      <Header title="Booking Tracking" />
      <div className="screen-content">
        <p className="booking-card-id" style={{ marginBottom: 4 }}>{booking.id || id}</p>
        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
          {booking.service || 'Pre-Purchase Inspection'}
        </h4>

        {loading && <p className="tracking-muted">Loading latest tracking...</p>}

        <div className="tracking-summary-card">
          <p className="tracking-summary-label">Current Status</p>
          <h3>{booking.currentTrackingStatus || booking.status || 'Booking received'}</h3>
          <p>{booking.currentTrackingNote || 'We will update this booking shortly.'}</p>
        </div>

        <div className="mechanic-card">
          <div className="mechanic-avatar">ME</div>
          <div className="mechanic-info">
            <p className="mechanic-name">{booking.mechanicName || 'Mechanic not assigned yet'}</p>
            <p className="mechanic-rating">{booking.mechanicPhone || 'Admin will assign a mechanic soon'}</p>
            <p className="mechanic-vehicle">{booking.mechanicVehicle || ''}</p>
          </div>
        </div>

        <div className="tracking-timeline">
          {timeline.map((item, index) => (
            <div className="tracking-timeline-item" key={`${item.title}-${index}`}>
              <div className="tracking-timeline-dot"></div>
              <div className="tracking-timeline-content">
                <h4>{item.title}</h4>
                {item.note && <p>{item.note}</p>}
                {item.time && <span>{item.time}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
