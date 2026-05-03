import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useApp } from '../../context/AppContext';
import { db } from '../../config/firebase';
import Header from '../../components/Header';
import './Inspection.css';

export default function PaymentScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [selectedPayment, setSelectedPayment] = useState('pay_on_spot');
  const [loading, setLoading] = useState(false);

  const price = state.currentBooking.service?.price || 999;

  const paymentOptions = [
    { id: 'upi', name: 'UPI', desc: 'Pay using any UPI App', icon: 'UPI' },
    { id: 'card', name: 'Card', desc: 'Debit / Credit Card', icon: 'CARD' },
    { id: 'netbanking', name: 'Net Banking', desc: 'All Major Banks', icon: 'BANK' },
    { id: 'pay_on_spot', name: 'Pay on Spot', desc: 'Pay after service (Cash/UPI)', icon: 'CASH' },
  ];

  const generateBookingId = () => 'AP' + Date.now().toString().slice(-10);

  const buildBooking = (bookingId, paymentMethod, razorpayId = null) => {
    const service = state.currentBooking.service;
    const carDetails = state.currentBooking.carDetails || {};
    const pickupDetails = state.currentBooking.pickupDetails || {};
    const pickupDate = pickupDetails.date || 'Today';
    const pickupTime = pickupDetails.timeSlot || '11:00 AM';

    return {
      id: bookingId,
      userId: state.user?.uid || null,
      customerName: state.user?.name || 'Customer',
      customerPhone: state.user?.phone || '',
      customerEmail: state.user?.email || '',
      service: service?.name || 'Pre-Purchase Inspection',
      car: `${carDetails.brand || 'Honda'} ${carDetails.model || 'City'} - ${carDetails.year || '2018'}`,
      carDetails,
      pickupDetails,
      date: `${pickupDate} - ${pickupTime}`,
      pickupDate,
      pickupTime,
      location: pickupDetails.location || 'Raipur, Chhattisgarh',
      status: 'mechanic_assigned',
      price,
      payment: paymentMethod,
      paymentStatus: paymentMethod === 'pay_on_spot' ? 'pending' : 'paid',
      razorpayId,
      reportStatus: 'pending',
      mechanicName: 'Rohit Sharma',
      mechanicRating: 4.8,
      mechanicJobs: 125,
      mechanicVehicle: 'Maruti Ertiga - DL 12 AB 1234',
    };
  };

  const saveBooking = async (bookingId, paymentMethod, razorpayId = null) => {
    const newBooking = buildBooking(bookingId, paymentMethod, razorpayId);

    try {
      await setDoc(doc(db, 'bookings', bookingId), {
        ...newBooking,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Booking save error:', error);
      alert('Booking created, but admin sync failed. Please check internet or Firestore rules.');
    }

    dispatch({ type: 'ADD_BOOKING', payload: newBooking });
    dispatch({ type: 'SET_PAYMENT', payload: paymentMethod });
    navigate('/inspection/confirmed', { state: { bookingId } });
  };

  const openRazorpay = async () => {
    const bookingId = generateBookingId();

    try {
      const orderResponse = await fetch(
        'https://us-central1-auto-pro-5a1ec.cloudfunctions.net/createOrder',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: price }),
        }
      );

      const orderData = await orderResponse.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Auto Pro',
        description: state.currentBooking.service?.name || 'Car Inspection Service',
        image: '/logo.png',
        order_id: orderData.id,
        handler: async function (response) {
          const verifyResponse = await fetch(
            'https://us-central1-auto-pro-5a1ec.cloudfunctions.net/verifyPayment',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            await saveBooking(bookingId, selectedPayment, response.razorpay_payment_id);
          } else {
            alert('Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: state.user?.name || 'Customer',
          email: state.user?.email || 'customer@autopro.com',
          contact: state.user?.phone || '9876543210',
        },
        notes: { booking_id: bookingId },
        theme: { color: '#E53935' },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      if (selectedPayment === 'upi') {
        options.method = { upi: true };
      }

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error('Payment Failed:', response.error);
        alert('Payment failed: ' + response.error.description);
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Payment system error. Try again.');
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);

    if (selectedPayment === 'pay_on_spot') {
      await saveBooking(generateBookingId(), 'pay_on_spot');
      return;
    }

    await openRazorpay();
  };

  return (
    <div className="screen screen-with-header" id="payment-screen">
      <Header title="Payment" />

      <div className="screen-content">
        <div className="payment-total">
          <p className="payment-total-label">Total Amount</p>
          <p className="payment-total-amount">Rs {price}</p>
          <p className="payment-total-expand">View Price Details</p>
        </div>

        <p className="payment-options-title">Choose Payment Option</p>

        <div className="payment-options">
          {paymentOptions.map((option) => (
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
          {loading
            ? 'Processing...'
            : selectedPayment === 'pay_on_spot'
              ? 'Confirm Booking'
              : `Pay Rs ${price}`}
        </button>
      </div>
    </div>
  );
}
