"use client";
import axiosInstance from "@/config/axiosConfig";
import { API_URL, DEFAULT_IMAGE_URL } from "@/config/urls";
import { logout } from "@/features/user/userSlice";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CustomUserImage from "./CustomUserImage";
import { resetProfile } from "@/features/user/profileSlice";
import { formatName } from "@/utils/helpers";

const UserMenu = ({ setMenuOpen: setNavMenuOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("free");
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const { profile } = useSelector((state) => state.profile);
  const pathname = usePathname();
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!profile?.userId) {
        setIsLoadingStatus(false);
        return;
      }

      try {
        setIsLoadingStatus(true);
        const response = await axiosInstance.get(`/subscription/status`);

        if (response.data && typeof response.data.status === "string") {
          setSubscriptionStatus(response.data.status);
        } else {
          setSubscriptionStatus("free");
        }
      } catch (error) {
        console.error(
          "Error fetching subscription status:",
          error?.response?.data || error.message
        );
        // Don't show error toast for auth errors as user might not be logged in
        if (error.response?.status !== 401) {
          toast.error("Failed to fetch subscription status");
        }
        setSubscriptionStatus("free");
      } finally {
        setIsLoadingStatus(false);
      }
    };

    if (profile?.userId) {
      fetchSubscriptionStatus();
    }
  }, [profile?.userId]);

  // If no user data is present, don't render the menu
  if (!profile) {
    return null;
  }

  const closeMenu = () => {
    setIsMenuOpen(false);
    setNavMenuOpen(false);
  };

  // Animation variants for dropdown menu
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const handleLogout = async () => {
    try {
      localStorage.clear();
      await dispatch(logout()).unwrap();
      dispatch(resetProfile());
      setSubscriptionStatus("free");
      closeMenu();
      toast.success("Logged out successfully");
      if (pathname !== "/") {
        router.push("/login");
      }
    } catch (error) {
      toast.error(error.message || "Failed to logout");
    }
  };

  // Get the display name from profile or profile
  const displayName = profile?.name || "User";

  // Get the profile picture URL
  const profilePicture = profile?.profilePicture
    ? `${API_URL}${profile.profilePicture}`
    : DEFAULT_IMAGE_URL;

  const menuItems = [
    { label: "Profile", path: "/profile" },
    { label: "Subscription", path: "/subscription" },
  ];

  return (
    <div
      className="relative inline-block w-fit"
      onMouseEnter={() => setIsMenuOpen(true)}
      onMouseLeave={closeMenu}
    >
      {/* Avatar and Name */}
      <div className="flex items-center cursor-pointer">
        {/* Always show image */}

        <CustomUserImage
          src={profilePicture}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
          name={displayName}
        />

        {/* Show name + PRO only on sm and up */}
        <div className="hidden sm:flex items-center ml-2">
          <span className="font-semibold">{formatName(displayName)}</span>

          {!isLoadingStatus && subscriptionStatus === "premium" && (
            <span className="ml-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] sm:text-xs px-2 py-1 rounded-full font-semibold">
              PRO
            </span>
          )}
        </div>

        {/* Dropdown icon */}
        <span className="ml-1">&#x25BC;</span>
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="absolute right-0 top-full w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.2 }}
          >
            <ul className="py-2 text-sm text-gray-700">
              {menuItems.map((item) => (
                <li
                  key={item.label}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold"
                  onClick={closeMenu} // Close after clicking
                >
                  <Link href={item.path} className="block w-full">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500 font-semibold"
              >
                Log out
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
