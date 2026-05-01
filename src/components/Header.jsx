import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ title, showBack = true, rightAction = null }) {
  const navigate = useNavigate();

  return (
    <header className="header" id="app-header">
      <div className="header-left">
        {showBack && (
          <button className="header-back" onClick={() => navigate(-1)} id="btn-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        )}
      </div>
      <h1 className="header-title">{title}</h1>
      <div className="header-right">
        {rightAction}
      </div>
    </header>
  );
}
