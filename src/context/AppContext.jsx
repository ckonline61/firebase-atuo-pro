import { createContext, useContext, useReducer } from 'react';
import { sampleBookings } from '../data/mockData';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  userLocation: null,
  bookings: sampleBookings,
  currentBooking: {
    service: null,
    carDetails: {},
    pickupDetails: {},
    payment: null
  },
  cart: [],
  savedCars: [],
  userListings: []
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'SET_SERVICE':
      return { ...state, currentBooking: { ...state.currentBooking, service: action.payload } };
    case 'SET_CAR_DETAILS':
      return { ...state, currentBooking: { ...state.currentBooking, carDetails: action.payload } };
    case 'SET_PICKUP_DETAILS':
      return { ...state, currentBooking: { ...state.currentBooking, pickupDetails: action.payload } };
    case 'SET_PAYMENT':
      return { ...state, currentBooking: { ...state.currentBooking, payment: action.payload } };
    case 'ADD_BOOKING':
      return { ...state, bookings: [action.payload, ...state.bookings] };
    case 'RESET_BOOKING':
      return { ...state, currentBooking: { service: null, carDetails: {}, pickupDetails: {}, payment: null } };
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case 'SAVE_CAR':
      return { ...state, savedCars: [...state.savedCars, action.payload] };
    case 'REMOVE_SAVED_CAR':
      return { ...state, savedCars: state.savedCars.filter(car => car.id !== action.payload) };
    case 'ADD_LISTING':
      return { ...state, userListings: [...state.userListings, action.payload] };
    case 'SET_LOCATION':
      return { ...state, userLocation: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export default AppContext;
