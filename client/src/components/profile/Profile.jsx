import { DEFAULT_IMAGE_URL } from "@/config/urls";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Profile = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("followers");
  const [unblockLoading, setUnblockLoading] = useState({});

  const fetchBlockedUsers = async () => {
    try {
      const response = await axiosInstance.get("/profile/blocked");
      setBlockedUsers(response.data);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      toast.error("Failed to fetch blocked users");
    }
  };

  useEffect(() => {
    if (activeTab === "blocked") {
      fetchBlockedUsers();
    }
  }, [activeTab]);

  const handleUnblock = async (userId) => {
    setUnblockLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await axiosInstance.post(`/profile/unblock/${userId}`);
      toast.success("User unblocked successfully");
      // Refresh the blocked users list
      fetchBlockedUsers();
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Failed to unblock user");
    } finally {
      setUnblockLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div>
      <div className="flex justify-center space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === "followers"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("followers")}
        >
          Followers
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === "following"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === "blocked"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("blocked")}
        >
          Blocked
        </button>
      </div>

      {activeTab === "blocked" && (
        <div className="grid grid-cols-1 gap-4 mt-4">
          {blockedUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={user.profilePicture || DEFAULT_IMAGE_URL}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = DEFAULT_IMAGE_URL;
                  }}
                />
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  {/* <p className="text-gray-500">@{user.tandemID}</p> */}
                </div>
              </div>
              <button
                onClick={() => handleUnblock(user.userId)}
                disabled={unblockLoading[user.userId]}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 disabled:opacity-50"
              >
                {unblockLoading[user.userId] ? "Loading..." : "Unblock"}
              </button>
            </div>
          ))}
          {blockedUsers.length === 0 && (
            <p className="text-center text-gray-500">No blocked users</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
