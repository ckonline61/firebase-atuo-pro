import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carsForSale } from '../../data/mockData';
import Header from '../../components/Header';
import './BuyCars.css';

export default function BuyCarListing() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filters = ['All', 'Hatchback', 'Sedan', 'SUV'];

  const filtered = carsForSale.filter(car => {
    const matchesFilter = activeFilter === 'All' || car.category === activeFilter;
    const matchesSearch = !search || `${car.brand} ${car.model}`.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="screen screen-with-header" id="buy-cars-screen">
      <Header title="Buy Cars" showBack={false} rightAction={
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: 'var(--font-family)', fontWeight: 500 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14"/>
            <line x1="4" y1="10" x2="4" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12" y2="3"/>
            <line x1="20" y1="21" x2="20" y2="16"/>
            <line x1="20" y1="12" x2="20" y2="3"/>
          </svg>
          Filter
        </button>
      } />
      <div className="screen-content">
        <div className="acc-search mb-16">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by brand, model..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="acc-search-input"
          />
        </div>

        <div className="car-filters">
          {filters.map(f => (
            <button
              key={f}
              className={`car-filter-btn ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="car-listing">
          {filtered.map((car, i) => (
            <div
              key={car.id}
              className="car-list-card animate-fadeInUp"
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={() => navigate(`/buy-cars/${car.id}`)}
              id={`car-${car.id}`}
            >
              <div className="car-list-image">
                🚗
              </div>
              <div className="car-list-info">
                <div className="car-list-header">
                  <h4>{car.brand} {car.model} {car.year}</h4>
                  {car.verified && <span className="badge badge-green">✓ Verified</span>}
                </div>
                <p className="car-list-specs">
                  {car.variant} • {car.kmDriven.toLocaleString()} KM
                </p>
                <p className="car-list-price">
                  <span className="price-symbol">₹</span> {car.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
