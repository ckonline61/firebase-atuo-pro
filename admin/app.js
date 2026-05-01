// ===========================
// Auto Pro Admin Panel - JavaScript
// ===========================

// Firebase Config (same project as customer app)
const firebaseConfig = {
  apiKey: "AIzaSyDFwqovevqq4aXIBZ3vi-IK-RO0YRmzRr4",
  authDomain: "auto-pro-5a1ec.firebaseapp.com",
  projectId: "auto-pro-5a1ec",
  storageBucket: "auto-pro-5a1ec.firebasestorage.app",
  messagingSenderId: "652783899103",
  appId: "1:652783899103:web:aed46f9d6c08245ce6f46a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ===========================
// Feature Toggles Default Config
// ===========================
const defaultFeatures = [
  { id: 'inspection', name: 'Car Inspection', icon: '🔍', desc: 'Book car inspection service', enabled: true },
  { id: 'buy_cars', name: 'Buy Cars', icon: '🚗', desc: 'Browse and buy used cars', enabled: true },
  { id: 'sell_car', name: 'Sell Car', icon: '💰', desc: 'List car for sale', enabled: true },
  { id: 'accessories', name: 'Accessories Shop', icon: '🛒', desc: 'Buy car accessories', enabled: true },
  { id: 'emergency', name: 'Emergency Services', icon: '🚨', desc: 'Jump starter & roadside assistance', enabled: true },
  { id: 'whatsapp_support', name: 'WhatsApp Support', icon: '💬', desc: 'Floating WhatsApp button', enabled: true },
  { id: 'google_login', name: 'Google Login', icon: '🔐', desc: 'Sign in with Google', enabled: true },
  { id: 'guest_mode', name: 'Guest Mode (Skip)', icon: '👤', desc: 'Allow skip login', enabled: true },
  { id: 'refer_earn', name: 'Refer & Earn', icon: '🎁', desc: 'Referral program', enabled: true },
  { id: 'payment_online', name: 'Online Payment', icon: '💳', desc: 'UPI/Card payments', enabled: true },
  { id: 'payment_cod', name: 'Cash on Delivery', icon: '💵', desc: 'Cash payment option', enabled: true },
  { id: 'push_notifications', name: 'Push Notifications', icon: '🔔', desc: 'Send push notifications', enabled: true },
  { id: 'maintenance_mode', name: 'Maintenance Mode', icon: '🔧', desc: 'Show maintenance screen', enabled: false },
];

let currentFeatures = [...defaultFeatures];
let currentListingsFilter = 'pending';

// ===========================
// Authentication
// ===========================
const ADMIN_EMAILS = ['admin@autopro.in', 'ckonline61@gmail.com'];

async function handleLogin() {
  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;
  const errorEl = document.getElementById('login-error');

  if (!email || !password) {
    errorEl.textContent = 'Please fill all fields';
    return;
  }

  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    if (!ADMIN_EMAILS.includes(result.user.email)) {
      errorEl.textContent = 'Access denied. Not an admin account.';
      auth.signOut();
      return;
    }
    showDashboard();
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      // Create admin account first time
      try {
        await auth.createUserWithEmailAndPassword(email, password);
        showDashboard();
      } catch (e) {
        errorEl.textContent = e.message;
      }
    } else {
      errorEl.textContent = error.message;
    }
  }
}

function handleLogout() {
  auth.signOut();
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-dashboard').style.display = 'none';
}

// Check auth state
auth.onAuthStateChanged(user => {
  if (user && ADMIN_EMAILS.includes(user.email)) {
    showDashboard();
  }
});

function showDashboard() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-dashboard').style.display = 'flex';
  loadDashboardData();
  loadFeatureToggles();
  loadCarListings();
  loadBookings();
  loadUsers();
  loadEmergencyRequests();
}

// ===========================
// Navigation
// ===========================
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  
  document.getElementById(`section-${sectionId}`).classList.add('active');
  document.querySelector(`.nav-item[data-section="${sectionId}"]`).classList.add('active');
  
  document.getElementById('mobile-title').textContent = 
    document.querySelector(`.nav-item[data-section="${sectionId}"]`).textContent.trim();

  // Close sidebar on mobile
  document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ===========================
