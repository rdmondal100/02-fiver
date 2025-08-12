"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import axios from "axios";
import { format } from "date-fns";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/bundle";
import Link from "next/link";
import { FaMessage } from "react-icons/fa6";
import { BsCircleFill } from "react-icons/bs";
import { getWPBaseUrl } from "@/utils/constants";


  const WP_BASE_URL = getWPBaseUrl();

// Skeleton Loader Component
const CarouselSkeleton = () => {
  return (
    <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] relative overflow-hidden rounded-xl shadow-md mb-8">
      <div className="w-full h-full bg-gray-300 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="h-6 w-1/2 bg-gray-400 rounded animate-pulse mb-3"></div>
        <div className="flex gap-4">
          <div className="h-4 w-20 bg-gray-400 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-400 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-400 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopPosts();
  }, []);

  const fetchTopPosts = async () => {
    try {
      const res = await axios.get(`${WP_BASE_URL}/posts?_embed&per_page=5`);
      const posts = res.data
        .filter((post) => post._embedded?.["wp:featuredmedia"]?.[0]?.source_url)
        .map((post) => ({
          id: post.id,
          title: post.title.rendered,
          image: post._embedded["wp:featuredmedia"][0].source_url,
          slug: post.slug,
          date: post.date,
          category:
            post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Uncategorized",
          author: post._embedded?.author?.[0]?.name || "Unknown",
        }));

      setSlides(posts);
    } catch (err) {
      console.error("Error fetching top posts:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CarouselSkeleton />;
  }

  if (slides.length === 0) return null;

  return (
    <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] relative overflow-hidden rounded-xl shadow-md mb-8">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative cursor-pointer">
            <Link href={`/nature-news/${slide.slug}`}>
              <img
                src={slide.image}
                alt="Slide"
                className="w-full h-full object-cover brightness-75 transition-transform duration-500 hover:scale-105"
              />

              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="max-w-2xl">
                  <h2
                    className="text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg leading-snug transition-transform duration-300 group-hover:translate-y-[-2px]"
                    dangerouslySetInnerHTML={{ __html: slide.title }}
                  />

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    {/* Category Badge */}
                    <span className="inline-block bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-3 py-1 rounded-full font-medium tracking-wide uppercase text-xs">
                      {slide.category}
                    </span>

                    {/* Date */}
                    <span className="text-gray-400 dark:text-gray-400 flex items-center gap-1">
                      <FaMessage />
                      {format(new Date(slide.date), "MMMM dd, yyyy")}
                    </span>

                    {/* Author */}
                    <span className="text-gray-400 dark:text-gray-400 flex items-center gap-1">
                      <BsCircleFill />
                      {slide.author}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Swiper Button Styles */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          width: 40px;
          height: 40px;
          color: white;
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 20px;
        }
        .swiper-pagination-bullet {
          background: white;
          opacity: 0.7;
        }
        .swiper-pagination-bullet-active {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default Carousel;
