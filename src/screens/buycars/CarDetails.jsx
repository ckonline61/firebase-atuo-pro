import { useParams, useNavigate } from 'react-router-dom';
import { carsForSale } from '../../data/mockData';
import Header from '../../components/Header';
import './BuyCars.css';

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = carsForSale.find(c => c.id === Number(id)) || carsForSale[0];

  return (
    <div className="screen screen-with-header" id="car-details-screen">
      <Header title="Car Details" rightAction={
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-700)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      } />
      <div className="car-detail-gallery">
        🚗
      </div>
      <div className="screen-content">
        <h2 className="car-detail-name">{car.brand} {car.model} {car.year} {car.variant}</h2>
        <div className="car-detail-price-section">
          <p className="car-detail-price">₹ {car.price.toLocaleString()}</p>
          <p className="car-detail-emi">EMI from ₹ {car.emi.toLocaleString()}/month</p>
        </div>

        <div className="car-specs-row">
          <div className="car-spec">
            <span className="car-spec-icon">📏</span>
            {car.kmDriven.toLocaleString()} KM
          </div>
          <div className="car-spec">
            <span className="car-spec-icon">⛽</span>
            {car.fuelType}
          </div>
          <div className="car-spec">
            <span className="car-spec-icon">⚙️</span>
            {car.transmission}
          </div>
        </div>

        <div className="car-owner-info">
          <div className="car-owner-item">
            <p className="car-owner-label">Owner</p>
            <p className="car-owner-value">{car.owner}</p>
          </div>
          <div className="car-owner-item">
            <p className="car-owner-label">Insurance</p>
            <p className="car-owner-value">{car.insurance}</p>
          </div>
        </div>

        <div className="car-detail-actions">
          <button className="btn btn-outline btn-sm" id="btn-schedule-visit">Schedule Visit</button>
          <button className="btn btn-primary btn-sm" id="btn-contact-seller">Contact Seller</button>
        </div>

        <div className="car-inspection-badge">
          <div>
            <p className="car-inspection-text">Auto Pro Inspection Report</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="car-inspection-score">{car.inspectionScore}</span>
            <span className="text-small text-gray">/10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
