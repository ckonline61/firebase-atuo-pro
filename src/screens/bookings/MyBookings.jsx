import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useApp } from '../../context/AppContext';
import { db } from '../../config/firebase';
import Header from '../../components/Header';
import './Bookings.css';

export default function MyBookings() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [remoteBookings, setRemoteBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadBookings() {
      if (!state.user?.uid) {
        setRemoteBookings([]);
        return;
      }

      setLoading(true);
      try {
        const q = query(collection(db, 'bookings'), where('userId', '==', state.user.uid));
        const snap = await getDocs(q);
        const items = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
            const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
            return bTime - aTime;
          });

        if (!cancelled) setRemoteBookings(items);
      } catch (error) {
        console.error('Bookings load error:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBookings();
    return () => {
      cancelled = true;
    };
  }, [state.user?.uid]);

  const allBookings = remoteBookings.length > 0 ? remoteBookings : state.bookings;
  const upcoming = allBookings.filter(b => b.status !== 'completed');
  const past = allBookings.filter(b => b.status === 'completed');
  const bookings = activeTab === 'upcoming' ? upcoming : past;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'mechanic_assigned': return <span className="badge badge-green">Mechanic Assigned</span>;
      case 'in_progress': return <span className="badge badge-orange">In Progress</span>;
      case 'completed': return <span className="badge badge-blue">Completed</span>;
      default: return <span className="badge badge-orange">Pending</span>;
    }
  };

  return (
    <div className="screen screen-with-header" id="my-bookings-screen">
      <Header title="My Bookings" showBack={false} />
      <div className="screen-content">
        <div className="tabs mb-16">
          <button className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
            Upcoming
          </button>
          <button className={`tab ${activeTab === 'past' ? 'active' : ''}`} onClick={() => setActiveTab('past')}>
            Past
          </button>
        </div>

        <div className="bookings-list">
          {loading ? (
            <div className="empty-state">
              <span className="empty-icon">...</span>
              <p>Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">No</span>
              <p>No {activeTab} bookings</p>
            </div>
          ) : (
            bookings.map((booking, i) => (
              <div
                key={booking.id}
                className="booking-card animate-fadeInUp"
                style={{ animationDelay: `${i * 0.1}s` }}
                onClick={() => navigate('/bookings/tracking/' + booking.id)}
                id={`booking-${booking.id}`}
              >
                <div className="booking-card-header">
                  <span className="booking-card-id">{booking.id}</span>
                  {getStatusBadge(booking.status)}
                </div>
                <h4 className="booking-card-service">{booking.service}</h4>
                <p className="booking-card-car">{booking.car}</p>
                <div className="booking-card-details">
                  <span>{booking.date}</span>
                  <span>{booking.location}</span>
                </div>
                {booking.reportStatus === 'ready' || booking.inspectionReport ? (
                  <button
                    className="booking-report-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/inspection/report/' + booking.id);
                    }}
                  >
                    View Inspection Report
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
