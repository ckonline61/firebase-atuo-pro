import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber, updateProfile } from 'firebase/auth';
import { useApp } from '../../context/AppContext';
import { auth } from '../../config/firebase';
import { saveUserProfile } from '../../services/userProfile';
import Header from '../../components/Header';
import './Inspection.css';

const VERIFY_ERROR_MESSAGES = {
  'auth/invalid-phone-number': 'Please enter a valid 10 digit mobile number.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/unauthorized-domain': 'This domain is not authorized in Firebase Auth settings.',
  'auth/captcha-check-failed': 'reCAPTCHA check failed. Refresh and try again.',
  'auth/quota-exceeded': 'SMS quota exceeded. Try later or check Firebase billing.'
};

export default function ConfirmBooking() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { service, carDetails, pickupDetails } = state.currentBooking;
  const [showVerify, setShowVerify] = useState(false);
  const [customerName, setCustomerName] = useState(state.user?.name === 'Guest User' ? '' : state.user?.name || '');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState('');
  const recaptchaVerifierRef = useRef(null);

  const carName = `${carDetails.brand || 'Honda'} ${carDetails.model || 'City'}`;
  const carInfo = `${carDetails.year || '2018'} - ${carDetails.fuelType || 'Petrol'} - ${carDetails.kmDriven || '45,000'} KM`;
  const isGuestUser = !state.user?.uid || state.user?.name === 'Guest User';

  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const resetRecaptchaVerifier = () => {
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }
  };

  const createRecaptchaVerifier = async () => {
    resetRecaptchaVerifier();
    const container = document.getElementById('booking-recaptcha-container');

    if (!container) {
      throw new Error('reCAPTCHA container is not ready. Please reopen this form and try again.');
    }

    container.innerHTML = '';
    const verifier = new RecaptchaVerifier(auth, container, {
      size: 'invisible',
      badge: 'inline'
    });
    recaptchaVerifierRef.current = verifier;
    await verifier.render();
    return verifier;
  };

  const formatIndianPhone = (value) => {
    const digits = value.replace(/\D/g, '');
    const withoutCountry = digits.startsWith('91') && digits.length > 10 ? digits.slice(2) : digits;
    return `+91${withoutCountry.slice(-10)}`;
  };

  const handleSendOtp = async () => {
    const digits = phone.replace(/\D/g, '');
    const normalizedDigits = digits.startsWith('91') && digits.length > 10 ? digits.slice(2) : digits;

    if (!customerName.trim()) {
      setVerifyMessage('Please enter your name.');
      return;
    }

    if (normalizedDigits.length !== 10) {
      setVerifyMessage('Please enter a valid 10 digit mobile number.');
      return;
    }

    setVerifyLoading(true);
    setVerifyMessage('');

    try {
      const result = await signInWithPhoneNumber(auth, formatIndianPhone(phone), await createRecaptchaVerifier());
      setConfirmationResult(result);
      setVerifyMessage('OTP sent successfully.');
    } catch (error) {
      console.error('Booking OTP send error:', error);
      setVerifyMessage(VERIFY_ERROR_MESSAGES[error.code] || `Could not send OTP: ${error.code || error.message}`);
      resetRecaptchaVerifier();
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
      setVerifyMessage('Please send OTP first.');
      return;
    }

    if (otp.trim().length < 6) {
      setVerifyMessage('Please enter the 6 digit OTP.');
      return;
    }

    setVerifyLoading(true);
    setVerifyMessage('');

    try {
      const result = await confirmationResult.confirm(otp.trim());
      const name = customerName.trim();

      if (result.user.displayName !== name) {
        await updateProfile(result.user, { displayName: name });
      }

      const userProfile = {
        uid: result.user.uid,
        name,
        email: result.user.email || '',
        phone: result.user.phoneNumber || formatIndianPhone(phone),
        photoURL: result.user.photoURL || null
      };

      try {
        await saveUserProfile(result.user, userProfile);
      } catch (error) {
        console.error('Booking user profile save error:', error);
      }

      dispatch({
        type: 'SET_USER',
        payload: userProfile
      });
      navigate('/inspection/payment');
    } catch (error) {
      console.error('Booking OTP verify error:', error);
      setVerifyMessage('Invalid OTP. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleProceed = () => {
    if (isGuestUser) {
      setShowVerify(true);
      return;
    }

    navigate('/inspection/payment');
  };

  return (
    <div className="screen screen-with-header" id="confirm-booking-screen">
      <Header title="Confirm Booking" />
      <div className="screen-content">
        <h3 className="section-label">Booking Summary</h3>
        <div className="booking-summary">
          <div className="summary-car">
            <div className="summary-car-icon">Car</div>
            <div className="summary-car-info">
              <h4>{carName}</h4>
              <p>{carInfo}</p>
            </div>
          </div>
          <div className="summary-row">
            <span className="summary-label">Service</span>
            <span className="summary-value">{service?.name || 'Pre-Purchase Inspection'}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Date & Time</span>
            <span className="summary-value">{pickupDetails.date}, {pickupDetails.timeSlot || '11:00 AM'}</span>
          </div>
          <div className="summary-row" style={{ flexDirection: 'column', gap: 2 }}>
            <span className="summary-label">Location</span>
            <span className="summary-value" style={{ fontSize: 13, lineHeight: 1.5 }}>
              {pickupDetails.location || 'Raipur, Chhattisgarh'}
            </span>
          </div>
          <div className="summary-price">
            <div>
              <p className="summary-price-label">Estimated Price</p>
              <p className="summary-price-note">Inclusive of all taxes</p>
            </div>
            <span className="summary-price-value">Rs {service?.price || 999}</span>
          </div>
        </div>

        <div className="trust-badges">
          <div className="trust-badge">
            <span className="trust-badge-icon">OK</span>
            Verified Mechanics
          </div>
          <div className="trust-badge">
            <span className="trust-badge-icon">100%</span>
            Transparent Pricing
          </div>
        </div>
      </div>
      <div className="bottom-action">
        <button className="btn btn-primary" onClick={handleProceed} id="btn-proceed-payment">
          Proceed to Payment
        </button>
      </div>

      {showVerify && (
        <div className="booking-verify-overlay">
          <div className="booking-verify-modal">
            <h3>Verify your booking</h3>
            <p>Please add your name and verify your mobile number to continue.</p>

            <input
              className="booking-verify-input"
              type="text"
              placeholder="Your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <div className="booking-phone-row">
              <span>+91</span>
              <input
                className="booking-verify-input"
                type="tel"
                inputMode="numeric"
                maxLength="10"
                placeholder="Mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>

            <button className="btn btn-dark" onClick={handleSendOtp} disabled={verifyLoading}>
              {confirmationResult ? 'Resend OTP' : 'Send OTP'}
            </button>

            {confirmationResult && (
              <>
                <input
                  className="booking-verify-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength="6"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
                <button className="btn btn-primary" onClick={handleVerifyOtp} disabled={verifyLoading}>
                  Verify & Continue
                </button>
              </>
            )}

            {verifyMessage && <p className="booking-verify-message">{verifyMessage}</p>}
            <div id="booking-recaptcha-container" className="booking-recaptcha"></div>

            <button className="booking-verify-cancel" onClick={() => setShowVerify(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
