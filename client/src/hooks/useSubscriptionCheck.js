// hooks/useSubscriptionCheck.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/config/axiosConfig";

const useSubscriptionCheck = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [redirectReason, setRedirectReason] = useState(null);

  useEffect(() => {
    const checkSubscription = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        setRedirectReason("Please login to continue.");
        router.push("/login");
        return;
      }

      try {
        const response = await axiosInstance.get("/subscription/check-subscription");
        const { isSubscribed } = response.data;

        if (!isSubscribed) {
          setRedirectReason("You need a subscription to access learning features.");
          router.push("/subscription");
        }
      } catch (error) {
        setRedirectReason("Subscription check failed. Please try again.");
        router.push("/subscription");
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [router]);

  return { loading, redirectReason };
};

export default useSubscriptionCheck;
