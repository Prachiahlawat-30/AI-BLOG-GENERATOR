import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import StatusMessage from "../Alert/StatusMessage";

const FreePlanSignup = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const plan = params.plan;
  const amount = searchParams.get("amount");

  const [errorMessage, setErrorMessage] = useState(null);

  // 🔥 Create order (instead of Stripe intent)
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(
        "/api/v1/payments/create-order",
        data
      );
      return res.data;
    },
  });

  // 🔥 Handle payment (no form submit needed)
  const handlePayment = async () => {
    try {
      const data = {
  amount,
  plan,
 
};

      // 1️⃣ Create order from backend
      const order = await mutation.mutateAsync(data);

      // 2️⃣ Razorpay options
      const options = {
        key: "rzp_test_Sezop0U65SDBPT", // 🔑 replace this
        amount: order.order.amount,
        currency: "INR",
        name: "AI SaaS Platform",
        description: plan,
        order_id: order.order.id,

        handler: function (response) {
          // ✅ Payment success
          alert("Payment Successful 🎉");

          console.log("Payment Response:", response);

          // 👉 send response to backend for verification (next step)
        },

        prefill: {
          name: "User",
          email: "user@example.com",
        },

        theme: {
          color: "#6366f1",
        },
      };

      // 3️⃣ Open Razorpay popup
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="bg-gray-900 h-screen -mt-4 flex justify-center items-center">
      <div className="w-96 mx-auto my-4 p-6 bg-white rounded-lg shadow-md">

        {/* Loading */}
        {mutation?.isPending && (
          <StatusMessage type="loading" message="Processing please wait..." />
        )}

        {/* Error */}
        {mutation?.isError && (
          <StatusMessage
            type="error"
            message={mutation?.error?.response?.data?.error}
          />
        )}

        {/* Razorpay Button */}
        <button
          onClick={handlePayment}
          className="w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-linear-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
        >
          Pay ₹{amount}
        </button>

        {errorMessage && (
          <div className="text-red-500 mt-4">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default FreePlanSignup;