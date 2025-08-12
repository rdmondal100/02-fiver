// VideoInFrame.jsx
"use client";

import Image from 'next/image';
import React from 'react';

const VideoInFrame = ({ video, isImage }) => {
  return (
    <div className="relative w-[350px] h-[700px]">
      {/* Phone frame */}
      <img
        src="/frame.webp"
        alt="Phone Frame"
        className="absolute inset-0 w-full h-full"
      />

      {/* Video inside frame */}
      {
        isImage ?
          <Image
            src={video}
            width={350}
            height={700}
            alt="phone 1"
            className="absolute top-[18px] left-[6%] w-[89%] h-[95%] object-cover rounded-[40px]"
          />
          :
          <video
            src={video}
            autoPlay
            loop
            muted
            className="absolute top-[18px] left-[6%] w-[89%] h-[95%] object-cover rounded-[40px]"
          />}
    </div>
  );
};

export default VideoInFrame;
