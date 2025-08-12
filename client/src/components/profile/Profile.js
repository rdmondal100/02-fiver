"use client";
import axiosInstance from "@/config/axiosConfig";
import { LANGUAGES } from "@/config/languages";
import { API_URL, DEFAULT_IMAGE_URL } from "@/config/urls";
import {
  fetchProfile,
  resetProfile,
  updateProfile,
} from "@/features/user/profileSlice";
import { fetchLoggedInUser, logout } from "@/features/user/userSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { AiTwotoneEdit } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import CustomUserImage from "../ui/CustomUserImage";
import ProfileMenuBar from "./ProfileMenuBar";
import { CountryDropdown } from "react-country-region-selector";

const ProfileForm = () => {
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.profile);
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveButtonClass, setSaveButtonClass] = useState("hover:bg-cyan-600 bg-[#074c77]")
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("About me");
  const [formData, setFormData] = useState({
    // About Me
    name: "",
    dateOfBirth: "",
    location: "",
    country: "",
    description: "",
    about: "",
    partnerPreference: "",
    learningGoals: "",

    // Languages
    nativeLanguage: "",
    fluentLanguage: "",
    learningLanguage: "",
    translateLanguage: "",

    // Learning Preferences
    communication: "Not set",
    timeCommitment: "Not set",
    learningSchedule: "Not set",
    correctionPreference: "Not set",

    // Topics
    topics: ["Life"],
    newTopic: "",

    // Profile Settings
    showLocation: true,
    notifications: true,
    emailNotifications: true,
    newsCategories: ['Nature'],

    // Following
    followingTab: "Following",

    // Profile Picture
    profilePicture: "",

    // Photos
    photos: [],
  });

  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [unblockLoading, setUnblockLoading] = useState({});

  // Fetch profile and user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchLoggedInUser()).unwrap();
        const prefileResponse = await dispatch(fetchProfile()).unwrap();
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch profile data");
        dispatch(resetProfile());
        router.replace("/login");
        localStorage.clear(); // Save the token in local storage
      }
    };
    fetchData();
  }, [dispatch]);

  // Populate form data with fetched profile and user data
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || "",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
          : "",
        location: profile.location || "",
        country: profile.country || "",
        description: profile.description || "",
        about: profile.about || "",
        partnerPreference: profile.partnerPreference || "",
        learningGoals: profile.learningGoals || "",
        nativeLanguage: profile.nativeLanguage || "",
        fluentLanguage: profile.fluentLanguage || "",
        learningLanguage: profile.learningLanguage || "",
        translateLanguage: profile.translateLanguage || "",
        communication: profile.communication || "Not set",
        timeCommitment: profile.timeCommitment || "Not set",
        learningSchedule: profile.learningSchedule || "Not set",
        correctionPreference: profile.correctionPreference || "Not set",
        topics: profile.topics || ["Life"],
        showLocation: profile.showLocation ?? true,
        notifications: profile.notifications ?? true,
        emailNotifications: profile.emailNotifications ?? true,
        newsCategories: profile.newsCategories || ['Nature'],

        profilePicture: profile.profilePicture || "",
        photos: profile.photos || [],
      }));
    }
  }, [profile]);

  // Add new useEffect for fetching following/followers/blocked lists
  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        // Fetch following users
        try {
          const followingResponse = await axiosInstance.get(
            "/profile/following"
          );

          if (Array.isArray(followingResponse.data)) {
            const filteredFollowing = followingResponse.data.filter(
              (follow) => follow && follow.userId
            );
            setFollowing(filteredFollowing);
          } else {
            console.error(
              "Invalid following data received:",
              followingResponse.data
            );
            setFollowing([]);
          }
        } catch (error) {
          console.error(
            "Error fetching following:",
            error.response?.data || error
          );
          setFollowing([]);
        }

        // Fetch followers directly from the profile's followers array
        try {
          const followersResponse = await axiosInstance.get(
            "/profile/followers"
          );

          if (Array.isArray(followersResponse.data)) {
            const validFollowers = followersResponse.data.filter(
              (follower) => follower && follower.userId
            );
            setFollowers(validFollowers);
          } else {
            console.error(
              "Invalid followers data received:",
              followersResponse.data
            );
            setFollowers([]);
          }
        } catch (error) {
          console.error(
            "Error fetching followers:",
            error.response?.data || error
          );
          setFollowers([]);
        }

        // Fetch blocked users
        await fetchBlockedUsers();
      } catch (error) {
        console.error("Error fetching follow data:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to fetch user relationships";
        toast.error(errorMessage);
        setFollowing([]);
        setFollowers([]);
        setBlocked([]);
      }
    };

    if (profile) {
      fetchFollowData();
    }
  }, [profile]);

  // Add the fetchBlockedUsers function
  const fetchBlockedUsers = async () => {
    try {
      const response = await axiosInstance.get("/profile/blocked");
      if (Array.isArray(response.data)) {
        const validBlockedUsers = response.data
          .filter((user) => user && user.userId)
          .map((user) => ({
            userId: user.userId,
            name: user.name || "Anonymous User",
            tandemID: user.tandemID || "unknown",
            profilePicture: user.profilePicture,
            _id: user._id || user.userId,
          }));
        setBlocked(validBlockedUsers);
      } else {
        setBlocked([]);
      }
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      toast.error("Failed to fetch blocked users");
      setBlocked([]);
    }
  };

  const handleUnblock = async (userId) => {
    setUnblockLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await axiosInstance.post(`/profile/unblock/${userId}`);
      toast.success("User unblocked successfully");
      // Refresh the blocked users list
      await fetchBlockedUsers();
      // Also refresh the profile data to ensure all lists are up to date
      await dispatch(fetchProfile()).unwrap();
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Failed to unblock user");
    } finally {
      setUnblockLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const menuItems = [
    { label: "About me" },
    { label: "Languages" },
    { label: "Learning Preferences" },
    // { label: "Topics" },
    { label: "Following" },
    { label: "Profile Settings" },
    { label: "Subscription" },
    // { label: "Visitors" },
    { label: "Log out" },
  ];

  const fieldToTabMap = {
    location: "About me",
    country: "About me",
    learningLanguage: "Languages",
    dateOfBirth: "About me",
  };

  const requiredFields = ["location", "country", "learningLanguage", "dateOfBirth"];

  const handleSave = async () => {
    const emptyFields = requiredFields.filter((field) => {
      const value = formData[field];

      if (field === "dateOfBirth") {
        return !value || isNaN(new Date(value).getTime());
      }

      return typeof value !== "string" || !value.trim();
    });

    if (emptyFields.length > 0) {
      const errorDetails = emptyFields.map((field) => {
        const tab = fieldToTabMap[field] || "Unknown";
        return `${field} (see '${tab}' section)`;
      });

      setSaveError(`Please fill in the required fields: ${errorDetails.join(", ")}`);
      setTimeout(() => setSaveError(null), 5000);
      return;
    }

    setIsLoading(true);
    setSaveError(null);
    setSuccessMessage("");

    try {
      await dispatch(updateProfile(formData)).unwrap();
      setSuccessMessage("Profile saved successfully!");

      // Refresh profile data
      await dispatch(fetchProfile()).unwrap();
      setSaveButtonClass("hover:bg-red-700 bg-red-600")
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveError(
        error.message || "An error occurred while saving the profile."
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setSuccessMessage("");
        setSaveError(null);
      }, 3000); // Clear success message after 3 seconds
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category) => {
    setFormData((prevData) => {
      const categories = prevData.newsCategories.includes(category)
        ? prevData.newsCategories.filter((c) => c !== category)
        : [...prevData.newsCategories, category];

      return { ...prevData, newsCategories: categories };
    });
  };

  const handleAddTopic = () => {
    if (formData.newTopic.trim()) {
      setFormData((prev) => ({
        ...prev,
        topics: [...prev.topics, prev.newTopic.trim()],
        newTopic: "",
      }));
    }
  };

  const handleRemoveTopic = (topicToRemove) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.filter((topic) => topic !== topicToRemove),
    }));
  };

  const handleMenuItemClick = async (label) => {
    if (label === "Log out") {
      try {
        localStorage.clear();
        await dispatch(logout()).unwrap();
        dispatch(resetProfile());
        toast.success("Logged out successfully");
        router.push("/login");
      } catch (error) {
        toast.error(error.message || "Failed to logout");
      }
    } else if (label === "Subscription") {
      router.push("/subscription");
    } else {
      setActiveTab(label);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/auth/delete-account`);
      localStorage.clear();
      // Clear Redux state
      dispatch(resetProfile());
      dispatch(logout());

      toast.success("Account deleted successfully");

      // Use replace instead of push to prevent going back to the profile
      router.replace("/login");
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "About me":
        return (
          <div className="space-y-4 bg-gray-50 p-5 rounded-lg">
            <div className="flex items-end mb-8">
              {status === "loading" || status === "idle" ? (
                <div className="rounded-full w-44 h-44 bg-gray-200" />
              ) : (
                <div className="relative">
                  <CustomUserImage
                    src={
                      formData.profilePicture
                        ? `${API_URL}${formData.profilePicture}`
                        : DEFAULT_IMAGE_URL
                    }
                    alt="Profile"
                    className="rounded-full w-44 h-44 object-cover border border-gray-300"

                  />
                  <label
                    htmlFor="profile-picture-input"
                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100"
                  >
                    <AiTwotoneEdit size={20} />
                  </label>
                  <input
                    id="profile-picture-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>

            <FormField
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
            {/* Tandem ID field hidden */}
            {/* <FormField
              label="Tandem ID"
              value={formData.tandemID}
              onChange={(e) => handleInputChange("tandemID", e.target.value)}
              required
            /> */}
            <FormField
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                handleInputChange("dateOfBirth", e)
              }
              required
            />
            <div className="">
              <label className="block text-lg font-semibold mb-2">Country</label>
              <CountryDropdown
                value={formData.country}
                onChange={(e) => handleInputChange("country", e)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <FormField
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              required
            />
            {/* <TextAreaField
              label="Description"
              value={formData.description}
              onChange={(e) =>
                handleInputChange("description", e.target.value)
              }
              placeholder="Describe yourself"
            />

            <TextAreaField
              label="What do you like to talk about?"
              value={formData.about}
              onChange={(e) => handleInputChange("about", e.target.value)}
            />
            <TextAreaField
              label="What's your ideal language exchange partner like?"
              value={formData.partnerPreference}
              onChange={(e) =>
                handleInputChange("partnerPreference", e.target.value)
              }
            />
            <TextAreaField
              label="What are your language learning goals?"
              value={formData.learningGoals}
              onChange={(e) =>
                handleInputChange("learningGoals", e.target.value)
              }
            /> */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Photos</h3>
              <div className="grid grid-cols-5 gap-4">
                {formData.photos &&
                  formData.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square">
                      <div className="absolute inset-0 rounded-lg overflow-hidden">
                        <CustomUserImage
                          src={`${API_URL}${photo}`}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-contain bg-gray-100"
                        />
                        <button
                          onClick={() => handleDeletePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                {(!formData.photos || formData.photos.length < 5) && (
                  <div className="aspect-square relative">
                    <label className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        multiple={true}
                        disabled={isLoading}
                      />
                      <span className="text-gray-400 text-xl">+</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "Languages":
        return (
          <div className="space-y-4 bg-gray-50 p-5 rounded-lg">
            <LanguageFormSection
              title="I am native in"
              value={formData.nativeLanguage}
              onChange={(e) =>
                handleInputChange("nativeLanguage", e.target.value)
              }
            />
            <LanguageFormSection
              title="I am fluent in"
              value={formData.fluentLanguage}
              onChange={(e) =>
                handleInputChange("fluentLanguage", e.target.value)
              }
            />
            <LanguageFormSection
              title="I am learning"
              value={formData.learningLanguage}
              onChange={(e) =>
                handleInputChange("learningLanguage", e.target.value)
              }
            />
            <LanguageFormSection
              title="Translate incoming messages to"
              value={formData.translateLanguage}
              onChange={(e) =>
                handleInputChange("translateLanguage", e.target.value)
              }
            />
          </div>
        );

      case "Learning Preferences":
        return (
          <div className="space-y-4 bg-gray-50 p-5 rounded-lg">
            <PreferenceField
              title="Communication"
              value={formData.communication}
              onChange={(e) =>
                handleInputChange("communication", e.target.value)
              }
              options={["Text Chat", "Voice Messages", "Video Calls"]}
            />
            <PreferenceField
              title="Time Commitment"
              value={formData.timeCommitment}
              onChange={(e) =>
                handleInputChange("timeCommitment", e.target.value)
              }
              options={["1-2 hours/week", "3-5 hours/week", "5+ hours/week"]}
            />
            <PreferenceField
              title="Learning Schedule"
              value={formData.learningSchedule}
              onChange={(e) =>
                handleInputChange("learningSchedule", e.target.value)
              }
              options={["Morning", "Afternoon", "Evening", "Flexible"]}
            />
            <PreferenceField
              title="Correction Preference"
              value={formData.correctionPreference}
              onChange={(e) =>
                handleInputChange("correctionPreference", e.target.value)
              }
              options={[
                "Correct me immediately",
                "Correct me after conversation",
                "Only when asked",
              ]}
            />
          </div>
        );

      case "Topics":
        return (
          <div className="space-y-4 bg-gray-50 p-5 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Topics</h3>
              <div className="flex items-center gap-2">
                <input
                  value={formData.newTopic}
                  onChange={(e) =>
                    handleInputChange("newTopic", e.target.value)
                  }
                  className="border rounded-lg px-3 py-1 w-48"
                  placeholder="New topic"
                />
                <button
                  onClick={handleAddTopic}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
            <>
              {renderTopicItems(formData.topics || [])}
            </>
          </div>
        );

      case "Following":
        return (
          <div className="space-y-4 bg-gray-50 p-5 rounded-lg">
            <div className="flex border-b">
              {["Following", "Followers", "Blocked"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleInputChange("followingTab", tab)}
                  className={`px-6 py-3 font-medium ${formData.followingTab === tab
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-blue-400"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <>
              {formData.followingTab === "Following" &&
                renderFollowList(following, "Following")}
              {formData.followingTab === "Followers" &&
                renderFollowList(followers, "Followers")}
              {formData.followingTab === "Blocked" &&
                renderFollowList(blocked, "Blocked")}
            </>
          </div>
        );

      case "Profile Settings":
        return (
          <div className="space-y-8 bg-gray-50 p-5 rounded-lg">
            <div className="">
              <h3 className="text-lg font-semibold">Privacy</h3>
              <ToggleSection
                label="Show my location"
                checked={formData.showLocation}
                onChange={() =>
                  handleInputChange("showLocation", !formData.showLocation)
                }
              />

            </div>

            <div className="">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <ToggleSection
                label="Receive notifications for messages or calls"
                checked={formData.notifications}
                onChange={() =>
                  handleInputChange("notifications", !formData.notifications)
                }
              />
              <ToggleSection
                label="Receive email notifications"
                checked={formData.emailNotifications}
                onChange={() =>
                  handleInputChange(
                    "emailNotifications",
                    !formData.emailNotifications
                  )
                }
              />
            </div>
            <div className="">
              <h3 className="text-lg font-semibold">News Preferences</h3>
              <p className="text-gray-500 mb-2">
                Select the topics you'd like to receive email updates about:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Nature",
                  "Travel/Nature sites",
                  "Health",
                  "Beauty",
                  "Longevity (long life)",
                  "Happiness / How to be happy",
                  "Productivity",
                  "General",
                ].map((category) => (
                  <label key={category} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.newsCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="accent-blue-500"
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>


            {/* <div className="">
              <h3 className="text-lg font-semibold">Download your data</h3>
              <p className="text-gray-500 mb-2">
                You can download your Tandem personal data here.
              </p>
              <a
                href="mailto:enlighten@gmail.com?subject=Request for Tandem personal data"
                className="inline-block bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Request data
              </a>
            </div> */}

            <div className="">
              <h3 className="text-lg font-semibold text-red-500">
                Account Actions
              </h3>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleMenuItemClick("Log out")}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full"
                >
                  Log Out
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 w-full"
                >
                  Delete Account
                </button>
              </div>
            </div>

            {/* Delete Account Confirmation Dialog */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                  <h3 className="text-xl font-semibold mb-4">Delete Account</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete your account? This action
                    cannot be undone and will permanently delete all your data.
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Deleting..." : "Delete Account"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );


      case "Visitors":
        return (
          <div className="space-y-4 bg-gray-50 p-5 rounded-lg">
            <p className="text-gray-600">
              You had 1 new visitor to your profile last week. Upgrade to Tandem
              Pro to connect with them.
            </p>
            <button
              onClick={() => router.push("/subscription")}
              className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600"
            >
              SEE YOUR VISITORS
            </button>
          </div>
        );

      default:
        return null;
    }

  };
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSaveError("Please upload an image file");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setSaveError("Image size should be less than 5MB");
      return;
    }

    try {
      setIsLoading(true);
      setSaveError(null);

      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await axiosInstance.post(
        `/profile/upload-picture`,
        formData
      );

      const data = response.data;

      // Update the form data with the new image URL
      setFormData((prev) => ({
        ...prev,
        profilePicture: data.imageUrl,
      }));

      setSuccessMessage("Profile picture updated successfully!");

      // Refresh profile data
      await dispatch(fetchProfile()).unwrap();
    } catch (error) {
      console.error("Profile picture upload error:", error);
      setSaveError(
        error.response?.data?.message || "Failed to upload profile picture"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - (formData.photos?.length || 0);

    if (files.length > remainingSlots) {
      setSaveError(
        `You can only upload ${remainingSlots} more photo${remainingSlots === 1 ? "" : "s"
        }`
      );
      return;
    }

    // Validate each file
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setSaveError("Please upload only image files");
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setSaveError("Each image size should be less than 5MB");
        return;
      }
    }

    try {
      setIsLoading(true);
      setSaveError(null);

      const uploadData = new FormData();
      files.forEach((file) => {
        uploadData.append("photos", file);
      });

      const response = await axiosInstance.post(
        `/profile/upload-photos`,
        uploadData
      );

      const data = response.data;

      // Update the form data with the new photos
      setFormData((prev) => ({
        ...prev,
        photos: data.photos,
      }));

      setSuccessMessage("Photos uploaded successfully!");

      // Refresh profile data
      await dispatch(fetchProfile()).unwrap();
    } catch (error) {
      console.error("Photos upload error:", error);
      setSaveError(error.response?.data?.message || "Failed to upload photos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = async (photoIndex) => {
    try {
      setIsLoading(true);
      setSaveError(null);

      const response = await axiosInstance.delete(
        `/profile/photos/${photoIndex}`
      );
      // Axios auto-parses JSON, so no need for response.json()
      const data = response?.data;

      // Update form data with the updated photos array
      setFormData((prev) => ({
        ...prev,
        photos: data.photos,
      }));

      setSuccessMessage("Photo deleted successfully!");

      // Refresh profile data
      await dispatch(fetchProfile()).unwrap();
    } catch (error) {
      console.error("Photo deletion error:", error);
      setSaveError(error.response?.data?.message || "Failed to delete photo");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFollowList = (users, tab) => {
    const getEmptyMessage = () => {
      switch (tab) {
        case "Blocked":
          return "You haven't blocked anyone.";
        case "Followers":
          return "You don't have any followers yet.";
        case "Following":
        default:
          return "You're not following anyone yet.";
      }
    };
    if (!Array.isArray(users) || users.length === 0) {
      return <div className="text-gray-500">{getEmptyMessage()}</div>;
    }

    return (
      <>
        {users.map((user) => {
          if (!user) return null;

          // Get profile picture URL, checking if it's a full URL or a relative path
          const profilePicture = user.profilePicture
            ? user.profilePicture.startsWith("http")
              ? user.profilePicture
              : `${API_URL}${user.profilePicture}`
            : DEFAULT_IMAGE_URL;

          return (
            <div
              key={user.userId || user._id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <CustomUserImage
                  src={profilePicture}
                  alt={user.name || "User"}
                  className="w-10 h-10 rounded-full object-cover"

                />
                <div>
                  <h3 className="font-medium">
                    {user.name || "Anonymous User"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    @{user.tandemID || "unknown"}
                  </p>
                </div>
              </div>
              {formData.followingTab === "Blocked" ? (
                <button
                  onClick={() => handleUnblock(user.userId)}
                  disabled={unblockLoading[user.userId]}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 disabled:opacity-50"
                >
                  {unblockLoading[user.userId] ? "Loading..." : "Unblock"}
                </button>
              ) : (
                <button
                  onClick={() =>
                    router.push(`/community/${user.userId || user._id}`)
                  }
                  className="text-blue-500 hover:text-blue-700"
                >
                  View Profile
                </button>
              )}
            </div>
          );
        })}
      </>
    );
  };
  const renderTopicItems = (topics) => {

    return (
      <>
        {topics?.map((topic, index) => {
          if (!topic) return null;

          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center justify-between w-full">
                <h3 className="font-medium">
                  {topic}
                </h3>
                <button
                  onClick={() => handleRemoveTopic(topic)}
                  className="text-red-500 hover:text-red-700 text-xl"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <div className="max-w-[1450px] mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg border flex md:flex-row flex-col p-6 gap-6">
        {/* Sidebar */}
        <ProfileMenuBar activeTab={activeTab} handleMenuItemClick={handleMenuItemClick} menuItems={menuItems} />
        {/* Main Content */}
        <div
          className="md:w-3/4 md:pl-6"
          style={{ backgroundImage: `url('/bannerbg.png')` }}
        >
          <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
            <h1 className="text-4xl font-semibold">Edit Profile</h1>
            <button
              onClick={handleSave}
              className={`text-white px-6 py-2 rounded-full ${saveButtonClass} `}
            >
              Save Changes
            </button>
          </div>
          {saveError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
              {saveError}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-8">
              {successMessage}
            </div>
          )}
          {renderTabContent()}
          <button
            onClick={handleSave}
            className={`text-white px-6 py-2 mt-4 rounded-full ${saveButtonClass} float-end`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const FormField = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div className="">
    <label className="block text-lg font-semibold mb-2">{label}</label>
    {type === "date"
      ? <DatePicker
        selected={value}
        onChange={(date) => onChange(date)} // <-- direct date
        placeholderText="Select your date of birth"
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        dateFormat="yyyy-MM-dd"
        wrapperClassName="w-full"
        maxDate={new Date()}
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
      /> :
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required={required}
      />}
  </div>
);

const TextAreaField = ({ label, value, onChange }) => (
  <div className="">
    <label className="block text-lg font-semibold mb-2">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const LanguageFormSection = ({ title, value, onChange }) => (
  <div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <select
      value={value || ""}
      onChange={onChange}
      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select a language</option>
      {LANGUAGES?.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.show}
        </option>
      ))}
    </select>
  </div>
);

const PreferenceField = ({ title, value, onChange, options }) => (
  <div className="">
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <select
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    >
      <option value="Not set">Not set</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);
const ToggleSection = ({ label, checked, onChange }) => (
  <div className="flex justify-between items-center py-2">
    <span>{label}</span>
    <div
      className={`relative inline-block w-10 h-6 rounded-full cursor-pointer ${checked ? "bg-blue-500" : "bg-gray-300"
        }`}
      onClick={onChange}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${checked ? "translate-x-4" : ""
          }`}
      />
    </div>
  </div>
);

export default ProfileForm;
