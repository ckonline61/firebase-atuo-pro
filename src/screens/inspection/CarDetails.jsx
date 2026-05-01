import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { fuelTypes, years } from '../../data/mockData';
import { useCarData } from '../../hooks/useCarData';
import Header from '../../components/Header';
import './Inspection.css';

export default function CarDetails() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const { brands: carBrands, models: carModels } = useCarData();
  const [form, setForm] = useState({
    brand: '', model: '', year: '', fuelType: '', kmDriven: ''
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'brand') setForm(prev => ({ ...prev, model: '' }));
  };

  const handleNext = () => {
    dispatch({ type: 'SET_CAR_DETAILS', payload: form });
    navigate('/inspection/pickup');
  };

  const isValid = form.brand && form.model && form.year && form.fuelType && form.kmDriven;

  return (
    <div className="screen screen-with-header" id="car-details-screen">
      <Header title="Car Details" />
      <div className="screen-content">
        <h3 className="section-label">Enter Car Details</h3>
        <div className="car-form">
          <div className="form-group">
            <label className="form-label">Car Brand</label>
            <select className="form-select" value={form.brand} onChange={e => handleChange('brand', e.target.value)} id="select-brand">
              <option value="">Select Brand</option>
              {carBrands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Car Model</label>
            <select className="form-select" value={form.model} onChange={e => handleChange('model', e.target.value)} id="select-model" disabled={!form.brand}>
              <option value="">Select Model</option>
              {(carModels[form.brand] || []).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Year of Manufacturing</label>
            <select className="form-select" value={form.year} onChange={e => handleChange('year', e.target.value)} id="select-year">
              <option value="">Select Year</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Fuel Type</label>
            <select className="form-select" value={form.fuelType} onChange={e => handleChange('fuelType', e.target.value)} id="select-fuel">
              <option value="">Select Fuel Type</option>
              {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Kilometers Driven (Approx.)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                className="form-input"
                placeholder="Enter Kilometers"
                value={form.kmDriven}
                onChange={e => handleChange('kmDriven', e.target.value)}
                id="input-km"
              />
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)', fontSize: 13 }}>KM</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-action">
        <button className="btn btn-primary" onClick={handleNext} disabled={!isValid} style={{ opacity: isValid ? 1 : 0.5 }} id="btn-next-car">
          Next
        </button>
      </div>
    </div>
  );
}
