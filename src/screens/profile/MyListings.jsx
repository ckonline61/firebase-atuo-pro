import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import './ProfilePages.css';

export default function MyListings() {
  const navigate = useNavigate();
  const { state } = useApp();
  const listings = state.userListings || [];

  return (
    <div className="screen screen-with-header" id="my-listings-screen">
      <Header title="My Listings" />
      <div className="screen-content">
        {listings.length === 0 ? (
          <div className="profile-empty-state animate-fadeInUp">
            <div className="profile-empty-icon">📝</div>
            <h3 className="profile-empty-title">No Listings Yet</h3>
            <p className="profile-empty-text">
              You haven't listed any cars for sale yet. Start selling your car today!
            </p>
            <button
              className="btn btn-primary mt-24"
              onClick={() => navigate('/sell-car')}
              id="btn-sell-car"
            >
              💰 Sell Your Car
            </button>
          </div>
        ) : (
          <div className="profile-list">
            {listings.map((car, index) => (
              <div
                key={index}
                className="profile-list-card animate-fadeInUp"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {car.photos && car.photos.length > 0 ? (
                  <img src={car.photos[0]} alt={car.carName || 'Car'} className="profile-list-img" />
                ) : (
                  <div className="profile-list-img-placeholder">🚗</div>
                )}
                <div className="profile-list-info">
                  <h4 className="profile-list-name">{car.carName || `${car.brand} ${car.model}`}</h4>
                  <p className="profile-list-meta">{car.year} • {car.fuelType} • {car.kmDriven} km</p>
                  <p className="profile-list-price">₹{Number(car.expectedPrice).toLocaleString('en-IN')}</p>
                </div>
                <span className={`badge ${car.status === 'active' ? 'badge-green' : 'badge-orange'}`}>
                  {car.status || 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
