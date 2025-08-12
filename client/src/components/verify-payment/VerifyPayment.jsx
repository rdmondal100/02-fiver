"use client";
import axiosInstance from "@/config/axiosConfig";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import PageLoader from "../loaders/pageLoader";

const VerifyPayment = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const verifySession = async (sessionId) => {
    setIsVerifying(true);
    try {
      const res = await axiosInstance.get(
        `/subscription/verify-session?session_id=${sessionId}`
      );
      const data = res.data;
      if (data.success) {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("cancel");
      }
    } catch (error) {
      console.error(
        "Session verification failed:",
        error?.response?.data || error.message
      );
      setPaymentStatus("cancel");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      verifySession(sessionId);
    }
  }, [sessionId]);

  const clearSessionIdFromUrl = () => {
    router.replace("/subscription");
  };

  const handleOk = async () => {
    clearSessionIdFromUrl();
  };

  if (isVerifying) {
    return <PageLoader />;
  }
  return (
    <div className="min-h-[90dvh] flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full"
      >
        {paymentStatus === "success" ? (
          <HiCheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        ) : (
          <HiXCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
        )}

        <h1
          className={`text-3xl font-bold mb-2 ${
            paymentStatus === "success" ? "text-green-700" : "text-red-700"
          }`}
        >
          {paymentStatus === "success"
            ? "Payment Successful!"
            : "Payment Failed"}
        </h1>

        <p className="text-gray-600 mb-6">
          {paymentStatus === "success"
            ? "Thank you for upgrading to Pro! Enjoy the new features."
            : "Oops! Something went wrong with your payment. Please try again."}
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOk}
          className="w-full bg-[#074c77] text-white rounded-full py-3 hover:bg-cyan-600 transition duration-300"
        >
          OK
        </motion.button>
      </motion.div>
    </div>
  );
};

export default VerifyPayment;
