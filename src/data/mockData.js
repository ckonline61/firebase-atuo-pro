// Mock Data for Auto Pro App

export const inspectionServices = [
  {
    id: 1,
    name: 'Pre-Purchase Inspection',
    description: 'Complete inspection before you buy a used car',
    icon: '🔍',
    price: 999
  },
  {
    id: 2,
    name: 'General Checkup',
    description: 'Overall car health checkup',
    icon: '🏥',
    price: 799
  },
  {
    id: 3,
    name: 'Engine Check',
    description: 'Detailed engine performance check',
    icon: '⚙️',
    price: 699
  },
  {
    id: 4,
    name: 'Full Inspection Package',
    description: 'Complete body, engine, interior, electrical check',
    icon: '✅',
    price: 1499
  }
];

export const carBrands = [
  'Maruti Suzuki', 'Hyundai', 'Honda', 'Toyota', 'Tata', 'Mahindra',
  'Kia', 'MG', 'Volkswagen', 'Skoda', 'Ford', 'Renault', 'Nissan', 'BMW',
  'Mercedes', 'Audi'
];

export const carModels = {
  'Maruti Suzuki': ['Swift', 'Baleno', 'Dzire', 'Brezza', 'Ertiga', 'Alto', 'WagonR', 'Celerio'],
  'Hyundai': ['i20', 'Creta', 'Venue', 'Verna', 'i10 Grand', 'Tucson', 'Alcazar'],
  'Honda': ['City', 'Amaze', 'WR-V', 'Jazz', 'Elevate'],
  'Toyota': ['Innova', 'Fortuner', 'Glanza', 'Urban Cruiser', 'Camry'],
  'Tata': ['Nexon', 'Punch', 'Harrier', 'Safari', 'Altroz', 'Tiago'],
  'Mahindra': ['Scorpio', 'XUV700', 'Thar', 'XUV300', 'Bolero'],
  'Kia': ['Seltos', 'Sonet', 'Carens', 'EV6'],
  'MG': ['Hector', 'Astor', 'Gloster', 'ZS EV'],
  'Volkswagen': ['Polo', 'Vento', 'Taigun', 'Tiguan'],
  'Skoda': ['Rapid', 'Octavia', 'Kushaq', 'Slavia'],
};

export const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];

export const years = Array.from({length: 20}, (_, i) => (2026 - i).toString());

export const timeSlots = [
  '09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'
];

export const accessories = [
  {
    id: 1,
    name: 'Android Music System',
    category: 'Music System',
    price: 7999,
    originalPrice: 9999,
    discount: 20,
    image: '🎵',
    rating: 4.5,
    features: ['9 Inch Android System', 'Bluetooth, GPS, WiFi', '1 Year Warranty', 'Free Installation'],
    installAtLocation: true
  },
  {
    id: 2,
    name: 'LED Headlights',
    category: 'Lights',
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    image: '💡',
    rating: 4.3,
    features: ['Ultra Bright LED', 'Easy Installation', '2 Year Warranty', 'Universal Fit'],
    installAtLocation: true
  },
  {
    id: 3,
    name: 'Premium Seat Covers',
    category: 'Seat Covers',
    price: 4999,
    originalPrice: 6999,
    discount: 28,
    image: '💺',
    rating: 4.6,
    features: ['Premium Leather', 'Custom Fit', 'Waterproof', 'Easy Clean'],
    installAtLocation: true
  },
  {
    id: 4,
    name: 'Reverse Camera',
    category: 'Cameras',
    price: 2499,
    originalPrice: 3499,
    discount: 28,
    image: '📷',
    rating: 4.4,
    features: ['HD Night Vision', 'Wide Angle', 'Waterproof IP68', 'Easy Install'],
    installAtLocation: true
  },
  {
    id: 5,
    name: 'Parking Sensors',
    category: 'Sensors',
    price: 1999,
    originalPrice: 2999,
    discount: 33,
    image: '📡',
    rating: 4.2,
    features: ['4 Sensors', 'LED Display', 'Buzzer Alert', 'Universal Fit'],
    installAtLocation: true
  },
  {
    id: 6,
    name: 'Premium Floor Mats',
    category: 'Floor Mats',
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    image: '🟫',
    rating: 4.7,
    features: ['7D Design', 'Waterproof', 'Anti-Skid', 'Custom Fit'],
    installAtLocation: false
  },
  {
    id: 7,
    name: 'Android Player 10"',
    category: 'Android Player',
    price: 12999,
    originalPrice: 15999,
    discount: 18,
    image: '📱',
    rating: 4.8,
    features: ['10 Inch Display', 'Apple CarPlay', 'Android Auto', 'GPS Navigation'],
    installAtLocation: true
  },
  {
    id: 8,
    name: 'Car Dash Camera',
    category: 'Cameras',
    price: 3999,
    originalPrice: 5999,
    discount: 33,
    image: '🎥',
    rating: 4.5,
    features: ['Full HD 1080p', 'Night Vision', 'G-Sensor', 'Loop Recording'],
    installAtLocation: true
  }
];

