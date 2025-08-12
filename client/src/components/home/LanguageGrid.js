"use client"
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const languages = [
  { icon: "/en.png", name: "English", value: "english" },
  { icon: "/spain.png", name: "Spanish", value: "spanish" },
  { icon: "/french.png", name: "French", value: "french" },
  { icon: "/german.png", name: "German", value: "german" },
  { icon: "/italian.png", name: "Italian", value: "italian" },
  { icon: "/portugal.png", name: "Portuguese", value: "portuguese" },
  { icon: "/russian.png", name: "Russian", value: "russian" },
  { icon: "/japan.png", name: "Japanese", value: "japanese" },
  { icon: "/chinese.png", name: "Chinese", value: "chinese" },
  { icon: "/korean.png", name: "Korean", value: "korean" },
  { icon: "/others.png", name: "Other", value: "other" },
];

const LanguageGrid = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const { profile } = useSelector((state) => state.profile);
  const router = useRouter();

  const handleLanguageClick = (lang) => {
    if (profile) {
      router.push('/learning');
    } else {
      router.push(`/sign-up?language=${lang.value}`);
    }
  };

  return (
    <div className="text-center mt-5">
      <h2 className="text-4xl font-semibold text-[#074C77] my-10">I want to learn...</h2>
      <div className="flex justify-center flex-wrap gap-4">
        {languages.map((lang, index) => (
          <div
            key={index}
            onClick={() => handleLanguageClick(lang)}
            className={`cursor-pointer border-2 rounded-md hover:border-blue-500 transition duration-300 ${selectedLanguage === lang.name ? 'border-blue-500' : 'border-transparent'
              }`}
          >
            <img src={lang.icon} alt={lang.name} className="w-24 h-24" />
            <p className="mt-2">{lang.name}</p>
          </div>
        ))}
      </div>
      {selectedLanguage && (
        <div className="mt-4">
          <p className="text-xl">You selected: <span className="font-bold">{selectedLanguage}</span></p>
        </div>
      )}
    </div>
  );
};

export default LanguageGrid;
