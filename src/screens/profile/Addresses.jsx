import { useState } from 'react';
import Header from '../../components/Header';
import './ProfilePages.css';

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: 'Home',
    fullAddress: '',
    landmark: '',
    pincode: '',
    city: ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!newAddr.fullAddress || !newAddr.pincode || !newAddr.city) return;

    setAddresses([...addresses, { ...newAddr, id: Date.now() }]);
    setNewAddr({ label: 'Home', fullAddress: '', landmark: '', pincode: '', city: '' });
    setShowAdd(false);
  };

  const handleRemove = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const labelIcons = { Home: '🏠', Office: '🏢', Other: '📍' };

  return (
    <div className="screen screen-with-header" id="addresses-screen">
      <Header title="My Addresses" />
      <div className="screen-content">
        <button
          className="btn btn-outline mb-24 animate-fadeInUp"
          onClick={() => setShowAdd(!showAdd)}
          id="btn-add-address"
          style={{ color: 'var(--primary-red)', borderColor: 'var(--primary-red)' }}
        >
          {showAdd ? '✕ Cancel' : '+ Add New Address'}
        </button>

        {showAdd && (
          <form className="address-form card animate-fadeInUp mb-24" onSubmit={handleSave}>
            <div className="address-labels">
              {['Home', 'Office', 'Other'].map(label => (
                <button
                  type="button"
                  key={label}
                  className={`address-label-btn ${newAddr.label === label ? 'active' : ''}`}
                  onClick={() => setNewAddr({ ...newAddr, label })}
                >
                  {labelIcons[label]} {label}
                </button>
              ))}
            </div>
            <div className="form-group">
              <label className="form-label">Full Address *</label>
              <input
                type="text"
                className="form-input"
                placeholder="House No., Street, Area"
                value={newAddr.fullAddress}
                onChange={(e) => setNewAddr({ ...newAddr, fullAddress: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Landmark</label>
              <input
                type="text"
                className="form-input"
                placeholder="Near..."
                value={newAddr.landmark}
                onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">City *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Pincode *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Pincode"
                  maxLength="6"
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" id="btn-save-address">
              📍 Save Address
            </button>
          </form>
        )}

        {addresses.length === 0 && !showAdd ? (
          <div className="profile-empty-state animate-fadeInUp">
            <div className="profile-empty-icon">📍</div>
            <h3 className="profile-empty-title">No Saved Addresses</h3>
            <p className="profile-empty-text">
              Add your addresses for faster booking and delivery.
            </p>
          </div>
        ) : (
          <div className="profile-list">
            {addresses.map((addr, index) => (
              <div
                key={addr.id}
                className="address-card animate-fadeInUp"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="address-card-header">
                  <span className="address-type-badge">
                    {labelIcons[addr.label]} {addr.label}
                  </span>
                  <button className="saved-car-remove" onClick={() => handleRemove(addr.id)} title="Remove">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-red)" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                  </button>
                </div>
                <p className="address-full">{addr.fullAddress}</p>
                {addr.landmark && <p className="address-landmark">Near: {addr.landmark}</p>}
                <p className="address-city">{addr.city} - {addr.pincode}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
