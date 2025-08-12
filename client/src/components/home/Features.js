"use client";
import Image from "next/image";
import { useState } from "react";
import { BsChatTextFill } from "react-icons/bs";
import { FiCheck, FiGlobe, FiVideo } from "react-icons/fi";
import VideoInFrame from "./VideoFrame";
import { AnimatePresence, motion } from "framer-motion";

const Features = () => {
  const [activeTab, setActiveTab] = useState("Chat");

  const tabs = [
    { name: "Chat", icon: <BsChatTextFill /> },
    { name: "Video", icon: <FiVideo /> },
    { name: "Correction", icon: <FiCheck /> },
    { name: "Translate", icon: <FiGlobe /> },
  ];

  const tabDescriptions = {
    Chat: "Irma and Jane connect effortlessly through text chats. They correct each other in real-time, share thoughts, and learn naturally through casual conversation.",
    Video: "Face-to-face learning with video calls enhances pronunciation, builds confidence, and makes language exchange more personal and effective.",
    Correction: "Get direct help with grammar and phrasing—Irma and Jane provide real-time corrections to help each other sound more fluent and natural.",
    Translate: "Built-in translation support helps Jane understand German phrases and Irma grasp English idioms—no need to leave the app.",
  };

  return (
    <div className="mt-20 text-[#074C77] px-4">
      <h2 className="text-center text-[36px] leading-[40px] font-semibold">
        Irma and Jane met on <br />
        the app Enlighten...
      </h2>

      <div className="flex flex-col lg:flex-row items-center justify-center my-10 gap-10 max-w-[1200px] mx-auto">
        <div className="w-full lg:w-1/2 flex justify-center items-center order-2 lg:order-1 min-h-[700px]">
          <AnimatePresence mode="wait">
            {activeTab === "Chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={"/phone1.png"}
                  width={350}
                  height={700}
                  alt="phone 1"
                  className="w-[350px] h-auto object-cover"
                />
              </motion.div>
            )}

            {activeTab === "Video" && (
              <motion.div
                key="video"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <VideoInFrame video={"/video.jpg"} isImage={true} />
              </motion.div>
            )}

            {activeTab === "Correction" && (
              <motion.div
                key="correction"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <VideoInFrame video={"/correction.mp4"} />
              </motion.div>
            )}

            {activeTab === "Translate" && (
              <motion.div
                key="translate"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <VideoInFrame video={"/translate.mp4"} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        <div className="w-full lg:w-1/2 order-1 lg:order-2">
          <div className="flex flex-wrap justify-center gap-4 px-2 sm:px-10">
            {tabs.map((tab) => (
              <div
                key={tab.name}
                className={`flex flex-col justify-between items-center cursor-pointer pb-2 w-[100px] ${activeTab === tab.name
                  ? "text-[#2cc1d7] border-b-4 border-[#2cc1d7]"
                  : "text-gray-400"
                  }`}
                onClick={() => setActiveTab(tab.name)}
              >
                <div
                  className={`p-4 sm:p-6 rounded-full border-2 text-2xl sm:text-3xl font-extrabold ${activeTab === tab.name
                    ? "border-[#2cc1d7]"
                    : "border-gray-300"
                    }`}
                >
                  {tab.icon}
                </div>
                <span
                  className={`mt-2 text-sm sm:text-base ${activeTab === tab.name
                    ? "text-[#2cc1d7] font-semibold"
                    : "text-gray-500"
                    }`}
                >
                  {tab.name}
                </span>
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeTab} // dynamic key triggers re-render and animation
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-lg sm:text-2xl font-medium leading-relaxed tracking-wide mt-8 sm:mt-20 px-4 sm:px-10 text-center sm:text-left"
            >
              {tabDescriptions[activeTab]}
            </motion.p>
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default Features;
