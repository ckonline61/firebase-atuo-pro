import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carsForSale } from '../../data/mockData';
import Header from '../../components/Header';
import './BuyCars.css';

export default function BuyCarListing() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [priceRange, setPriceRange] = useState('All');
  const [fuelFilter, setFuelFilter] = useState('All');
  const [transmissionFilter, setTransmissionFilter] = useState('All');

  const filters = ['All', 'Hatchback', 'Sedan', 'SUV'];
  const priceRanges = [
    { label: 'All', min: 0, max: Infinity },
    { label: 'Under ₹5L', min: 0, max: 500000 },
    { label: '₹5L - ₹10L', min: 500000, max: 1000000 },
    { label: 'Above ₹10L', min: 1000000, max: Infinity }
  ];
  const fuels = ['All', 'Petrol', 'Diesel', 'CNG', 'Electric'];
  const transmissions = ['All', 'Manual', 'Automatic'];

  const filtered = carsForSale.filter(car => {
    const matchesCategory = activeFilter === 'All' || car.category === activeFilter;
    const matchesSearch = !search || `${car.brand} ${car.model}`.toLowerCase().includes(search.toLowerCase());
    const priceObj = priceRanges.find(p => p.label === priceRange) || priceRanges[0];
    const matchesPrice = car.price >= priceObj.min && car.price < priceObj.max;
    const matchesFuel = fuelFilter === 'All' || car.fuelType === fuelFilter;
    const matchesTrans = transmissionFilter === 'All' || car.transmission === transmissionFilter;
    return matchesCategory && matchesSearch && matchesPrice && matchesFuel && matchesTrans;
  });

  const activeFiltersCount = [priceRange, fuelFilter, transmissionFilter].filter(f => f !== 'All').length;

  const clearAllFilters = () => {
    setActiveFilter('All');
    setPriceRange('All');
    setFuelFilter('All');
    setTransmissionFilter('All');
    setShowFilterPanel(false);
  };

  return (
    <div className="screen screen-with-header" id="buy-cars-screen">
      <Header title="Buy Cars" rightAction={
        <button
          className="filter-header-btn"
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          style={{
            background: activeFiltersCount > 0 ? 'var(--primary-red)' : 'none',
            color: activeFiltersCount > 0 ? 'white' : 'var(--gray-700)',
            border: activeFiltersCount > 0 ? 'none' : '1.5px solid var(--gray-300)',
            borderRadius: 20, padding: '6px 12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontFamily: 'var(--font-family)', fontWeight: 600
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
            <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
          </svg>
          Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>
      } />
      <div className="screen-content">
        <div className="acc-search mb-16">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by brand, model..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="acc-search-input"
          />
        </div>

        {/* Category Filters */}
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

        {/* Advanced Filter Panel */}
        {showFilterPanel && (
          <div className="filter-panel animate-fadeInUp">
            <div className="filter-panel-header">
              <h4>Filters</h4>
              <button className="filter-clear-btn" onClick={clearAllFilters}>Clear All</button>
            </div>

            <div className="filter-group">
              <p className="filter-group-title">💰 Price Range</p>
              <div className="filter-chips">
                {priceRanges.map(p => (
                  <button key={p.label}
                    className={`filter-chip ${priceRange === p.label ? 'active' : ''}`}
                    onClick={() => setPriceRange(p.label)}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <p className="filter-group-title">⛽ Fuel Type</p>
              <div className="filter-chips">
                {fuels.map(f => (
                  <button key={f}
                    className={`filter-chip ${fuelFilter === f ? 'active' : ''}`}
                    onClick={() => setFuelFilter(f)}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <p className="filter-group-title">⚙️ Transmission</p>
              <div className="filter-chips">
                {transmissions.map(t => (
                  <button key={t}
                    className={`filter-chip ${transmissionFilter === t ? 'active' : ''}`}
                    onClick={() => setTransmissionFilter(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn mt-12" onClick={() => setShowFilterPanel(false)}
              style={{ width: '100%' }}>
              Show {filtered.length} Cars
            </button>
          </div>
        )}

        {/* Results Count */}
        <p className="car-result-count">{filtered.length} cars found</p>

        <div className="car-listing">
          {filtered.length === 0 ? (
            <div className="profile-empty-state">
              <div className="profile-empty-icon">🔍</div>
              <p className="profile-empty-title">No cars found</p>
              <p className="profile-empty-text">Try changing your filters or search</p>
              <button className="btn btn-secondary mt-16" onClick={clearAllFilters}>Clear Filters</button>
            </div>
          ) : (
            filtered.map((car, i) => (
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
                    {car.variant} • {car.kmDriven.toLocaleString()} KM • {car.fuelType} • {car.transmission}
                  </p>
                  <p className="car-list-price">
                    <span className="price-symbol">₹</span> {car.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
