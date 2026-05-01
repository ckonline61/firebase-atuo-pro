import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import './ProfilePages.css';

export default function SavedCars() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const savedCars = state.savedCars || [];

  const handleRemove = (carId) => {
    dispatch({ type: 'REMOVE_SAVED_CAR', payload: carId });
  };

  return (
    <div className="screen screen-with-header" id="saved-cars-screen">
      <Header title="Saved Cars" />
      <div className="screen-content">
        {savedCars.length === 0 ? (
          <div className="profile-empty-state animate-fadeInUp">
            <div className="profile-empty-icon">❤️</div>
            <h3 className="profile-empty-title">No Saved Cars</h3>
            <p className="profile-empty-text">
              Cars you save while browsing will appear here. Start exploring now!
            </p>
            <button
              className="btn btn-primary mt-24"
              onClick={() => navigate('/buy-cars')}
              id="btn-browse-cars"
            >
              🚗 Browse Cars
            </button>
          </div>
        ) : (
          <div className="profile-list">
            {savedCars.map((car, index) => (
              <div
                key={car.id || index}
                className="profile-list-card animate-fadeInUp"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {car.image ? (
                  <img src={car.image} alt={car.name} className="profile-list-img" />
                ) : (
                  <div className="profile-list-img-placeholder">🚗</div>
                )}
                <div className="profile-list-info">
                  <h4 className="profile-list-name">{car.name}</h4>
                  <p className="profile-list-meta">{car.year} • {car.fuel} • {car.km}</p>
                  <p className="profile-list-price">₹{car.price}</p>
                </div>
                <button
                  className="saved-car-remove"
                  onClick={() => handleRemove(car.id)}
                  title="Remove"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--primary-red)" stroke="var(--primary-red)" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
