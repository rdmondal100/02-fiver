"use client";

import axiosInstance from "@/config/axiosConfig";
import { API_URL } from "@/config/urls";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import PageLoader from "../loaders/pageLoader";
import PasswordField from "../ui/PasswordField";

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const hasHandledToken = useRef(false); // <- NEW
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token && !hasHandledToken.current) {
      localStorage.setItem("token", token); // Save the token in local storage
      hasHandledToken.current = true;  // mark it handled
      toast.success("Login successful!");
      router.replace("/profile");
    }
  }, [token]);


  const handleSocialLogin = (type) => {
    router.replace(`${API_URL}/auth/${type}`)
  };
  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Call the login API
      const response = await axiosInstance.post(`/auth/login`, {
        email: data.email,
        password: data.password,
      });

      // If login is successful
      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Save the token in local storage
        // Save the token in a cookie
        toast.success("Login successful!");

        // Redirect to the profile page or any other page
        router.replace("/profile");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        toast.error(
          error.response.data.message || "Login failed. Please try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <>
      {
        token ?
          <PageLoader /> :
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
                Log In
              </motion.h1>

              {/* Social Media Buttons */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="space-y-4 mb-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center border border-gray-300 rounded-full py-2 hover:border-[#074c77] active:opacity-40"
                  onClick={() => handleSocialLogin("facebook")}

                >
                  <FaFacebook className="text-blue-600 mr-2 text-2xl" />
                  Sign in with Facebook
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center border border-gray-300 rounded-full py-2 hover:border-[#074c77] active:opacity-40"
                  onClick={() => handleSocialLogin("google")}
                >
                  <FcGoogle className="text-red-500 mr-2 text-2xl" />
                  Sign in with Google
                </motion.button>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center my-6"
              >
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-2 text-gray-500">or</span>
                <hr className="flex-grow border-t border-gray-300" />
              </motion.div>

              {/* Form for Email and Password */}
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
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      placeholder="Your email"
                      className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"
                        } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}

                {/* Password Field */}
                <Controller
                  name="password"
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
                      placeholder="Your password"
                      className="w-full border rounded-lg p-3 focus:outline-none focus:border-blue-500"
                    />
                  )}
                />
                <p className="mt-4 ms-auto w-fit text-sm text-gray-500">
                  Forgot Password ?{" "}
                  <Link href="/forgot-password" className="text-blue-600">
                    Reset it
                  </Link>
                </p>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#074c77] text-white py-3 rounded-full font-semibold hover:bg-cyan-600 transition duration-200 disabled:opacity-50"
                >
                  {isLoading ? "Logging you in..." : "Log In"}
                </motion.button>
                <p className="mt-4 text-center text-sm text-gray-500">
                  Don’t have an account?{" "}
                  <Link href="/sign-up" className="text-blue-600">
                    Sign Up
                  </Link>
                </p>
              </motion.form>
            </motion.div>
          </motion.div>
      }

    </>
  );
};

export default Login;
