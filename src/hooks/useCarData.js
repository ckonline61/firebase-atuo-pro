import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { carBrands as defaultBrands, carModels as defaultModels } from '../data/mockData';

export function useCarData() {
  const [brands, setBrands] = useState(defaultBrands);
  const [models, setModels] = useState(defaultModels);

  useEffect(() => {
    try {
      const unsub = onSnapshot(
        doc(db, 'app_config', 'car_data'),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data.brands) setBrands(data.brands);
            if (data.models) setModels(data.models);
          }
        },
        (error) => {
          console.log('Car data offline, using defaults');
        }
      );
      return () => unsub();
    } catch (e) {
      console.log('Car data not available');
    }
  }, []);

  return { brands, models };
}
