import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accessoryCategories, accessories } from '../../data/mockData';
import Header from '../../components/Header';
import './Accessories.css';

export default function AccessoriesCategory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = search
    ? accessoryCategories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : accessoryCategories;

  return (
    <div className="screen screen-with-header" id="accessories-screen">
      <Header title="Accessories" showBack={true} />
      <div className="screen-content">
        <div className="acc-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search accessories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="acc-search-input"
          />
        </div>

        <div className="acc-grid">
          {filtered.map((cat, i) => {
            const catAccessories = accessories.filter(a => a.category === cat.name);
            return (
              <button
                key={cat.name}
                className="acc-category-card animate-fadeInUp"
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => {
                  if (catAccessories.length > 0) {
                    navigate(`/accessories/${catAccessories[0].id}`);
                  }
                }}
                id={`acc-cat-${i}`}
              >
                <span className="acc-category-icon">{cat.icon}</span>
                <span className="acc-category-name">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
