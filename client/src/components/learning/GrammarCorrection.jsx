"use client";
import axiosInstance from "@/config/axiosConfig";
import { useState } from "react";
import { FaCheck, FaSpinner } from "react-icons/fa";
const GrammarCorrection = () => {
  const [text, setText] = useState("");
  const [corrections, setCorrections] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");

  const languages = [
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "nl", name: "Dutch" },
    { code: "ru", name: "Russian" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
  ];

  const checkGrammar = async () => {
    if (!text.trim()) return;

    setIsChecking(true);
    try {
      const response = await axiosInstance.post("/learning/check-grammar", {
        text,
        selectedLanguage,
      });

      const { gptResponse } = response.data;
      setCorrections({ message: gptResponse });
    } catch (error) {
      console.error("Error checking grammar:", error);
      setCorrections({ message: "Failed to check grammar. Please try again." });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Grammar & Writing Correction</h2>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Language:
        </label>
        <select
          className="w-full p-2 border rounded"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Your Text:
        </label>
        <textarea
          className="w-full p-2 border rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          rows="6"
        />
      </div>

      <button
        onClick={checkGrammar}
        disabled={isChecking || !text.trim()}
        className="flex items-center justify-center w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isChecking ? (
          <>
            <FaSpinner className="animate-spin mr-2" /> Checking...
          </>
        ) : (
          <>
            <FaCheck className="mr-2" /> Check Grammar & Style
          </>
        )}
      </button>

      {corrections && (
        <div className="mt-6">
          <h3 className="font-bold mb-3">Result:</h3>
          {corrections.message.startsWith("This is incorrect.") ? (
            <p className="text-red-500">
              {corrections.message.split("Correct is: ")[0]}
              <span className="font-bold text-green-500">
                Correct is: {corrections.message.split("Correct is: ")[1]}
              </span>
            </p>
          ) : (
            <p className="text-green-500">{corrections.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GrammarCorrection;
