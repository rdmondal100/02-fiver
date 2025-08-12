"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const useAuthToken = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState(null);

  const publicRoutes = ["/", "/login", "/sign-up", "/forgot-password", "/reset-password"];

  useEffect(() => {
    const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // If token exists and user is on a public route (except "/"), redirect to profile
    if (localToken && publicRoutes.includes(pathname) && pathname !== "/") {
      router.push("/profile");
      return;
    }

    // If token doesn't exist and user is on a protected route, redirect to login
    if (!localToken && !publicRoutes.includes(pathname)) {
      router.push("/login");
    } else {
      setToken(localToken);
    }
  }, [pathname, router]);

  return token;
};

export default useAuthToken;
