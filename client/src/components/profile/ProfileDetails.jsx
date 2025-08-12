"use client";
import { selectChatUser } from "@/features/user/chatSlice";
import { useRouter } from "next/navigation"; // Changed from next/router to next/navigation
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

import axiosInstance from "@/config/axiosConfig";
import { getLanguageLabel } from "@/config/languages";
import { API_URL, WORLD_MAP_IMAGE } from "@/config/urls";
import { isRecentLoginWithin5Min } from "@/utils/helpers";
import PageLoader from "../loaders/pageLoader";
import CustomUserImage from "../ui/CustomUserImage";

const ProfileDetails = ({ id }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isBlockLoading, setIsBlockLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch the profile being viewed
        const profileResponse = await axiosInstance.get(`/profile/${id}`);

        if (profileResponse.data) {
          const { profile, isFollowing, isBlocked } = profileResponse.data;
          setProfile(profile); // Access the profile object directly
          // Check if the current user is already following this profile
          setIsFollowing(isFollowing);
          // Check if the user is blocked
          setIsBlocked(isBlocked);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // Function to handle follow/unfollow
  const handleFollow = async () => {
    setIsFollowLoading(true);
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      const response = await axiosInstance.post(
        `/profile/${endpoint}/${id}`,
        {}
      );

      setIsFollowing(!isFollowing);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating follow status"
      );
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleBlock = async () => {
    setIsBlockLoading(true);
    try {
      const endpoint = isBlocked ? "unblock" : "block";
      const response = await axiosInstance.post(`/profile/${endpoint}/${id}`);

      setIsBlocked(!isBlocked);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating block status"
      );
    } finally {
      setIsBlockLoading(false);
    }
  };

  const handleMessageClick = () => {
    // Create a user object with the required fields
    const userToMessage = {
      _id: profileData.userId,
      name: profileData.name,
      profilePicture: profileData.profilePicture,
      email: profileData.email,
      lastLoggedIn: profileData.lastLoggedIn,
    };

    // Select the user in chat state
    dispatch(selectChatUser(userToMessage));

    // Navigate to chat page
    router.push("/chat");
  };

  if (loading) return <PageLoader />;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>No profile data found.</div>;

  // Calculate age from dateOfBirth
  const calculateAge = (birthDate) => {
    if (!birthDate) return "Unknown"; // Handle null or undefined dateOfBirth
    const diff = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Destructure profile from the response
  const profileData = profile;

  return (
    <div className="min-h-screen bg-amber-50/80">
      {/* Header Section */}
      <header className="relative bg-blue-100">
        <img
          src={WORLD_MAP_IMAGE}
          alt="World Map"
          className="w-full h-64 object-cover"
        />
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-5">
        <div className="col-span-3 top-1/2 flex flex-col items-center left-1/2 transform -translate-y-20 text-center">
          <CustomUserImage
            src={`${API_URL}${profileData.profilePicture}`}
            alt="Profile"
            className="w-44 h-44 rounded-full border-4 border-white object-cover"
          />
          <h1 className="mt-3 text-2xl font-semibold">
            {profileData.name}, {calculateAge(profileData.dateOfBirth)}
          </h1>
          <p className="text-gray-500">
            {" "}
            {isRecentLoginWithin5Min(profileData?.lastLoggedIn)
              ? "Recently Active"
              : "Offline"}
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={handleFollow}
              disabled={isFollowLoading}
              className={`${
                isFollowing ? "bg-gray-500" : "bg-primary"
              } text-white px-6 py-2 rounded-full transition-colors duration-200 hover:opacity-90 disabled:opacity-50`}
            >
              {isFollowLoading
                ? "Loading..."
                : isFollowing
                ? "Unfollow"
                : "Follow"}
            </button>
            <button
              onClick={handleMessageClick}
              className="bg-primary text-white px-6 py-2 rounded-full"
            >
              Message
            </button>
            <button
              onClick={handleBlock}
              disabled={isBlockLoading}
              className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 disabled:opacity-50"
            >
              {isBlockLoading ? "Loading..." : isBlocked ? "Unblock" : "Block"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Languages Section */}
          <section className="bg-white border p-4 rounded-lg">
            <h2 className="font-bold mb-2">Languages</h2>
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold text-sm">NATIVE</h3>
                <p className="text-gray-700 flex items-center">
                  <span className="mr-2">🌐</span>
                  {getLanguageLabel(
                    profileData.nativeLanguage || "Not specified"
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">FLUENT</h3>
                <p className="text-gray-700 flex items-center">
                  <span className="mr-2">🌐</span>
                  {getLanguageLabel(profileData.fluentLanguage) ||
                    "Not specified"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">LEARNING</h3>
                <p className="text-gray-700 flex items-center">
                  <span className="mr-2">🌐</span>
                  {getLanguageLabel(profileData.learningLanguage) ||
                    "Not specified"}
                </p>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="bg-white border p-4 rounded-lg">
            <h2 className="font-bold mb-2">
              About {profileData.name.split(" ")[0]}
            </h2>
            <p className="text-sm text-gray-600 flex items-center mb-1">
              <span className="mr-2">📍</span>
              {profileData.location || "Location not specified"}
            </p>
            {/* <span className="mr-2">🆔</span>@{profileData.tandemID} */}

            {/* <h3 className="font-semibold mt-4">Description</h3>
            <p className="text-gray-700">
              {profileData.description || "No description provided."}
            </p>

            <h3 className="font-semibold mt-4">Learning Goals</h3>
            <p className="text-gray-700">
              {profileData.learningGoals || "Not specified"}
            </p>

            <h3 className="font-semibold mt-4">Partner Preference</h3>
            <p className="text-gray-700">
              {profileData.partnerPreference || "Not specified"}
            </p> */}
          </section>

          {/* Topics Section */}
          {/* <section className="bg-white border p-4 rounded-lg">
            <h2 className="font-bold mb-2">Topics of Interest</h2>
            <div className="flex flex-wrap gap-2">
              {profileData.topics?.map((topic, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {topic || "No topics specified"}
                </span>
              ))}
            </div>
          </section> */}
        </div>

        {/* Photos Section */}
        <section className="col-span-1 border md:col-span-3 mt-4 bg-white p-4 rounded-lg">
          <h2 className="font-bold mb-2">Photos</h2>
          <div className="grid grid-cols-3 gap-4">
            {profileData.photos && profileData.photos.length > 0 ? (
              profileData.photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square relative overflow-hidden rounded-lg"
                >
                  <CustomUserImage
                    src={`${API_URL}${photo}`}
                    alt={`Photo ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-contain bg-gray-100"
                  />
                </div>
              ))
            ) : (
              <p className="col-span-3 text-gray-500 text-center py-4">
                No photos uploaded yet
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfileDetails;
