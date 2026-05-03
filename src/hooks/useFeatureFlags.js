import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

// Default features (all enabled) - used if Firestore is unavailable
const defaultFeatures = {
  inspection: true,
  buy_cars: true,
  sell_car: true,
  accessories: true,
  emergency: true,
  whatsapp_support: true,
  google_login: true,
  phone_login: true,
  guest_mode: true,
  refer_earn: true,
  payment_online: true,
  payment_cod: true,
  push_notifications: true,
  maintenance_mode: false,
};

export function useFeatureFlags() {
  const [features, setFeatures] = useState(defaultFeatures);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const unsub = onSnapshot(
        doc(db, 'app_config', 'features'),
        (snapshot) => {
          if (snapshot.exists()) {
            setFeatures({ ...defaultFeatures, ...snapshot.data() });
          }
          setLoading(false);
        },
        (error) => {
          console.log('Feature flags offline, using defaults');
          setLoading(false);
        }
      );
      return () => unsub();
    } catch (e) {
      console.log('Feature flags not available');
      setLoading(false);
    }
  }, []);

  const isEnabled = (featureId) => features[featureId] !== false;

  return { features, isEnabled, loading };
}
