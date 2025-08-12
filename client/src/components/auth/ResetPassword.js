"use client";

import axiosInstance from '@/config/axiosConfig';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import PasswordField from '../ui/PasswordField';
import { useState } from 'react';

const ResetPassword = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset, watch
  } = useForm();
  const password = watch("newPassword");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }
    setIsLoading(true)
    try {
      const response = await axiosInstance.post(`/auth/reset-password`, {
        token,
        ...data,
      });
      const { success } = response.data;
      if (success) {
        toast.success('Password reset successfully!');
        reset();
        router.push('/login'); // Redirect to login after success
        return;
      }
    } catch (error) {
      toast.error('Failed to reset password.');
      console.error('Error:', error.response ? error.response.data : error);
    } finally {
      setIsLoading(false)
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
          Reset Password
        </motion.h1>

        <motion.form
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Password Field */}
          <Controller
            name="newPassword"
            control={control}
            defaultValue=""
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field }) => (
              <PasswordField
                getFieldValues={field}
                fieldErrors={errors}
                placeholder="New Password"
                className="w-full border rounded-lg p-3 focus:outline-none focus:border-blue-500"
              />
            )}
          />

          {/* Confirm Password Field */}
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            rules={{
              required: "Confirm Password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            render={({ field }) => (
              <PasswordField
                getFieldValues={field}
                fieldErrors={errors}
                placeholder="Confirm New Password"
                className="w-full border rounded-lg p-3 focus:outline-none focus:border-blue-500"
              />
            )}
          />
          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#074c77] text-white py-3 rounded-full font-semibold hover:bg-cyan-600 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default ResetPassword;
