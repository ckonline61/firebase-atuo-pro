import { useState } from 'react';
import Header from '../../components/Header';
import './ProfilePages.css';

export default function PaymentMethods() {
  const [cards, setCards] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '', type: 'visa' });

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCard.number || !newCard.name || !newCard.expiry) return;
    
    const masked = '•••• •••• •••• ' + newCard.number.slice(-4);
    setCards([...cards, { ...newCard, number: masked, id: Date.now() }]);
    setNewCard({ number: '', name: '', expiry: '', type: 'visa' });
    setShowAdd(false);
  };

  const handleRemoveCard = (id) => {
    setCards(cards.filter(c => c.id !== id));
  };

  return (
    <div className="screen screen-with-header" id="payment-methods-screen">
      <Header title="Payment Methods" />
      <div className="screen-content">
        {/* UPI Section */}
        <div className="payment-section animate-fadeInUp">
          <h4 className="payment-section-title">UPI</h4>
          <div className="payment-option-card">
            <div className="payment-option-icon">📱</div>
            <div className="payment-option-info">
              <p className="payment-option-name">Google Pay / PhonePe / Paytm</p>
              <p className="payment-option-desc">Pay using any UPI app</p>
            </div>
            <span className="badge badge-green">Available</span>
          </div>
        </div>

        {/* Cards Section */}
        <div className="payment-section animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="payment-section-header">
            <h4 className="payment-section-title">Saved Cards</h4>
            <button className="payment-add-btn" onClick={() => setShowAdd(!showAdd)}>
              {showAdd ? '✕ Cancel' : '+ Add Card'}
            </button>
          </div>

          {showAdd && (
            <form className="payment-add-form animate-fadeInUp" onSubmit={handleAddCard}>
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="1234 5678 9012 3456"
                  maxLength="16"
                  value={newCard.number}
                  onChange={(e) => setNewCard({ ...newCard, number: e.target.value.replace(/\D/g, '') })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Card Holder Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Name on card"
                  value={newCard.name}
                  onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Expiry</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={newCard.type}
                    onChange={(e) => setNewCard({ ...newCard, type: e.target.value })}
                  >
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="rupay">RuPay</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" id="btn-save-card">
                💳 Save Card
              </button>
            </form>
          )}

          {cards.length === 0 && !showAdd ? (
            <div className="payment-empty">
              <p className="text-gray text-small">No saved cards. Add one for faster payments.</p>
            </div>
          ) : (
            <div className="profile-list">
              {cards.map((card, index) => (
                <div key={card.id} className="payment-card-item animate-fadeInUp" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="payment-card-icon">
                    {card.type === 'visa' ? '💳' : card.type === 'mastercard' ? '💳' : '💳'}
                  </div>
                  <div className="payment-option-info">
                    <p className="payment-option-name">{card.number}</p>
                    <p className="payment-option-desc">{card.name} • Expires {card.expiry}</p>
                  </div>
                  <button className="saved-car-remove" onClick={() => handleRemoveCard(card.id)} title="Remove">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-red)" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cash on Delivery */}
        <div className="payment-section animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <h4 className="payment-section-title">Other</h4>
          <div className="payment-option-card">
            <div className="payment-option-icon">💵</div>
            <div className="payment-option-info">
              <p className="payment-option-name">Cash on Service</p>
              <p className="payment-option-desc">Pay after service completion</p>
            </div>
            <span className="badge badge-green">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
