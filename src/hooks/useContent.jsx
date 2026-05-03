import { useState, useEffect, createContext, useContext } from 'react';
import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

// Default content values - used when Firestore is unavailable
const defaultContent = {
  // Home Screen
  home_title: 'Auto Pro',
  home_subtitle: 'Your Trusted Car Partner',
  home_search_placeholder: 'Search cars, services...',
  home_emergency_title: '🚨 Emergency Services',
  home_why_title: 'Why Choose Auto Pro?',
  home_why_1: 'Verified Mechanics',
  home_why_2: 'Transparent Pricing',
  home_why_3: 'Quick Service',
  home_why_4: 'Trusted by Thousands',

  // Services
  service_inspection: 'Book\nInspection',
  service_ac: 'Car AC\nService',
  service_buy: 'Buy\nCar',
  service_sell: 'Sell\nCar',
  service_accessories: 'Accessories',
  service_jump_starter: 'Jump Starter',
  service_jump_desc: "Battery dead? We'll help!",
  service_roadside: 'Road Side Assistance',
  service_roadside_desc: 'Stuck on road? Call us!',

  // Inspection
  inspect_title: 'Car Inspection',
  inspect_subtitle: 'Get your car inspected by certified mechanics',
  inspect_basic_title: 'Basic Inspection',
  inspect_basic_price: '₹499',
  inspect_standard_title: 'Standard Inspection',
  inspect_standard_price: '₹999',
  inspect_premium_title: 'Premium Inspection',
  inspect_premium_price: '₹1499',

  // Buy Cars
  buy_title: 'Buy Used Cars',
  buy_subtitle: 'Find your dream car at best prices',
  buy_filter_price: 'Price Range',
  buy_filter_fuel: 'Fuel Type',
  buy_filter_trans: 'Transmission',
  buy_empty: 'No cars found matching your criteria',
  buy_contact_btn: 'Contact Seller',

  // Sell Car
  sell_title: 'Sell Your Car',
  sell_subtitle: 'List your car and get best price',
  sell_btn: 'Submit for Review',
  sell_success: 'Your car has been submitted for review!',

  // Emergency
  emer_title: 'Emergency Services',
  emer_jump_name: 'Jump Starter',
  emer_jump_msg: 'Hi! I need a Jump Starter service urgently. Please help!',
  emer_road_name: 'Road Side Assistance',
  emer_road_msg: 'Hi! I need Road Side Assistance urgently. Please help!',

  // Login
  login_title: 'Welcome to Auto Pro',
  login_subtitle: 'Your trusted car service partner',
  login_google_btn: 'Continue with Google',
  login_skip_btn: 'Skip for now',
  login_terms_text: 'By continuing, you agree to our',
};

const ContentContext = createContext(defaultContent);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    try {
      const unsub = onSnapshot(
        doc(db, 'app_config', 'content'),
        (snapshot) => {
          if (snapshot.exists()) {
            setContent({ ...defaultContent, ...snapshot.data() });
          }
        },
        (error) => {
          console.log('Content offline, using defaults');
        }
      );
      return () => unsub();
    } catch (e) {
      console.log('Content not available');
    }
  }, []);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
