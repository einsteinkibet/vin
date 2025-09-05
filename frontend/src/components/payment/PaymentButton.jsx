import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { paymentAPI } from '../../services/api';

const PaymentButton = ({ planId, amount, description, vin }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    setLoading(true);
    
    try {
      // Call backend to create Paystack payment
      const response = await paymentAPI.createSession(vin, planId);
      
      // Redirect to Paystack
      window.location.href = response.data.authorization_url;
      
    } catch (error) {
      toast.error('Payment setup failed: ' + (error.response?.data?.error || error.message));
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment}
      disabled={loading}
      className="btn btn-success w-100"
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" />
          Processing...
        </>
      ) : (
        `Upgrade - KES ${amount}`
      )}
    </button>
  );
};

export default PaymentButton;
