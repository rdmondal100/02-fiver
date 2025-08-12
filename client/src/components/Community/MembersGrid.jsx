"use client";
import axiosInstance from "@/config/axiosConfig";
import { getLanguageLabel } from "@/config/languages";
import { API_URL, DEFAULT_IMAGE_URL } from "@/config/urls";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import LanguageSelector from "../home/LanguageSelector";
import CustomUserImage from "../ui/CustomUserImage";
import HighlightedProfiles from "./HighlightedProfiles";
// Member card to display individual member's data
const MemberCard = ({ member }) => {
  const { profilePicture } = member;
  const memberProfilePicture = profilePicture
    ? `${API_URL}${profilePicture}`
    : DEFAULT_IMAGE_URL;
  return (
    <Link
      href={`/community/${member.userId}`}
      className="bg-white border rounded-lg p-3 flex items-center space-x-4 hover:shadow-lg transition-shadow"
    >
      <CustomUserImage
        src={memberProfilePicture}
        alt={member.name}
        className="w-28 h-28 rounded-lg object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span
            className={`block w-3 h-3 rounded-full ${
              member.status === "online" ? "bg-green-400" : "bg-red-400"
            }`}
          ></span>
          <h3 className="font-semibold text-lg">{member.name}</h3>
        </div>
        <p className="text-sm text-gray-600">{member.description}</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            <strong>Learning:</strong>{" "}
            {getLanguageLabel(member.learningLanguage) || "----"}
          </span>
        </div>
      </div>
    </Link>
  );
};

// Search bar for filtering members
const SearchBar = ({
  selectedLanguage,
  setSelectedLanguage,
  searchQuery,
  setSearchQuery,
  setActiveTab,
}) => {
  // Local state to track the immediate input value
  const [inputValue, setInputValue] = useState(searchQuery);

  // Debounce effect: wait 500ms after the last keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [inputValue, setSearchQuery]);
  return (
    <div className="flex items-center gap-4 flex-grow flex-wrap">
      <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 flex-grow">
        <FiSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by name or language…"
          className="bg-transparent outline-none text-gray-700 placeholder-gray-500 flex-grow"
        />
      </div>
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
      <button
        onClick={() => {
          setSearchQuery("");
          setSelectedLanguage(null);
          setActiveTab("All members");
        }}
        className="flex items-center bg-[#074c77] text-white  hover:bg-cyan-600 transition-all px-4 py-2 rounded-full w-fit"
      >
        Clear Filters
      </button>
    </div>
  );
};

const MembersGrid = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All members");
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [premiumProfiles, setPremiumProfiles] = useState([]);

  useEffect(() => {
    const handleLanguageChangeOrSearch = async () => {
      const language = selectedLanguage?.value?.toLowerCase() || "all";
      setLoading(true);

      try {
        const response = await axiosInstance.get("/partners/filter", {
          params: {
            query: searchQuery || "", // The search text
            language: language, // The selected language (or "all")
            location: activeTab, // "Near me", "Travel", etc.
          },
        });
        const { membersProfiles, premiumProfiles } = response.data;
        setMembers(membersProfiles || []);
        setPremiumProfiles(premiumProfiles || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
        toast.error("Failed to fetch search results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    handleLanguageChangeOrSearch();
  }, [selectedLanguage, searchQuery, activeTab]);

  // Tabs component with proper state management
  const Tabs = () => {
    const tabs = [
      { name: "All members", icon: "🔍" },
      { name: "Near me", icon: "📍" },
      // { name: "Travel", icon: "✈️" },
    ];

    return (
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center hover:bg-gray-800 transition-all hover:text-white px-4 py-2 rounded-full ${
              activeTab === tab.name
                ? "bg-gray-800 text-white"
                : "bg-transparent border border-gray-300 text-gray-700"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>
    );
  };

  const MembersContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(15)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 animate-pulse flex flex-col sm:flex-row items-center gap-4 min-h-[150px]"
            >
              <div className="w-28 h-28 rounded-lg bg-gray-200" />
              <div className="flex-grow">
                <div className="h-4 bg-gray-200 rounded w-full mb-3" />
                <div className="h-3 bg-gray-200 rounded w-1/2  mb-3" />
                <div className="flex flex-wrap gap-2">
                  <span className="h-7 bg-gray-200 rounded-full w-20 inline-block" />
                  <span className="h-7 bg-gray-200 rounded-full w-20 inline-block" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!loading && members?.length === 0) {
      let message = "No members found.";
      if (activeTab === "Near me") {
        message = "No members found in your location.";
      } else if (activeTab === "Travel") {
        message = "No members found from other locations.";
      }

      return <p className="text-center text-gray-500 mt-4">{message}</p>;
    }

    return (
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members?.map((member) => (
            <MemberCard member={member} key={member._id} />
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap py-7">
        <Tabs />
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          setActiveTab={setActiveTab}
        />
      </div>
      <MembersContent />
      <HighlightedProfiles
        premiumProfiles={premiumProfiles}
        loading={loading}
      />
    </div>
  );
};

export default MembersGrid;
