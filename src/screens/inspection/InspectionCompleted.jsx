import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './Inspection.css';

export default function InspectionCompleted() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('Great service! Mechanic was polite and very professional.');

  return (
    <div className="screen screen-with-header" id="inspection-completed-screen">
      <Header title="Inspection Completed" />
      <div className="screen-content">
        <div className="review-section">
          <h3 className="review-title">How was your experience?</h3>
          <div className="stars">
            {[1,2,3,4,5].map(star => (
              <span
                key={star}
                className={`star ${star <= rating ? 'filled' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <label className="form-label">Write a review (optional)</label>
        <textarea
          className="review-textarea"
          value={review}
          onChange={e => setReview(e.target.value)}
          placeholder="Write your review..."
          id="review-text"
        />

        <label className="form-label">Add Photos (optional)</label>
        <div className="review-photos">
          <div className="review-photo-add">+</div>
        </div>

        <button className="btn btn-primary mt-24" onClick={() => navigate('/inspection/report/demo')} id="btn-submit-review">
          Submit Review
        </button>
        <button
          className="btn btn-secondary mt-12"
          onClick={() => navigate('/inspection/report/demo')}
          id="btn-view-report"
        >
          View Report
        </button>
      </div>
    </div>
  );
}
