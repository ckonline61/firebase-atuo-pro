import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import Header from '../../components/Header';
import { db } from '../../config/firebase';
import './Inspection.css';

export default function InspectionCompleted() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmitReview = async () => {
    setSaving(true);
    setMessage('');

    try {
      if (id && id !== 'demo') {
        await updateDoc(doc(db, 'bookings', id), {
          customerReview: {
            rating,
            review: review.trim(),
            createdAt: serverTimestamp(),
          },
          updatedAt: serverTimestamp(),
        });
      }
      navigate(`/inspection/report/${id || 'demo'}`);
    } catch (error) {
      console.error('Review save error:', error);
      setMessage('Review save nahi hua. Please dobara try karein.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="screen screen-with-header" id="inspection-completed-screen">
      <Header title="Inspection Completed" />
      <div className="screen-content">
        <div className="review-section">
          <h3 className="review-title">How was your experience?</h3>
          <div className="stars">
            {[1, 2, 3, 4, 5].map(star => (
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

        {message && <p className="text-small text-red mt-12">{message}</p>}

        <button className="btn btn-primary mt-24" onClick={handleSubmitReview} id="btn-submit-review" disabled={saving}>
          {saving ? 'Submitting...' : 'Submit Review'}
        </button>
        <button
          className="btn btn-secondary mt-12"
          onClick={() => navigate(`/inspection/report/${id || 'demo'}`)}
          id="btn-view-report"
        >
          View Report
        </button>
      </div>
    </div>
  );
}
