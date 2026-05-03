import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { auth, googleProvider } from '../config/firebase';
import {
  RecaptchaVerifier,
  getRedirectResult,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithRedirect,
  updateProfile
} from 'firebase/auth';
import './LoginScreen.css';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [pendingPhoneUser, setPendingPhoneUser] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');

  // Check redirect result on page load (for APK/mobile)
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          const user = result.user;
          dispatch({
            type: 'SET_USER',
            payload: {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              phone: user.phoneNumber || '',
              photoURL: user.photoURL
            }
          });
          navigate('/onboarding');
        }
      })
      .catch((error) => {
        console.error('Redirect result error:', error);
      });
  }, []);

  const setLoggedInUser = (user, fallbackName = 'Auto Pro User') => {
    dispatch({
      type: 'SET_USER',
      payload: {
        uid: user.uid,
        name: user.displayName || fallbackName,
        email: user.email || '',
        phone: user.phoneNumber || '',
        photoURL: user.photoURL || null
      }
    });
    navigate('/onboarding');
  };

  const getRecaptchaVerifier = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'login-recaptcha-container', {
        size: 'invisible',
        badge: 'inline'
      });
    }
    return window.recaptchaVerifier;
  };

  const formatIndianPhone = (value) => {
    const digits = value.replace(/\D/g, '');
    const withoutCountry = digits.startsWith('91') && digits.length > 10 ? digits.slice(2) : digits;
    return `+91${withoutCountry.slice(-10)}`;
  };

  const handleSendOtp = async () => {
    const digits = phone.replace(/\D/g, '');
    const normalizedDigits = digits.startsWith('91') && digits.length > 10 ? digits.slice(2) : digits;

    if (normalizedDigits.length !== 10) {
      setOtpMessage('Please enter a valid 10 digit mobile number.');
      return;
    }

    setOtpLoading(true);
    setOtpMessage('');

    try {
      const result = await signInWithPhoneNumber(auth, formatIndianPhone(phone), getRecaptchaVerifier());
      setConfirmationResult(result);
      setOtpMessage('OTP sent successfully.');
    } catch (error) {
      console.error('OTP send error:', error);
      const messages = {
        'auth/invalid-phone-number': 'Please enter a valid 10 digit mobile number.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/unauthorized-domain': 'This domain is not authorized in Firebase Auth settings.',
        'auth/captcha-check-failed': 'reCAPTCHA check failed. Refresh and try again.',
        'auth/quota-exceeded': 'SMS quota exceeded. Try later or check Firebase billing.'
      };
      setOtpMessage(messages[error.code] || `Could not send OTP: ${error.code || error.message}`);
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
      setOtpMessage('Please send OTP first.');
      return;
    }

    if (otp.trim().length < 6) {
      setOtpMessage('Please enter the 6 digit OTP.');
      return;
    }

    setOtpLoading(true);
    setOtpMessage('');

    try {
      const result = await confirmationResult.confirm(otp.trim());
      setPendingPhoneUser(result.user);
      setCustomerName(result.user.displayName || '');
      setOtpMessage('OTP verified. Please enter your name.');
    } catch (error) {
      console.error('OTP verify error:', error);
      setOtpMessage('Invalid OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handlePhoneNameSubmit = async () => {
    const name = customerName.trim();

    if (!name) {
      setOtpMessage('Please enter your name.');
      return;
    }

    setOtpLoading(true);
    setOtpMessage('');

    try {
      if (pendingPhoneUser && pendingPhoneUser.displayName !== name) {
        await updateProfile(pendingPhoneUser, { displayName: name });
      }
      setLoggedInUser(pendingPhoneUser, name);
    } catch (error) {
      console.error('Name update error:', error);
      setLoggedInUser(pendingPhoneUser, name);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Try popup first (works on desktop browsers)
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        dispatch({
          type: 'SET_USER',
          payload: {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            phone: user.phoneNumber || '',
            photoURL: user.photoURL
          }
        });
        navigate('/onboarding');
      } catch (popupError) {
        // If popup blocked (APK/WebView), use redirect
        if (
          popupError.code === 'auth/popup-blocked' ||
          popupError.code === 'auth/popup-closed-by-user' ||
          popupError.code === 'auth/cancelled-popup-request' ||
          popupError.code === 'auth/internal-error'
        ) {
          await signInWithRedirect(auth, googleProvider);
        } else {
          throw popupError;
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      // Fallback to demo mode if Firebase not configured
      if (
        error.code === 'auth/configuration-not-found' ||
        error.code === 'auth/api-key-not-valid' ||
        error.code === 'auth/unauthorized-domain'
      ) {
        dispatch({
          type: 'SET_USER',
          payload: {
            name: 'User',
            email: 'user@autopro.in',
            phone: '',
            photoURL: null
          }
        });
        navigate('/onboarding');
      } else {
        alert('Login failed. Please try again or skip.');
      }
    }
  };

  const handleSkip = () => {
    dispatch({
      type: 'SET_USER',
      payload: {
        name: 'Guest User',
        email: '',
        phone: '',
        photoURL: null
      }
    });
    navigate('/home');
  };

  return (
    <div className="login-screen" id="login-screen">
      <div className="login-content">
        <div className="login-logo animate-scaleIn">
          <img src="/logo.png" alt="Auto Pro" />
        </div>
        <div className="login-welcome animate-fadeInUp">
          <h1>Welcome to Auto Pro</h1>
          <p>Your trusted car partner</p>
        </div>
        
        <div className="login-buttons animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          <button className="btn btn-secondary login-btn" onClick={handleGoogleLogin} id="btn-google-login">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="phone-login-card">
            <div className="phone-input-row">
              <span className="phone-prefix">+91</span>
              <input
                className="phone-input"
                type="tel"
                inputMode="numeric"
                maxLength="10"
                placeholder="Mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
              <button className="phone-send-btn" onClick={handleSendOtp} disabled={otpLoading}>
                {confirmationResult ? 'Resend' : 'Send OTP'}
              </button>
            </div>

            {confirmationResult && (
              <div className="otp-input-row">
                <input
                  className="phone-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength="6"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
                <button className="phone-send-btn phone-verify-btn" onClick={handleVerifyOtp} disabled={otpLoading}>
                  Verify
                </button>
              </div>
            )}

            {pendingPhoneUser && (
              <div className="otp-input-row">
                <input
                  className="phone-input"
                  type="text"
                  placeholder="Your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <button className="phone-send-btn phone-verify-btn" onClick={handlePhoneNameSubmit} disabled={otpLoading}>
                  Continue
                </button>
              </div>
            )}

            {otpMessage && <p className="otp-message">{otpMessage}</p>}
            <div id="login-recaptcha-container" className="recaptcha-inline"></div>
          </div>
          
          <div className="login-divider">
            <span>or</span>
          </div>
          
          <button className="btn btn-dark login-btn" onClick={handleSkip} id="btn-skip-login">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Skip
          </button>
        </div>

        <p className="login-terms animate-fadeIn" style={{animationDelay: '0.4s'}}>
          By continuing, you agree to our<br/>
          <a href="/terms-conditions" className="text-red">Terms & Conditions</a> and <a href="/privacy-policy" className="text-red">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
