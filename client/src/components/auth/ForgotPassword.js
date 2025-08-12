"use client";

import axiosInstance from '@/config/axiosConfig';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/auth/forgot-password`, data);
      const { success } = response.data;
      if (success) {
        toast.success('Reset link sent! Check your email.');
        reset();
        return;
      }
    } catch (error) {
      toast.error('Failed to send reset token.');
      console.error('Error:', error.response ? error.response.data : error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center min-h-[90dvh] items-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-white p-8  rounded-lg shadow-lg w-full max-w-md h-fit"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-center mb-6 text-gray-800"
        >
          Forgot Password
        </motion.h1>

        <motion.form
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Email Field */}
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="Your email"
                className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#074c77] text-white py-3 rounded-full font-semibold hover:bg-cyan-600 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Requesting...' : 'Request Reset Link'}
          </motion.button>
          <p className="mt-4 text-center text-sm text-gray-500">
            Back to{" "}
            <Link href="/login" className="text-blue-600">
              Log In
            </Link>
          </p>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
