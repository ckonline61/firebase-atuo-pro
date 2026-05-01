import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { auth, googleProvider } from '../config/firebase';
import { signInWithRedirect, signInWithPopup, getRedirectResult } from 'firebase/auth';
import './LoginScreen.css';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { dispatch } = useApp();

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

