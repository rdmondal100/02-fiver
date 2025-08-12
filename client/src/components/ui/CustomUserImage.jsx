import { DEFAULT_IMAGE_URL } from "@/config/urls";
import React from "react";

function CustomUserImage({ src = "", alt = "", className = "", name }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.src = DEFAULT_IMAGE_URL;
      }}
      title={name || ""}
    />
  );
}

export default CustomUserImage;
