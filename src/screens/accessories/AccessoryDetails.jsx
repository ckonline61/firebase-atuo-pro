import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { accessories } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import './Accessories.css';

export default function AccessoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [installToggle, setInstallToggle] = useState(true);
  
  const accessory = accessories.find(a => a.id === Number(id)) || accessories[0];

  const handleBuyNow = () => {
    navigate('/accessories/booking', { state: { accessory } });
  };

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: accessory });
    alert('Added to cart!');
  };

  return (
    <div className="screen screen-with-header" id="accessory-details-screen">
      <Header title={accessory.name} />
      <div className="acc-detail-image">
        {accessory.image}
      </div>
      <div className="screen-content">
        <div className="acc-detail-rating">
          <span>⭐</span>
          <span style={{ fontWeight: 600 }}>{accessory.rating}</span>
        </div>
        <div className="acc-detail-price">
          <span className="price">
            <span className="price-symbol">₹</span> {accessory.price.toLocaleString()}
          </span>
          <span className="price-old">₹ {accessory.originalPrice.toLocaleString()}</span>
          <span className="price-discount">{accessory.discount}% OFF</span>
        </div>

        <div className="acc-features">
          {accessory.features.map((feature, i) => (
            <div key={i} className="acc-feature">{feature}</div>
          ))}
        </div>

        {accessory.installAtLocation && (
          <div className="acc-install-toggle">
            <div>
              <p className="acc-install-label">Install at your location</p>
              <p className="text-small text-gray">Yes, I want installation</p>
            </div>
            <button
              className={`toggle-switch ${installToggle ? 'active' : ''}`}
              onClick={() => setInstallToggle(!installToggle)}
            ></button>
          </div>
        )}

        <div className="acc-detail-buttons">
          <button className="btn btn-outline" onClick={handleAddToCart} id="btn-add-cart">Add to Cart</button>
          <button className="btn btn-primary" onClick={handleBuyNow} id="btn-buy-now">Buy Now</button>
        </div>
      </div>
    </div>
  );
}
