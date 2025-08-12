"use client";
import TranslateThought from "@/components/learning/TranslateThought";
import GrammarCorrection from "@/components/learning/GrammarCorrection";
import EnlightenAI from "@/components/learning/EnlightenAI";
import PageLoader from "@/components/loaders/pageLoader";
import useSubscriptionCheck from "@/hooks/useSubscriptionCheck";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const LearningPage = () => {
  const [activeTab, setActiveTab] = useState("AI-tutor");
  // const { loading, redirectReason } = useSubscriptionCheck();

  // useEffect(() => {
  //   if (redirectReason) {
  //     toast(redirectReason, { icon: "ℹ️" });
  //   }
  // }, [redirectReason]);

  const tabs = [
    {
      id: "AI-tutor",
      label: "Talk To Enlighten",
      description: "Have real conversations with AI tutors.",
    },
    {
      id: "translate_thought",
      label: "Translate Your Thoughts",
      description: "Translate your thoughts into different languages.",
    },
    {
      id: "grammar",
      label: "Grammar Correction",
      description: "Correct your grammar mistakes.",
    },
  ];

  return (

    <>
      {/* {
        // loading ?
        //   <PageLoader />
        //   : */}
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="text-4xl font-bold text-center mb-8">
          Learning Resources
        </h1>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-lg text-left transition-all ${activeTab === tab.id
                ? "bg-green-500 text-white"
                : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
            >
              <h3 className="font-bold text-lg mb-2">{tab.label}</h3>
              <p
                className={`text-sm ${activeTab === tab.id ? "text-green-100" : "text-gray-600"
                  }`}
              >
                {tab.description}
              </p>
            </button>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          {activeTab === "AI-tutor" && <EnlightenAI />}
          {activeTab === "translate_thought" && <TranslateThought />}
          {activeTab === "grammar" && <GrammarCorrection />}
        </div>


      </div>
      {/* } */}
    </>

  );
};

export default LearningPage;