// Dashboard Data
// ===========================
async function loadDashboardData() {
  try {
    // Load stats from Firestore
    const usersSnap = await db.collection('users').get();
    const bookingsSnap = await db.collection('bookings').get();
    const listingsSnap = await db.collection('car_listings').get();
    const emergencySnap = await db.collection('emergency_requests').get();

    document.getElementById('stat-users').textContent = usersSnap.size;
    document.getElementById('stat-bookings').textContent = bookingsSnap.size;
    document.getElementById('stat-listings').textContent = listingsSnap.size;
    document.getElementById('stat-emergency').textContent = emergencySnap.size;

    // Load recent activity
    const activitySnap = await db.collection('activity_log')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    const activityEl = document.getElementById('recent-activity');
    if (activitySnap.empty) {
      activityEl.innerHTML = `
        <div class="activity-item">
          <span class="activity-icon">📋</span>
          <div class="activity-info">
            <p class="activity-text">No recent activity</p>
            <p class="activity-time">Data will appear as users interact</p>
          </div>
        </div>`;
    } else {
      activityEl.innerHTML = activitySnap.docs.map(doc => {
        const d = doc.data();
        return `<div class="activity-item">
          <span class="activity-icon">${d.icon || '📋'}</span>
          <div class="activity-info">
            <p class="activity-text">${d.message}</p>
            <p class="activity-time">${formatTime(d.timestamp)}</p>
          </div>
        </div>`;
      }).join('');
    }
  } catch (e) {
    console.log('Dashboard data loading...', e.message);
  }
}

// ===========================
// Feature Toggles
// ===========================
async function loadFeatureToggles() {
  try {
    const doc = await db.collection('app_config').doc('features').get();
    if (doc.exists) {
      const savedFeatures = doc.data();
      currentFeatures = defaultFeatures.map(f => ({
        ...f,
        enabled: savedFeatures[f.id] !== undefined ? savedFeatures[f.id] : f.enabled
      }));
    }
  } catch (e) {
    console.log('Loading default features');
  }
  renderFeatureToggles();
}

function renderFeatureToggles() {
  const container = document.getElementById('feature-toggles');
  container.innerHTML = currentFeatures.map(f => `
    <div class="toggle-card">
      <div class="toggle-info">
        <div class="toggle-icon">${f.icon}</div>
        <div>
          <p class="toggle-name">${f.name}</p>
          <p class="toggle-desc">${f.desc}</p>
        </div>
      </div>
      <label class="switch">
        <input type="checkbox" data-feature="${f.id}" ${f.enabled ? 'checked' : ''} onchange="toggleFeature('${f.id}', this.checked)">
        <span class="slider"></span>
      </label>
    </div>
  `).join('');
}

function toggleFeature(id, enabled) {
  currentFeatures = currentFeatures.map(f => f.id === id ? { ...f, enabled } : f);
}

async function saveFeatureToggles() {
  try {
    const featuresObj = {};
    currentFeatures.forEach(f => { featuresObj[f.id] = f.enabled; });
    await db.collection('app_config').doc('features').set(featuresObj);
    showToast('Features saved successfully!');
    logActivity('🎛️', 'Feature toggles updated by admin');
  } catch (e) {
    showToast('Error saving features: ' + e.message, true);
  }
}

// ===========================
// Car Listings
// ===========================
async function loadCarListings() {
  try {
    const snap = await db.collection('car_listings').orderBy('createdAt', 'desc').get();
    if (snap.empty) {
      // Add sample listings for demo
      await addSampleListings();
      loadCarListings();
      return;
    }
    renderListings(snap.docs, currentListingsFilter);
  } catch (e) {
    renderListings([], 'all');
  }
}

async function addSampleListings() {
  const samples = [
    { brand: 'Honda', model: 'City', year: 2018, price: 645000, fuelType: 'Petrol', transmission: 'Manual', kmDriven: 45000, owner: '1st Owner', sellerName: 'Rahul Kumar', sellerPhone: '+91 98765 43210', status: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp() },
    { brand: 'Hyundai', model: 'Creta', year: 2021, price: 1245000, fuelType: 'Diesel', transmission: 'Automatic', kmDriven: 25000, owner: '1st Owner', sellerName: 'Amit Sharma', sellerPhone: '+91 87654 32109', status: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp() },
    { brand: 'Tata', model: 'Nexon', year: 2022, price: 895000, fuelType: 'Petrol', transmission: 'Manual', kmDriven: 18000, owner: '1st Owner', sellerName: 'Priya Singh', sellerPhone: '+91 76543 21098', status: 'approved', createdAt: firebase.firestore.FieldValue.serverTimestamp() },
  ];
  for (const s of samples) {
    await db.collection('car_listings').add(s);
  }
}

