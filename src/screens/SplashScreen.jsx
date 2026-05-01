import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen" id="splash-screen">
      <div className="splash-content">
        <div className="splash-logo animate-scaleIn">
          <img src="/logo.png" alt="Auto Pro" />
        </div>
        <div className="splash-text animate-fadeInUp">
          <p className="splash-tagline">Smart Car Inspection</p>
          <p className="splash-tagline">& Deals at Your Doorstep</p>
        </div>
        <div className="splash-dots">
          <span className="splash-dot active"></span>
          <span className="splash-dot"></span>
          <span className="splash-dot"></span>
        </div>
      </div>
    </div>
  );
}
