import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ContentProvider } from './hooks/useContent';
import { useNotifications } from './hooks/useNotifications';
import BottomNav from './components/BottomNav';
import { App as CapApp } from '@capacitor/app';

// Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';

// Inspection Flow
import SelectService from './screens/inspection/SelectService';
import CarDetails from './screens/inspection/CarDetails';
import PickupDetails from './screens/inspection/PickupDetails';
import ConfirmBooking from './screens/inspection/ConfirmBooking';
import PaymentScreen from './screens/inspection/PaymentScreen';
import BookingConfirmed from './screens/inspection/BookingConfirmed';
import InspectionCompleted from './screens/inspection/InspectionCompleted';
import InspectionReport from './screens/inspection/InspectionReport';
import CarAcServices from './screens/ac/CarAcServices';

// Bookings
import MyBookings from './screens/bookings/MyBookings';
import BookingTracking from './screens/bookings/BookingTracking';

// Accessories
import AccessoriesCategory from './screens/accessories/AccessoriesCategory';
import AccessoryDetails from './screens/accessories/AccessoryDetails';
import AccessoryBooking from './screens/accessories/AccessoryBooking';

// Buy/Sell Cars
import BuyCarListing from './screens/buycars/BuyCarListing';
import CarDetailsPage from './screens/buycars/CarDetails';
import SellCar from './screens/sellcar/SellCar';

// Profile
import ProfileScreen from './screens/profile/ProfileScreen';
import MyListings from './screens/profile/MyListings';
import SavedCars from './screens/profile/SavedCars';
import PaymentMethods from './screens/profile/PaymentMethods';
import Addresses from './screens/profile/Addresses';
import ReferEarn from './screens/profile/ReferEarn';
import HelpSupport from './screens/profile/HelpSupport';
import PrivacyPolicy from './screens/profile/PrivacyPolicy';
import TermsConditions from './screens/profile/TermsConditions';
import Settings from './screens/profile/Settings';

function NotificationBanner() {
  const { latest, dismissLatest } = useNotifications();
  const navigate = useNavigate();

  if (!latest) return null;

  const typeColors = { info: '#3B82F6', promo: '#22C55E', alert: '#F59E0B', update: '#8B5CF6' };
  const typeIcons = { info: 'ℹ️', promo: '🎉', alert: '⚠️', update: '🔄' };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      background: typeColors[latest.type] || '#3B82F6',
      color: 'white', padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      animation: 'slideDown 0.3s ease'
    }}
      onClick={() => { if (latest.link) navigate(latest.link); dismissLatest(); }}
    >
      <span style={{ fontSize: '20px' }}>{typeIcons[latest.type] || '🔔'}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '14px' }}>{latest.title}</div>
        <div style={{ fontSize: '12px', opacity: 0.9 }}>{latest.message}</div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); dismissLatest(); }}
        style={{ background: 'none', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', padding: '4px' }}
      >✕</button>
    </div>
  );
}

function AppRoutes() {
  // Handle Android hardware back button
  useEffect(() => {
    const handleBackButton = CapApp.addListener('backButton', ({ canGoBack }) => {
      const path = window.location.pathname;
      if (!canGoBack && (path === '/home' || path === '/' || path === '/login')) {
        CapApp.exitApp();
      } else {
        window.history.back();
      }
    });
    return () => { handleBackButton.then(h => h.remove()); };
  }, []);

  return (
    <>
      <NotificationBanner />
      <div className="app-container">
        <Routes>
          {/* Auth Flow */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          
          {/* Main */}
          <Route path="/home" element={<HomeScreen />} />
          
          {/* Inspection */}
          <Route path="/inspection/service" element={<SelectService />} />
          <Route path="/ac-services" element={<CarAcServices />} />
          <Route path="/inspection/car-details" element={<CarDetails />} />
          <Route path="/inspection/pickup" element={<PickupDetails />} />
          <Route path="/inspection/confirm" element={<ConfirmBooking />} />
          <Route path="/inspection/payment" element={<PaymentScreen />} />
          <Route path="/inspection/confirmed" element={<BookingConfirmed />} />
          <Route path="/inspection/review/:id" element={<InspectionCompleted />} />
          <Route path="/inspection/report/:id" element={<InspectionReport />} />
          
          {/* Bookings */}
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/bookings/tracking/:id" element={<BookingTracking />} />
          
          {/* Accessories */}
          <Route path="/accessories" element={<AccessoriesCategory />} />
          <Route path="/accessories/booking" element={<AccessoryBooking />} />
          <Route path="/accessories/:id" element={<AccessoryDetails />} />
          
          {/* Buy/Sell */}
          <Route path="/buy-cars" element={<BuyCarListing />} />
          <Route path="/buy-cars/:id" element={<CarDetailsPage />} />
          <Route path="/sell-car" element={<SellCar />} />
          
          {/* Profile */}
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/profile/my-listings" element={<MyListings />} />
          <Route path="/profile/saved-cars" element={<SavedCars />} />
          <Route path="/profile/payment-methods" element={<PaymentMethods />} />
          <Route path="/profile/addresses" element={<Addresses />} />
          <Route path="/profile/refer-earn" element={<ReferEarn />} />
          <Route path="/profile/help-support" element={<HelpSupport />} />
          <Route path="/profile/settings" element={<Settings />} />
          
          {/* Legal */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
        </Routes>
        <BottomNav />
      </div>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <ContentProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ContentProvider>
    </AppProvider>
  );
}

export default App;
