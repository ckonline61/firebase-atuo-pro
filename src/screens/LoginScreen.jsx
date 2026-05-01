import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import './LoginScreen.css';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleGoogleLogin = async () => {
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
    } catch (error) {
      console.error('Google login error:', error);
      // Fallback to demo mode if Firebase not configured
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/api-key-not-valid') {
        alert('Firebase not configured yet. Using demo mode.');
        dispatch({
          type: 'SET_USER',
          payload: {
            name: 'Aman Sharma',
            email: 'aman.sharma@gmail.com',
            phone: '+91 98765 43210',
            photoURL: null
          }
        });
        navigate('/onboarding');
      } else {
        alert('Login failed: ' + error.message);
      }
    }
  };

  const handlePhoneLogin = () => {
    // Phone auth requires Blaze plan - using demo for now
    dispatch({
      type: 'SET_USER',
      payload: {
        name: 'User',
        email: '',
        phone: '+91 98765 43210',
        photoURL: null
      }
    });
    navigate('/onboarding');
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
          
          <button className="btn btn-secondary login-btn" onClick={handlePhoneLogin} id="btn-phone-login">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
            Continue with Phone Number
          </button>
        </div>

        <p className="login-terms animate-fadeIn" style={{animationDelay: '0.4s'}}>
          By continuing, you agree to our<br/>
          <a href="#" className="text-red">Terms & Conditions</a> and <a href="#" className="text-red">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
