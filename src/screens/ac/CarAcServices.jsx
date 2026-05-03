import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { carAcServices } from '../../data/mockData';
import Header from '../../components/Header';
import '../inspection/Inspection.css';

export default function CarAcServices() {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleSelect = (service) => {
    dispatch({
      type: 'SET_SERVICE',
      payload: {
        ...service,
        category: 'car_ac_service',
      },
    });
    navigate('/inspection/car-details');
  };

  return (
    <div className="screen screen-with-header" id="car-ac-service-screen">
      <Header title="Car AC Services" />
      <div className="screen-content">
        <h3 className="section-label">Select AC Service</h3>
        <div className="service-list">
          {carAcServices.map((service, i) => (
            <button
              key={service.id}
              className="service-item animate-fadeInUp"
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={() => handleSelect(service)}
              id={`ac-service-${service.id}`}
            >
              <div className="service-item-icon service-item-icon-text">{service.icon}</div>
              <div className="service-item-info">
                <h4>{service.name}</h4>
                <p>{service.description}</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
