import axios from "axios";

// ===== FREE PLAN =====
export const handleFreeSubscriptionAPI = async () => {
  const response = await axios.post(
    "/api/v1/payments/free-plan",
    {},
    {
      withCredentials: true,
    }
  );

  return response?.data;
};

// ===== CREATE ORDER =====
export const createRazorpayOrderAPI = async (payment) => {
  const response = await axios.post(
    "/api/v1/payments/create-order",
    {
      amount: Number(payment?.amount),
      plan: payment?.plan,
    },
    {
      withCredentials: true,
    }
  );

  return response?.data;

};

// ===== VERIFY PAYMENT =====
export const verifyPaymentAPI = async (paymentData) => {
  const response = await axios.post(
    "/api/v1/payments/verify-payment",
    {
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_signature: paymentData.razorpay_signature,
    },
    {
      withCredentials: true,
    }
  );

  return response?.data;
};