function filterListings(status) {
  currentListingsFilter = status;
  document.querySelectorAll('#section-listings .tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`#section-listings .tab[data-tab="${status}"]`).classList.add('active');
  loadCarListings();
}

function renderListings(docs, filter) {
  const container = document.getElementById('listings-list');
  let items = docs.map(d => ({ id: d.id, ...d.data() }));
  if (filter !== 'all') {
    items = items.filter(i => i.status === filter);
  }

  if (items.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🚗</div><p class="empty-state-text">No ${filter} listings</p></div>`;
    return;
  }

  container.innerHTML = items.map(car => `
    <div class="listing-card">
      <div class="listing-header">
        <p class="listing-title">${car.brand} ${car.model} ${car.year}</p>
        <span class="listing-badge badge-${car.status}">${car.status}</span>
      </div>
      <div class="listing-details">
        <div class="listing-detail">Fuel: <span>${car.fuelType || 'N/A'}</span></div>
        <div class="listing-detail">Trans: <span>${car.transmission || 'N/A'}</span></div>
        <div class="listing-detail">KM: <span>${(car.kmDriven || 0).toLocaleString()}</span></div>
        <div class="listing-detail">Owner: <span>${car.owner || 'N/A'}</span></div>
        <div class="listing-detail">Seller: <span>${car.sellerName || 'N/A'}</span></div>
        <div class="listing-detail">Phone: <span>${car.sellerPhone || 'N/A'}</span></div>
      </div>
      <p class="listing-price">₹ ${(car.price || 0).toLocaleString()}</p>
      <div class="listing-actions">
        ${car.status === 'pending' ? `
          <button class="btn btn-sm btn-approve" onclick="updateListingStatus('${car.id}', 'approved')">✅ Approve</button>
          <button class="btn btn-sm btn-reject" onclick="updateListingStatus('${car.id}', 'rejected')">❌ Reject</button>
        ` : `
          <button class="btn btn-sm btn-outline" onclick="updateListingStatus('${car.id}', 'pending')">↩️ Reset</button>
          ${car.status === 'approved' ? `<button class="btn btn-sm btn-reject" onclick="updateListingStatus('${car.id}', 'rejected')">❌ Reject</button>` : ''}
          ${car.status === 'rejected' ? `<button class="btn btn-sm btn-approve" onclick="updateListingStatus('${car.id}', 'approved')">✅ Approve</button>` : ''}
        `}
      </div>
    </div>
  `).join('');
}

async function updateListingStatus(id, status) {
  try {
    await db.collection('car_listings').doc(id).update({ status, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
    showToast(`Listing ${status}!`);
    logActivity('🚗', `Car listing ${status} by admin`);
    loadCarListings();
    loadDashboardData();
  } catch (e) {
    showToast('Error: ' + e.message, true);
  }
}

// ===========================
// Bookings
// ===========================
async function loadBookings(filter = 'all') {
  try {
    const snap = await db.collection('bookings').orderBy('createdAt', 'desc').get();
    renderBookingsTable(snap.docs, filter);
  } catch (e) {
    renderBookingsTable([], filter);
  }
}

function filterBookings(filter) {
  document.querySelectorAll('#section-bookings .tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  loadBookings(filter);
}

function renderBookingsTable(docs, filter) {
  const container = document.getElementById('bookings-list');
  let items = docs.map(d => ({ id: d.id, ...d.data() }));
  if (filter !== 'all') {
    items = items.filter(i => i.status === filter);
  }

  if (items.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📋</div><p class="empty-state-text">No ${filter} bookings yet</p></div>`;
    return;
  }

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Service</th>
          <th>Car</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(b => `
          <tr>
            <td>${b.id.slice(0, 8)}...</td>
            <td>${b.service || 'Inspection'}</td>
            <td>${b.car || 'N/A'}</td>
            <td>${b.customerName || 'N/A'}</td>
            <td>${b.date || 'N/A'}</td>
            <td>₹${(b.price || 0).toLocaleString()}</td>
            <td><span class="status-badge badge-${b.status === 'completed' ? 'approved' : b.status === 'confirmed' ? 'approved' : 'pending'}">${b.status || 'pending'}</span></td>
            <td>
              <select onchange="updateBookingStatus('${b.id}', this.value)" style="background:var(--bg);color:var(--text);border:1px solid var(--border);padding:6px;border-radius:6px;font-size:12px">
                <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                <option value="mechanic_assigned" ${b.status === 'mechanic_assigned' ? 'selected' : ''}>Mechanic Assigned</option>
                <option value="in_progress" ${b.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Completed</option>
                <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

async function updateBookingStatus(id, status) {
  try {
    await db.collection('bookings').doc(id).update({ status });
    showToast(`Booking updated to ${status}`);
    logActivity('📋', `Booking ${id.slice(0,8)} updated to ${status}`);
  } catch (e) {
    showToast('Error: ' + e.message, true);
  }
}

// ===========================
// Users
// ===========================
async function loadUsers() {
  try {
    const snap = await db.collection('users').get();
    renderUsersTable(snap.docs);
  } catch (e) {
    renderUsersTable([]);
  }
}

function renderUsersTable(docs) {
  const container = document.getElementById('users-list');
  if (docs.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">👥</div><p class="empty-state-text">No registered users yet</p></div>`;
    return;
  }

  const items = docs.map(d => ({ id: d.id, ...d.data() }));
  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Joined</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(u => `
          <tr>
            <td>${u.name || 'N/A'}</td>
            <td>${u.email || 'N/A'}</td>
            <td>${u.phone || 'N/A'}</td>
            <td>${u.createdAt ? formatTime(u.createdAt) : 'N/A'}</td>
            <td><span class="status-badge badge-approved">Active</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

// ===========================
// Emergency Requests
// ===========================
async function loadEmergencyRequests() {
  try {
    const snap = await db.collection('emergency_requests').orderBy('timestamp', 'desc').get();
    renderEmergencyList(snap.docs);
  } catch (e) {
    renderEmergencyList([]);
  }
}

function renderEmergencyList(docs) {
  const container = document.getElementById('emergency-list');
  if (docs.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🚨</div><p class="empty-state-text">No emergency requests</p></div>`;
    return;
  }

  container.innerHTML = docs.map(d => {
    const e = d.data();
    return `<div class="listing-card">
      <div class="listing-header">
        <p class="listing-title">${e.type || 'Emergency'}</p>
        <span class="listing-badge badge-${e.status === 'resolved' ? 'approved' : 'pending'}">${e.status || 'pending'}</span>
      </div>
      <div class="listing-details">
        <div class="listing-detail">User: <span>${e.userName || 'N/A'}</span></div>
        <div class="listing-detail">Phone: <span>${e.userPhone || 'N/A'}</span></div>
        <div class="listing-detail">Location: <span>${e.location || 'N/A'}</span></div>
        <div class="listing-detail">Time: <span>${e.timestamp ? formatTime(e.timestamp) : 'N/A'}</span></div>
      </div>
      <div class="listing-actions">
        <button class="btn btn-sm btn-approve" onclick="resolveEmergency('${d.id}')">✅ Resolved</button>
      </div>
    </div>`;
  }).join('');
}

async function resolveEmergency(id) {
  try {
    await db.collection('emergency_requests').doc(id).update({ status: 'resolved' });
    showToast('Emergency marked as resolved');
    loadEmergencyRequests();
  } catch (e) {
    showToast('Error: ' + e.message, true);
  }
}

// ===========================
// App Settings
// ===========================
async function saveAppSettings() {
  try {
    const settings = {
      appName: document.getElementById('setting-app-name').value,
      supportNumber: document.getElementById('setting-support-number').value,
      supportEmail: document.getElementById('setting-support-email').value,
      minVersion: document.getElementById('setting-min-version').value,
      maintenanceMsg: document.getElementById('setting-maintenance-msg').value,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    await db.collection('app_config').doc('settings').set(settings);
    showToast('App settings saved!');
    logActivity('⚙️', 'App settings updated by admin');
  } catch (e) {
    showToast('Error: ' + e.message, true);
  }
}

// Load saved settings
async function loadAppSettings() {
  try {
    const doc = await db.collection('app_config').doc('settings').get();
    if (doc.exists) {
      const s = doc.data();
      document.getElementById('setting-app-name').value = s.appName || 'Auto Pro';
      document.getElementById('setting-support-number').value = s.supportNumber || '8839533202';
      document.getElementById('setting-support-email').value = s.supportEmail || 'support@autopro.in';
      document.getElementById('setting-min-version').value = s.minVersion || '1.0.0';
      document.getElementById('setting-maintenance-msg').value = s.maintenanceMsg || '';
    }
  } catch (e) {
    console.log('Settings not found, using defaults');
  }
}

// ===========================
// Utility Functions
// ===========================
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${isError ? 'error' : ''}`;
  setTimeout(() => { toast.className = 'toast'; }, 3000);
}

function formatTime(timestamp) {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

async function logActivity(icon, message) {
  try {
    await db.collection('activity_log').add({
      icon,
      message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {
    console.log('Activity log error:', e);
  }
}

// Enter key login
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && document.getElementById('login-screen').style.display !== 'none') {
    handleLogin();
  }
});
