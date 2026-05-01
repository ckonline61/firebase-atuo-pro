import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fuelTypes, years } from '../../data/mockData';
import { useCarData } from '../../hooks/useCarData';
import Header from '../../components/Header';
import '../buycars/BuyCars.css';

export default function SellCar() {
  const navigate = useNavigate();
  const { brands: carBrands, models: carModels } = useCarData();
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({
    brand: '', model: '', year: '', fuelType: '', price: '', kmDriven: '', description: ''
  });
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const steps = [
    { num: 1, label: 'Photos' },
    { num: 2, label: 'Details' },
    { num: 3, label: 'Review' }
  ];

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Max 10 MB`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos(prev => [...prev, { 
          url: event.target.result, 
          name: file.name,
          id: Date.now() + Math.random()
        }]);
      };
      reader.readAsDataURL(file);
    });
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const removePhoto = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'brand') setForm(prev => ({ ...prev, model: '' }));
  };

  const canProceedStep1 = photos.length >= 1; // Minimum 1 photo for testing, ideally 5
  const canProceedStep2 = form.brand && form.model && form.year && form.price;

  return (
    <div className="screen screen-with-header" id="sell-car-screen">
      <Header title="Sell Your Car" />
      <div className="screen-content">
        <div className="sell-steps">
          {steps.map((s, i) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
              <div className={`sell-step ${step === s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}>
                <div className="sell-step-circle">
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className="sell-step-label">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`sell-step-line ${step > s.num ? 'active' : ''}`}></div>
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fadeInUp">
            <h3 className="section-label">Upload Photos</h3>
            <p className="text-small text-gray mb-16">Add photos of your car (minimum 1)</p>
            
            {/* Hidden file inputs */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
              id="gallery-input"
            />
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
              id="camera-input"
            />

            {/* Upload buttons */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button 
                className="sell-upload" 
                style={{ flex: 1, padding: '24px 12px' }}
                onClick={() => cameraInputRef.current.click()}
              >
                <div className="sell-upload-icon">📷</div>
                <p className="sell-upload-text">Camera</p>
                <p className="sell-upload-hint">Take a photo</p>
              </button>
              <button 
                className="sell-upload" 
                style={{ flex: 1, padding: '24px 12px' }}
                onClick={() => fileInputRef.current.click()}
              >
                <div className="sell-upload-icon">🖼️</div>
                <p className="sell-upload-text">Gallery</p>
                <p className="sell-upload-hint">Choose from gallery</p>
              </button>
            </div>

            {/* Photo previews */}
            {photos.length > 0 && (
              <div>
                <p className="text-small fw-600 mb-8">{photos.length} photo(s) added</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {photos.map((photo) => (
                    <div key={photo.id} style={{ position: 'relative', width: 80, height: 80, borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--gray-200)' }}>
                      <img 
                        src={photo.url} 
                        alt={photo.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <button 
                        onClick={() => removePhoto(photo.id)}
                        style={{
                          position: 'absolute', top: 2, right: 2,
                          width: 20, height: 20, borderRadius: '50%',
                          background: 'rgba(0,0,0,0.6)', color: 'white',
                          border: 'none', fontSize: 12, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >✕</button>
                    </div>
                  ))}
                  {/* Add more button */}
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    style={{ 
                      width: 80, height: 80, borderRadius: 10,
                      border: '2px dashed var(--gray-300)', background: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, color: 'var(--gray-400)', cursor: 'pointer'
                    }}
                  >+</button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="animate-fadeInUp">
            <h3 className="section-label">Car Details</h3>
            <div className="car-form">
              <div className="form-group">
                <label className="form-label">Car Brand</label>
                <select className="form-select" value={form.brand} onChange={e => handleChange('brand', e.target.value)}>
                  <option value="">Select Brand</option>
                  {carBrands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Car Model</label>
                <select className="form-select" value={form.model} onChange={e => handleChange('model', e.target.value)} disabled={!form.brand}>
                  <option value="">Select Model</option>
                  {(carModels[form.brand] || []).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <select className="form-select" value={form.year} onChange={e => handleChange('year', e.target.value)}>
                  <option value="">Select Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fuel Type</label>
                <select className="form-select" value={form.fuelType} onChange={e => handleChange('fuelType', e.target.value)}>
                  <option value="">Select Fuel Type</option>
                  {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Expected Price (₹)</label>
                <input type="number" className="form-input" placeholder="Enter your expected price" value={form.price} onChange={e => handleChange('price', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">KM Driven</label>
                <input type="number" className="form-input" placeholder="Enter kilometers driven" value={form.kmDriven} onChange={e => handleChange('kmDriven', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea className="review-textarea" placeholder="Describe your car condition, features, etc." value={form.description} onChange={e => handleChange('description', e.target.value)} style={{ minHeight: 80 }} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fadeInUp">
            <h3 className="section-label">Review Your Listing</h3>
            
            {/* Photo preview */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
              {photos.map((photo) => (
                <img key={photo.id} src={photo.url} alt="" style={{ width: 100, height: 75, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
              ))}
            </div>

            <div className="booking-summary">
              <h4 style={{ fontSize: 16, marginBottom: 12 }}>{form.brand} {form.model} {form.year}</h4>
              <div className="summary-row">
                <span className="summary-label">Fuel Type</span>
                <span className="summary-value">{form.fuelType || '-'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">KM Driven</span>
                <span className="summary-value">{form.kmDriven ? `${Number(form.kmDriven).toLocaleString()} KM` : '-'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Expected Price</span>
                <span className="summary-value" style={{ fontWeight: 700, fontSize: 16 }}>₹ {form.price ? Number(form.price).toLocaleString() : '-'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Photos</span>
                <span className="summary-value">{photos.length} uploaded</span>
              </div>
              {form.description && (
                <div style={{ paddingTop: 12, borderTop: '1px solid var(--gray-200)', marginTop: 8 }}>
                  <p className="summary-label" style={{ marginBottom: 4 }}>Description</p>
                  <p style={{ fontSize: 13, color: 'var(--gray-700)' }}>{form.description}</p>
                </div>
              )}
            </div>
            
            <p className="text-small text-gray mt-8" style={{ textAlign: 'center' }}>
              Your car listing will be reviewed and published within 24 hours.
            </p>
          </div>
        )}
      </div>
      <div className="bottom-action">
        <div style={{ display: 'flex', gap: 12 }}>
          {step > 1 && (
            <button className="btn btn-outline" onClick={() => setStep(step - 1)} style={{ flex: '0 0 auto', width: 'auto', padding: '14px 20px' }}>
              Back
            </button>
          )}
          {step < 3 ? (
            <button 
              className="btn btn-primary" 
              onClick={() => setStep(step + 1)} 
              disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
              style={{ opacity: (step === 1 ? canProceedStep1 : canProceedStep2) ? 1 : 0.5 }}
              id="btn-next-sell"
            >
              Next
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => {
              alert('🎉 Car listed successfully! It will be published within 24 hours.');
              navigate('/home');
            }} id="btn-submit-listing">
              Submit Listing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
