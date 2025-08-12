"use client";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const profiles = [
  {
    name: "Philip",
    studies: "Spanish",
    knows: "English",
    studiesFlag: "/flag/pl.svg",
    knowsFlag: "/flag/zh.svg",
    image: "/person.jpeg",
  },
  {
    name: "Luis",
    studies: "Italian",
    knows: "Spanish",
    studiesFlag: "/flag/es.webp",
    knowsFlag: "/flag/en-uk.svg",
    image: "/person2.jpeg",
  },
  {
    name: "지원",
    studies: "German",
    knows: "Korean",
    studiesFlag: "/flag/zh.svg",
    knowsFlag: "/korean.svg",
    image: "/person3.jpeg",
  },
  {
    name: "Jane",
    studies: "English",
    knows: "German",
    studiesFlag: "/flag/pl.svg",
    knowsFlag: "/flag/en-uk.svg",
    image: "/person4.jpeg",
  },
  {
    name: "John",
    studies: "Italian",
    knows: "English",
    studiesFlag: "/korean.svg",
    knowsFlag: "/flag/es.webp",
    image: "/person5.jpeg",
  },
  {
    name: "Sarah",
    studies: "English",
    knows: "Italian",
    studiesFlag: "/flag/en-uk.svg",
    knowsFlag: "/flag/pl.svg",
    image: "/person6.jpeg",
  }, {
    name: "Aiko",
    studies: "Polish",
    knows: "Korean",
    studiesFlag: "/flag/pl.svg",
    knowsFlag: "/korean.svg",
    image: "/person7.jpeg",
  },
  {
    name: "Carlos",
    studies: "Chinese",
    knows: "Spanish",
    studiesFlag: "/flag/zh.svg",
    knowsFlag: "/flag/es.webp",
    image: "/person8.png",
  },
  {
    name: "Elena",
    studies: "Spanish",
    knows: "English",
    studiesFlag: "/flag/es.webp",
    knowsFlag: "/flag/en-uk.svg",
    image: "/person9.png",
  },
  {
    name: "Min-Jun",
    studies: "English",
    knows: "Korean",
    studiesFlag: "/flag/en-uk.svg",
    knowsFlag: "/korean.svg",
    image: "/person10.png",
  },
  {
    name: "Anna",
    studies: "Chinese",
    knows: "Polish",
    studiesFlag: "/flag/zh.svg",
    knowsFlag: "/flag/pl.svg",
    image: "/person11.jpeg",
  },
];

const Testimonial = () => {
  const { profile } = useSelector((state) => state.profile);
  return (
    <div className="min-h-screen ">
      <div className="mx-auto text-center p-10">
        <h1 className="text-[35px] font-semibold mb-8 text-primary">
          Millions of language partners.
          <br /> Any language combinations.
        </h1>

        <div className="relative overflow-hidden px-4 sm:px-6 lg:px-36">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={{ clickable: true }}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {profiles.map((profile, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col sm:flex-row items-center justify-between">
                  <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 overflow-hidden">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="text-center sm:text-left">
                    <h2 className="font-semibold text-2xl">{profile.name}</h2>
                    <div className="mt-2 flex items-center justify-center sm:justify-start space-x-2">
                      <span className="text-[18px] font-extralight">
                        Wants to learn
                      </span>
                      <img src={profile.studiesFlag} className="w-5 h-5" />
                    </div>
                    <div className="mt-1 flex items-center justify-center sm:justify-start space-x-2">
                      <span className="text-[18px] font-extralight">
                        Can teach you
                      </span>
                      <img src={profile.knowsFlag} className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Swiper navigation buttons */}
          {/* Custom Prev Button */}
          <div className="swiper-button-prev !w-8 !h-8 flex items-center justify-center absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
            <div className="w-8 h-8 rounded-full border border-[#074c77] text-[#074c77] bg-transparent flex items-center justify-center transition">
              <FaChevronLeft className="!h-4 !w-4" />
            </div>
          </div>

          {/* Custom Next Button */}
          <div className="swiper-button-next !w-8 !h-8 flex items-center justify-center absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
            <div className="w-8 h-8 rounded-full border border-[#074c77] text-[#074c77] bg-transparent flex items-center justify-center transition">
              <FaChevronRight className="!h-4 !w-4" />
            </div>
          </div>
        </div>

        <Link href={`${profile ? "/learning" : '/sign-up'}`}>
          <button className="hover:text-[#074C77] hover:bg-transparent text-base font-[500] py-2 border-2 border-[#074C77] mt-10 px-10 rounded-full  bg-[#074C77]  text-white">
            Start to learn languages
          </button>
        </Link>
      </div>

      <div className="relative mx-auto w-full text-center min-h-[26rem] py-[6rem] mt-10 flex justify-center items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('/explore-community.png')` }}
        />
        {/* Color Overlay */}
        <div className="absolute inset-0 bg-[#074c77] opacity-80 z-10" />
        <div className="z-30">
          <h3 className="text-5xl font-semibold text-gray-200 mt-5">
            🌿 More than Language
          </h3>
          <p className="max-w-[800px] text-2xl text-gray-200 mt-4">
            When you join Enligten, you’re not just learning—you’re helping the
            planet. We share inspiring nature news and tips for living green.
            Plus, we invest <strong> $10 from every subscription </strong> into <strong> verified
              environmental initiatives</strong>.
          </p>
          <p className="text-2xl text-gray-200 mt-4">
            <strong>Learn. Connect. Make a Difference.</strong>
          </p>
          <Link href={`${profile ? "/learning" : '/sign-up'}`}>
            <button className="hover:text-white hover:bg-transparent text-base font-[500] py-2 mt-10 px-10 rounded-full border-2 border-white bg-white  text-[#074C77]">
              Start to learn languages
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
