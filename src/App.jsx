import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import BottomNav from './components/BottomNav';

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

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
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
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

