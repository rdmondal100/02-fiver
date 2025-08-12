"use client";
import axiosInstance from "@/config/axiosConfig";
import { formatFullDate } from "@/utils/helpers";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import PageLoader from "../loaders/pageLoader";

const SubscriptionPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchSubscriptionStatus = async () => {
    try {
      const response = await axiosInstance.get(`/subscription/status`);

      setSubscriptionDetails(response.data);
    } catch (error) {
      console.error(
        "Error fetching subscription status:",
        error?.response?.data || error.message
      );
      if (error.response?.status !== 401) {
        toast.error("Failed to fetch subscription status");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canSubscribeFree =
    subscriptionDetails &&
    subscriptionDetails.isSubscribed === false &&
    !subscriptionDetails.startDate &&
    !subscriptionDetails.endDate;

  const plans = [
    {
      name: "Free Plan",
      price: "$0",
      period: "Forever",
      features: [
        "Basic language exchange",
        "Community access",
        "Basic chat features",
        "Limited partner search",
      ],
      buttonText: canSubscribeFree
        ? "Subscribe to Free Plan"
        : subscriptionDetails?.status === "free"
        ? "Current Plan"
        : "Not Active",
      isPopular: false,
      disabled: !canSubscribeFree,
    },
    {
      name: "Pro Plan",
      price: "$9.99",
      period: "per month",
      features: [
        "Unlimited language exchange",
        "Daily nature news & health tips",
        "Advanced partner matching",
        "Priority chat features",
        "Audio call",
        "Video call",
        "Advanced analytics",
        "Premium community features",
      ],
      buttonText: canSubscribeFree
        ? "Subscribe to Premium"
        : subscriptionDetails?.status === "premium" &&
          !subscriptionDetails?.expire
        ? `Renews on ${formatFullDate(subscriptionDetails?.endDate)}`
        : "Upgrade Now",
      isPopular: true,
      disabled:
        subscriptionDetails?.status === "premium" &&
        !subscriptionDetails?.expire,
    },
  ];

  const handleUpgrade = async () => {
    if (!currentUser) {
      toast.error("Please log in to upgrade your subscription");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/subscription/create-session`,
        {
          userId: currentUser._id,
        }
      );

      const { sessionUrl } = response.data;
      if (sessionUrl) {
        window.location.href = sessionUrl; // Redirect user to Stripe checkout
      } else {
        toast.error("Failed to initiate checkout session");
      }
    } catch (error) {
      console.error(
        "Error creating checkout session:",
        error?.response?.data || error.message
      );
      toast.error("Failed to create checkout session");
    }
  };

  const handleFreeSubscribe = async () => {
    if (!currentUser) {
      toast.error("Please log in to subscribe to the Free Plan");
      return;
    }
    try {
      const response = await axiosInstance.post("/subscription/subscribe-free");
      toast.success("You have subscribed to the Free Plan!");
      fetchSubscriptionStatus(); // Refresh status
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to subscribe to the Free Plan."
      );
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [currentUser?._id]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-[90dvh] bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Unlock premium features to enhance your language learning journey
          </p>
          {subscriptionDetails?.status === "premium" &&
            !subscriptionDetails?.expire && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg inline-block">
                <p className="text-green-700">
                  You are currently on the Pro Plan. Your subscription will
                  renew on{" "}
                  <span className="font-semibold">
                    {formatFullDate(subscriptionDetails?.endDate)}
                  </span>
                </p>
              </div>
            )}

          {subscriptionDetails?.expire && (
            <div className="mt-4 p-4 bg-red-100 rounded-lg inline-block">
              <p className="text-red-700 font-medium">
                Your premium subscription has expired. You are now on the Free
                Plan.
              </p>
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl overflow-hidden shadow-lg bg-white p-8 relative ${
                plan.isPopular ? "border-2 border-blue-500" : ""
              } ${
                subscriptionDetails?.status === "premium" &&
                plan.name === "Pro Plan"
                  ? "ring-4 ring-green-400"
                  : ""
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex justify-center items-baseline mb-2">
                  <span className="text-5xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="mb-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={
                  plan.name === "Free Plan"
                    ? plan.disabled
                      ? undefined
                      : handleFreeSubscribe
                    : plan.disabled
                    ? undefined
                    : handleUpgrade
                }
                disabled={plan.disabled}
                className={`w-full py-3 px-6 rounded-lg text-center font-semibold transition-colors duration-200 ${
                  plan.disabled
                    ? subscriptionDetails?.status === "premium" &&
                      plan.name === "Pro Plan"
                      ? "bg-green-100 text-green-800 cursor-default"
                      : "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
