import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import API from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineLockClosed, HiOutlineCheckCircle } from 'react-icons/hi';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const cardStyle = {
  style: {
    base: {
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '16px',
      '::placeholder': { color: '#64748b' },
    },
    invalid: { color: '#ef4444' },
  },
};

const CheckoutForm = ({ booking, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    try {
      // Step 1: Create payment intent
      const { data: intentData } = await API.post('/payments/create-payment-intent', {
        bookingId: booking._id,
      });

      // Step 2: Confirm with Stripe
      const result = await stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Step 3: Confirm with backend
        await API.post('/payments/confirm', {
          bookingId: booking._id,
          paymentIntentId: result.paymentIntent.id,
        });
        toast.success('Payment successful!');
        onSuccess();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Payment failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="card-element-wrapper">
        <label>Card Details</label>
        <div className="card-element-container">
          <CardElement options={cardStyle} />
        </div>
      </div>

      {error && <div className="checkout-error">{error}</div>}

      <div className="checkout-info">
        <p>Test card: <code>4242 4242 4242 4242</code></p>
        <p>Any future date, any CVC</p>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block btn-lg"
        disabled={!stripe || processing}
      >
        <HiOutlineLockClosed />
        {processing ? 'Processing...' : `Pay $${booking.totalAmount?.toFixed(2)}`}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await API.get(`/bookings/${id}`);
        if (data.success) {
          if (data.data.paymentStatus === 'completed') {
            setSuccess(true);
          }
          setBooking(data.data);
        }
      } catch {
        toast.error('Booking not found');
        navigate('/bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, navigate]);

  const handleSuccess = () => {
    setSuccess(true);
  };

  if (loading) return <div className="page-center"><LoadingSpinner size="lg" /></div>;
  if (!booking) return null;

  if (success) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="payment-success">
            <HiOutlineCheckCircle size={80} className="success-icon" />
            <h1>Payment Successful!</h1>
            <p>Your booking has been confirmed. You'll receive a confirmation email shortly.</p>
            <div className="payment-success-details">
              <p><strong>Event:</strong> {booking.event?.title}</p>
              <p><strong>Amount:</strong> ${booking.totalAmount?.toFixed(2)}</p>
            </div>
            <div className="payment-success-actions">
              <button className="btn btn-primary" onClick={() => navigate(`/bookings/${booking._id}`)}>
                View Booking
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/events')}>
                Browse More Events
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container">
        <button className="btn btn-ghost back-btn" onClick={() => navigate(`/bookings/${booking._id}`)}>
          <HiOutlineArrowLeft /> Back to Booking
        </button>

        <div className="payment-grid">
          <div className="payment-form-section">
            <h1>Complete Payment</h1>
            <p>Secure payment powered by Stripe</p>

            <Elements stripe={stripePromise}>
              <CheckoutForm booking={booking} onSuccess={handleSuccess} />
            </Elements>
          </div>

          <div className="payment-summary-section">
            <div className="payment-summary-card">
              <h3>Order Summary</h3>
              <div className="payment-summary-event">
                <h4>{booking.event?.title}</h4>
                <p>{booking.event?.venue?.name}</p>
              </div>
              <div className="payment-summary-tickets">
                {booking.tickets?.map((t, i) => (
                  <div key={i} className="payment-summary-ticket">
                    <span>{t.quantity}x {t.ticketType}</span>
                    <span>${(t.quantity * t.pricePerTicket).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="payment-summary-total">
                <span>Total</span>
                <span>${booking.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
