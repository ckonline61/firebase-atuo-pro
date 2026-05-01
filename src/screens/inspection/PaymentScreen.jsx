import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import './Inspection.css';

export default function PaymentScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [selectedPayment, setSelectedPayment] = useState('pay_on_spot');
  const [loading, setLoading] = useState(false);
  const price = state.currentBooking.service?.price || 999;

  const paymentOptions = [
    { id: 'upi', name: 'UPI', desc: 'Pay using any UPI App', icon: '📱' },
    { id: 'card', name: 'Card', desc: 'Debit / Credit Card', icon: '💳' },
    { id: 'netbanking', name: 'Net Banking', desc: 'All Major Banks', icon: '🏦' },
    { id: 'pay_on_spot', name: 'Pay on Spot', desc: 'Pay after service (Cash/UPI)', icon: '💵' }
  ];

  const generateBookingId = () => 'AP' + Date.now().toString().slice(-10);

  const saveBooking = (bookingId, paymentMethod, razorpayId = null) => {
    const newBooking = {
      id: bookingId,
      service: state.currentBooking.service?.name || 'Pre-Purchase Inspection',
      car: `${state.currentBooking.carDetails.brand || 'Honda'} ${state.currentBooking.carDetails.model || 'City'} • ${state.currentBooking.carDetails.year || '2018'}`,
      date: `${state.currentBooking.pickupDetails.date || 'Today'} • ${state.currentBooking.pickupDetails.timeSlot || '11:00 AM'}`,
      location: state.currentBooking.pickupDetails.location || 'Connaught Place, Delhi',
      status: 'mechanic_assigned',
      price,
      payment: paymentMethod,
      razorpayId,
      mechanicName: 'Rohit Sharma',
      mechanicRating: 4.8,
      mechanicJobs: 125,
      mechanicVehicle: 'Maruti Ertiga - DL 12 AB 1234'
    };
    dispatch({ type: 'ADD_BOOKING', payload: newBooking });
    dispatch({ type: 'SET_PAYMENT', payload: paymentMethod });
    navigate('/inspection/confirmed', { state: { bookingId } });
  };

  const openRazorpay = () => {
    const bookingId = generateBookingId();
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Sk62kaPXtlTzL5',
      amount: price * 100, // Razorpay me paisa (paise) me dena hota hai
      currency: 'INR',
      name: 'Auto Pro',
      description: state.currentBooking.service?.name || 'Car Inspection Service',
      image: '/logo.png',
      handler: function (response) {
        // Payment successful!
        console.log('Payment Success:', response);
        saveBooking(bookingId, selectedPayment, response.razorpay_payment_id);
      },
      prefill: {
        name: state.user?.name || 'Customer',
        email: state.user?.email || 'customer@autopro.com',
        contact: state.user?.phone || '9876543210'
      },
      notes: {
        booking_id: bookingId,
        service: state.currentBooking.service?.name
      },
      theme: {
        color: '#E53935'
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          console.log('Payment cancelled by user');
        }
      }
    };

    // Razorpay payment method prefill based on selection
    if (selectedPayment === 'upi') {
      options.prefill.method = 'upi';
    } else if (selectedPayment === 'card') {
      options.prefill.method = 'card';
    } else if (selectedPayment === 'netbanking') {
      options.prefill.method = 'netbanking';
    }

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error('Payment Failed:', response.error);
        alert('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error('Razorpay error:', error);
      alert('Payment gateway not available. Booking as Pay on Spot.');
      saveBooking(bookingId, 'pay_on_spot');
    }
  };

  const handleConfirm = () => {
    setLoading(true);
    
    if (selectedPayment === 'pay_on_spot') {
      // No payment gateway needed
      const bookingId = generateBookingId();
      saveBooking(bookingId, 'pay_on_spot');
    } else {
      // Open Razorpay for online payment
      openRazorpay();
    }
  };

  return (
    <div className="screen screen-with-header" id="payment-screen">
      <Header title="Payment" />
      <div className="screen-content">
        <div className="payment-total">
          <p className="payment-total-label">Total Amount</p>
          <p className="payment-total-amount">₹ {price}</p>
          <p className="payment-total-expand">View Price Details ▾</p>
        </div>

        <p className="payment-options-title">Choose Payment Option</p>
        <div className="payment-options">
          {paymentOptions.map(option => (
            <button
              key={option.id}
              className={`payment-option ${selectedPayment === option.id ? 'selected' : ''}`}
              onClick={() => setSelectedPayment(option.id)}
              id={`payment-${option.id}`}
            >
              <div className="payment-option-icon">{option.icon}</div>
              <div className="payment-option-info">
                <h4>{option.name}</h4>
                <p>{option.desc}</p>
              </div>
              <div className="payment-option-radio"></div>
            </button>
          ))}
        </div>
      </div>
      <div className="bottom-action">
        <button 
          className="btn btn-dark" 
          onClick={handleConfirm} 
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
          id="btn-confirm-booking"
        >
          {loading ? 'Processing...' : selectedPayment === 'pay_on_spot' ? 'Confirm Booking' : `Pay ₹${price}`}
        </button>
      </div>
    </div>
  );
}
