"use client";
import { LANGUAGES } from "@/config/languages";
import React, { useState, useRef, useEffect } from "react";

const LanguageSelector = ({ selectedLanguage, setSelectedLanguage, isBanner }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown when the button is clicked
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Function to handle language change
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center justify-between px-4 py-2 border-2 border-[#074C77] rounded-full shadow-sm ${isBanner ? "bg-white" : ""} `}
      >
        {!selectedLanguage ?
          <span className="text-gray-500">Select Language</span> :
          <>
            <img src={selectedLanguage?.icon} alt="" className="w-5 h-5 mr-2" />
            <span>{selectedLanguage?.show}</span>
          </>}
        <img src="/dropdown-icon.png" className="ml-2" />
      </button>

      {isOpen && (
        <div className="absolute mt-2 bg-white border border-gray-300 w-full rounded-md shadow-lg z-10">
          {LANGUAGES?.map((lang) => (
            <button
              key={lang?.value}
              onClick={() => handleLanguageChange(lang)} // Call the handler function
              className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
            >
              <img src={lang?.icon} alt={lang?.show} className="w-5 h-5 mr-2" />
              {lang?.show}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
