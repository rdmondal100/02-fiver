"use client";
import axiosInstance from "@/config/axiosConfig";
import { LANGUAGES } from "@/config/languages";
import { API_URL } from "@/config/urls";
import { motion } from "framer-motion"; // For animations
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import PasswordField from "../ui/PasswordField";
import { CountryDropdown } from "react-country-region-selector";
import { useSearchParams } from "next/navigation";

const Register = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const router = useRouter();
  const password = watch("password");
  const [isLoading, setIsLoading] = useState(false)

  const searchParams = useSearchParams();
  const language = searchParams.get('language') || '';
  useEffect(() => {
    if (language) {
      setValue("language", language);
    }
  }, [language, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Call the register API
      const response = await axiosInstance.post(`/auth/register`, data);

      // If registration is successful
      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Save the token in local storage
        // Save the token in a cookie
        toast.success("Registration successful!");
        // Redirect to the profile page
        router.push("/profile");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        toast.error(
          error.response.data.message ||
          "Registration failed. Please try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false)
    }
  };
  const handleSocialSignUp = (type) => {
    router.replace(`${API_URL}/auth/${type}`)
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center items-center min-h-[90dvh] bg-gray-100"
    >
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Sign Up
        </h1>

        {/* Social Media Buttons */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-between space-x-2 mb-4"
        >
          {/* Social buttons (Facebook, Apple, Google) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-center border border-gray-300 rounded-full py-2 px-4 hover:border-[#074c77] active:opacity-40"
            onClick={() => handleSocialSignUp("facebook")}

          >
            <FaFacebook className="text-blue-600 mr-2 text-xl" />
            Facebook
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-center border border-gray-300 rounded-full py-2 px-4 hover:border-[#074c77] active:opacity-40"
            onClick={() => handleSocialSignUp("google")}

          >
            <FcGoogle className="text-red-500 mr-2 text-xl" />
            Google
          </motion.button>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center my-4"
        >
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-gray-500">or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </motion.div>

        {/* Form for Registration Fields */}
        <motion.form
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name Field */}
            <div>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{
                  required: "Full Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Your full name"
                    className={`w-full border ${errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
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
            </div>

            {/* Password Field */}
            <div>
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
            </div>

            {/* Confirm Password Field */}
            <div>
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
                    placeholder="Confirm password"
                    className="w-full border rounded-lg p-3 focus:outline-none focus:border-blue-500"
                  />
                )}
              />
            </div>
          </div>

          {/* Date of Birth Field */}
          <Controller
            name="dateOfBirth"
            control={control}
            defaultValue={null}
            rules={{ required: "Date of Birth is required" }}
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                placeholderText="Select your date of birth"
                className={`w-full border ${errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                  } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
                dateFormat="yyyy-MM-dd"
                wrapperClassName="w-full"
                maxDate={new Date()}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
              />
            )}
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
          )}

          <Controller
            name="language"
            control={control}
            defaultValue={''}
            rules={{ required: "Please select a language" }}
            render={({ field }) => (
              <select
                {...field}
                className={`w-full border ${errors.language ? "border-red-500" : "border-gray-300"
                  } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
              >
                <option value="" disabled>
                  Which language do you want to learn?
                </option>
                {LANGUAGES?.map((lang) => (
                  <option value={lang.value}>{lang?.show}</option>
                ))}
              </select>
            )}
          />
          {errors.language && (
            <p className="text-red-500 text-sm mt-1">{errors.language.message}</p>
          )}
          {/* Country Field */}
          <Controller
            name="country"
            control={control}
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <CountryDropdown
                {...field}
                value={field.value}
                onChange={(val) => field.onChange(val)}
                className={`w-full border ${errors.country ? "border-red-500" : "border-gray-300"
                  } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
              />
            )}
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}

          {/* Location Field */}
          <Controller
            name="location"
            control={control}
            defaultValue=""
            rules={{ required: "Location is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Your city/location"
                className={`w-full border ${errors.location ? "border-red-500" : "border-gray-300"
                  } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
              />
            )}
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}

          {/* Tandem ID Field */}
          {/* <Controller
            name="tandemID"
            control={control}
            defaultValue=""
            rules={{
              required: "Tandem ID is required",
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Your Tandem ID"
                className={`w-full border ${errors.tandemID ? "border-red-500" : "border-gray-300"
                  } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
              />
            )}
          />
          {errors.tandemID && (
            <p className="text-red-500 text-sm">{errors.tandemID.message}</p>
          )} */}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#074c77] text-white rounded-full py-3 hover:bg-cyan-600 transition duration-300 disabled:opacity-50"
          >
            {isLoading ? "Signing you up..." : "Sign Up"}
          </motion.button>
        </motion.form>

        {/* Already have an account? */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600">
            Log In
          </Link>
        </p>
      </motion.div>
    </motion.div >
  );
};

export default Register;
