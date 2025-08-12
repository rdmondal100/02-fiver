"use client";
import Image from "next/image";
import React, { useState } from "react";
import LanguageSelector from "./LanguageSelector";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGES } from "@/config/languages";
import { useSelector } from "react-redux";

const Banner = () => {
  const { t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[2]);
  const { profile } = useSelector((state) => state.profile);

  return (
    <div style={{ backgroundImage: `url('/bannerbg.png')` }} className="bg-white">


      <div
        className="min-h-[469px] max-w-[1440px] mx-auto bg-cover bg-center px-4 sm:px-6 lg:px-8"

      >
        <div className="flex flex-col lg:flex-row items-center justify-between w-full py-10 gap-8">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src={"/banner.png"}
              width={400}
              height={300}
              alt="banner image"
              className="w-[80%] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-auto"
            />
          </div>
          {/* Text Section */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h3 className="text-4xl sm:text-5xl md:text-[40px] lg:text-[45px] leading-snug text-primary font-semibold">
              Learn a language. Save the Planet.
            </h3>
            <p className="text-[26px] sm:text-3xl font-bold text-[#2e7d32] leading-relaxed my-10">
              Join us in our mission to save nature! We're dedicating 10% of
              our income to green initiatives
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4 mt-4">
              <div className="mx-auto sm:mx-0">
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  isBanner={true}
                />
              </div>
              <Link href={`${profile ? "/learning" : '/sign-up'}`}>
                <button className="hover:text-[#074C77] hover:bg-transparent text-base font-medium py-2 px-6 border-2 border-[#074C77] rounded-full bg-[#074C77] text-white transition-all duration-200">
                  Start to learn languages
                </button>
              </Link>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Banner;
