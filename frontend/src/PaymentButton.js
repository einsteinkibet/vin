import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { paymentAPI } from '../../services/api';

const PaymentButton = ({ planId, amount, description }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // 1. Call your backend to create payment
      const response = await paymentAPI.createSession(planId);
      
      // 2. Get Paystack authorization URL
      const { authorization_url, reference } = response.data;
      
      // 3. Redirect to Paystack
      window.location.href = authorization_url;
      
      // Paystack will handle payment and redirect back to your success URL
      
    } catch (error) {
      toast.error('Payment setup failed: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment}
      disabled={loading}
      className="btn btn-success"
    >
      {loading ? 'Processing...' : `Upgrade - KES ${amount}`}
    </button>
  );
};

export default PaymentButton;
