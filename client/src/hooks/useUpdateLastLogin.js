// hooks/useUpdateLastLogin.js
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import axiosInstance from "@/config/axiosConfig";
const useUpdateLastLogin = () => {
  const pathname = usePathname();
  const intervalRef = useRef(null);

  useEffect(() => {
    // Cleanup any previous interval whenever path changes
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Define which paths fire once on entry
    const oneTimePaths = ["/community", "/profile"];
    // Define which paths should poll every 5 minutes
    const pollingPaths = ["/chat"];

    const shouldFireOnce = oneTimePaths.some((p) =>
      pathname.startsWith(p)
    );
    const shouldPoll = pollingPaths.some((p) =>
      pathname.startsWith(p)
    );

    // No work if neither
    if (!shouldFireOnce && !shouldPoll) {
      return;
    }

    // The update function
    const update = async () => {
      try {
        await axiosInstance.post("/profile/last-login", {});
      } catch (err) {
        console.error("Failed to update lastLogin:", err);
      }
    };

    // Always fire once on entry if it's a one-time path
    if (shouldFireOnce) {
      update();
    }

    // If it's a polling path, fire immediately and start interval
    if (shouldPoll) {
      update();
      intervalRef.current = setInterval(update, 5 * 60 * 1000);
    }

    // Cleanup on unmount / path change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pathname]);
}

export default useUpdateLastLogin;