"use client";
import { getLanguageLabel } from "@/config/languages";
import { API_URL, DEFAULT_IMAGE_URL } from "@/config/urls";
import Link from "next/link";
import CustomUserImage from "../ui/CustomUserImage";

const HighlightedProfiles = ({ premiumProfiles, loading }) => {
  const getLanguageFlag = (language) => {
    const flags = {
      English: "🇬🇧",
      French: "🇫🇷",
      Spanish: "🇪🇸",
      German: "🇩🇪",
      Chinese: "🇨🇳",
      Japanese: "🇯🇵",
      Korean: "🇰🇷",
    };
    return flags[language] || "🌐";
  };

  if (loading) {
    return (
      <section className="py-7 px-4">
        <h2 className="mb-7 flex items-center">
          <span className="px-2 h-6 rounded-md w-32 bg-gray-200 inline-block"></span>
          <span className="ms-3 w-6 h-4 inline-block rounded-tr-md rounded-br-md rounded-tl-lg rounded-bl-sm bg-gray-200"></span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 animate-pulse"
            >
              <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (premiumProfiles.length === 0) {
    return null;
  }

  return (
    <section className="py-7">
      <h2 className="text-md font-[500] mb-7 text-pink-500">
        Highlighted Profiles{" "}
        <span className="px-2 text-xs rounded-tr-md rounded-br-md rounded-tl-lg rounded-bl-sm text-white bg-pink-500">
          PRO
        </span>
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {premiumProfiles.map((profile) => (
          <ProfileCard
            key={profile._id}
            profile={profile}
            isPro={true}
            getLanguageFlag={getLanguageFlag}
          />
        ))}
      </div>
    </section>
  );
};

const ProfileCard = ({ profile, isPro, getLanguageFlag }) => {
  const truncateBio = (bio, maxLength = 50) => {
    if (!bio) return "";
    return bio.length > maxLength ? bio.substring(0, maxLength) + "..." : bio;
  };

  return (
    <Link
      href={`/community/${profile.userId}`}
      className="bg-white rounded-lg shadow-md p-5 text-center hover:shadow-lg transition-shadow min-w-[200px] flex flex-col justify-between"
      aria-label={`View ${profile.name}'s profile`}
    >
      <CustomUserImage
        src={
          profile.profilePicture
            ? `${API_URL}${profile.profilePicture}`
            : DEFAULT_IMAGE_URL
        }
        alt={profile.name}
        className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-pink-500"
      />
      <div>
        <h3 className="font-semibold text-md">{profile.name}</h3>
        <p
          className="text-sm text-gray-600 mb-2 break-words"
          title={profile.description}
        >
          {truncateBio(profile.description)}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            <strong>Learning:</strong>{" "}
            {getLanguageLabel(profile.learningLanguage) || "----"}
          </span>
        </div>
      </div>
      <button
        className="mt-4 bg-pink-500 text-white rounded-full px-4 py-1 text-sm font-semibold hover:bg-pink-600 transition-colors"
        aria-label="Try Tandem Pro"
      >
        Try Tandem Pro
      </button>
    </Link>
  );
};

export default HighlightedProfiles;