export const accessoryCategories = [
  { name: 'Music System', icon: '🎵' },
  { name: 'Lights', icon: '💡' },
  { name: 'Seat Covers', icon: '💺' },
  { name: 'Cameras', icon: '📷' },
  { name: 'Sensors', icon: '📡' },
  { name: 'Floor Mats', icon: '🟫' },
  { name: 'Android Player', icon: '📱' },
  { name: 'Other Accessories', icon: '🔧' }
];

export const carsForSale = [
  {
    id: 1,
    brand: 'Honda',
    model: 'City',
    year: 2018,
    variant: 'V Petrol',
    price: 645000,
    emi: 9999,
    kmDriven: 45000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    owner: '1st Owner',
    insurance: 'Valid till May 2025',
    location: 'Delhi',
    verified: true,
    inspectionScore: 8.2,
    images: [],
    category: 'Sedan'
  },
  {
    id: 2,
    brand: 'Maruti Suzuki',
    model: 'Swift',
    year: 2020,
    variant: 'ZXi Petrol',
    price: 425000,
    emi: 7499,
    kmDriven: 38000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    owner: '1st Owner',
    insurance: 'Valid till Dec 2025',
    location: 'Delhi',
    verified: true,
    inspectionScore: 8.5,
    images: [],
    category: 'Hatchback'
  },
  {
    id: 3,
    brand: 'Hyundai',
    model: 'i20',
    year: 2019,
    variant: 'Asta Petrol',
    price: 535000,
    emi: 8999,
    kmDriven: 32000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    owner: '2nd Owner',
    insurance: 'Valid till Aug 2025',
    location: 'Noida',
    verified: true,
    inspectionScore: 7.8,
    images: [],
    category: 'Hatchback'
  },
  {
    id: 4,
    brand: 'Hyundai',
    model: 'Creta',
    year: 2021,
    variant: 'SX Diesel',
    price: 1245000,
    emi: 18999,
    kmDriven: 25000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    owner: '1st Owner',
    insurance: 'Valid till Mar 2026',
    location: 'Gurgaon',
    verified: true,
    inspectionScore: 9.0,
    images: [],
    category: 'SUV'
  },
  {
    id: 5,
    brand: 'Tata',
    model: 'Nexon',
    year: 2022,
    variant: 'XZ+ Petrol',
    price: 895000,
    emi: 13999,
    kmDriven: 18000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    owner: '1st Owner',
    insurance: 'Valid till Jun 2026',
    location: 'Delhi',
    verified: true,
    inspectionScore: 8.8,
    images: [],
    category: 'SUV'
  }
];

export const sampleBookings = [
  {
    id: 'AP24190S19001',
    service: 'Pre-Purchase Inspection',
    car: 'Honda City • 2018',
    date: '19 May 2024 • 11:00 AM',
    location: 'Connaught Place, Delhi',
    status: 'mechanic_assigned',
    price: 999,
    mechanicName: 'Rohit Sharma',
    mechanicRating: 4.8,
    mechanicJobs: 125,
    mechanicVehicle: 'Maruti Ertiga - DL 12 AB 1234'
  },
  {
    id: 'AP24190S12003',
    service: 'General Checkup',
    car: 'Maruti Swift • 2016',
    date: '10 May 2024 • 02:00 PM',
    location: 'Lajpat Nagar, Delhi',
    status: 'completed',
    price: 799
  }
];

export const sampleInspectionReport = {
  overallScore: 8.2,
  condition: 'Good Condition',
  conditionNote: 'Well maintained car',
  categories: [
    { name: 'Engine', score: 8.5 },
    { name: 'Body & Paint', score: 7.5 },
    { name: 'Interior', score: 8.0 },
    { name: 'Brakes', score: 8.5 },
    { name: 'Electricals', score: 8.0 },
    { name: 'Suspension', score: 8.0 }
  ]
};
