import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import './Bookings.css';

export default function MyBookings() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcoming = state.bookings.filter(b => b.status !== 'completed');
  const past = state.bookings.filter(b => b.status === 'completed');
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
          {bookings.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p>No {activeTab} bookings</p>
            </div>
          ) : (
            bookings.map((booking, i) => (
              <div
                key={booking.id}
                className="booking-card animate-fadeInUp"
                style={{ animationDelay: `${i * 0.1}s` }}
                onClick={() => {
                  if (booking.status === 'completed') {
                    navigate('/inspection/review/' + booking.id);
                  } else {
                    navigate('/bookings/tracking/' + booking.id);
                  }
                }}
                id={`booking-${booking.id}`}
              >
                <div className="booking-card-header">
                  <span className="booking-card-id">{booking.id}</span>
                  {getStatusBadge(booking.status)}
                </div>
                <h4 className="booking-card-service">{booking.service}</h4>
                <p className="booking-card-car">{booking.car}</p>
                <div className="booking-card-details">
                  <span>📅 {booking.date}</span>
                  <span>📍 {booking.location}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
