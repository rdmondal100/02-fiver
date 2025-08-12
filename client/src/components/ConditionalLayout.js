"use client";

import { fetchProfile } from "@/features/user/profileSlice";
import { fetchLoggedInUser } from "@/features/user/userSlice";
import useAuthToken from "@/hooks/useAuthToken";
import useUpdateLastLogin from "@/hooks/useUpdateLastLogin";
import Footer from "@/shared/Footer";
import Navbar from "@/shared/Navbar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";

const exemptedPaths = ["/profile", "/verify-payment"];

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);

  // Move token into state and set it client-side
  const [token, setToken] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  // update last login 
  useUpdateLastLogin()

  // Custom hook to refresh axios auth header if needed
  useAuthToken();

  useEffect(() => {
    // Only fetch if:
    //  - we're not on an exempted path
    //  - we have a token
    //  - profile hasn't been loaded yet
    if (
      !exemptedPaths.some((path) => pathname.startsWith(path)) &&
      token &&
      !profile
    ) {
      dispatch(fetchProfile())
        .unwrap()
        .then(() => dispatch(fetchLoggedInUser()).unwrap())
        .catch((err) => {
          console.error("Failed to fetch user or profile:", err);
        });
    }
  }, [pathname, token, profile, dispatch]);

  const isCallRoute = pathname.startsWith("/call");

  return (
    <>
      {!isCallRoute && <Navbar />}
      <div className="min-h-[90dvh] mx-auto">{children}</div>
      {!isCallRoute && <Footer />}
    </>
  );
}
