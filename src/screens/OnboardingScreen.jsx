import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingScreen.css';

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      title: 'All Car Services in One App',
      desc: 'Inspection, Accessories, Buy & Sell Cars – All at your fingertips.',
      emoji: '🚗'
    },
    {
      title: 'Expert Car Inspection',
      desc: 'Get your car inspected by verified mechanics at your doorstep.',
      emoji: '🔍'
    },
    {
      title: 'Best Deals on Cars',
      desc: 'Buy verified used cars and sell your car at the best price.',
      emoji: '💰'
    }
  ];

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="onboarding-screen" id="onboarding-screen">
      <button className="onboarding-skip" onClick={() => navigate('/home')} id="btn-skip">
        Skip
      </button>
      
      <div className="onboarding-content">
        <div className="onboarding-image animate-scaleIn" key={current}>
          <span className="onboarding-emoji">{slides[current].emoji}</span>
        </div>
        
        <div className="onboarding-text animate-fadeInUp" key={`text-${current}`}>
          <h2>{slides[current].title}</h2>
          <p>{slides[current].desc}</p>
        </div>

        <div className="onboarding-dots">
          {slides.map((_, i) => (
            <span key={i} className={`onboarding-dot ${i === current ? 'active' : ''}`} />
          ))}
        </div>
      </div>

      <button className="onboarding-next" onClick={handleNext} id="btn-onboarding-next">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
}
