import { useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";

/**
 * Reusable hook to poll login status of a user every 5 minutes
 * @param {string} userId - The ID of the user to check
 * @param {function} onSuccess - Callback to handle successful data fetch
 */
const useLoginStatusPoller = (userId, onSuccess) => {
    useEffect(() => {
        if (!userId) return;

        let intervalId;

        const fetchLoginStatus = async () => {
            try {
                const response = await axiosInstance.get(`/profile/${userId}/last-login`);
                onSuccess?.(response.data.lastLoggedIn);
            } catch (error) {
                console.error("Error fetching last login", error);
            }
        };

        // Initial fetch
        fetchLoginStatus();

        // Poll every 5 minutes
        intervalId = setInterval(fetchLoginStatus, 5 * 60 * 1000);

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [userId, onSuccess]);
};

export default useLoginStatusPoller;
