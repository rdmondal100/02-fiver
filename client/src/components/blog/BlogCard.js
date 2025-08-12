import React from "react";

// Function to calculate reading time based on word count
const calculateReadTime = (description) => {
  const wordsPerMinute = 200;
  const words = description?.split(" ")?.length || 0;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes}-min read`;
};

const BlogCard = ({ category, title, description, image }) => {
  return (
    <div className="relative bg-white min-h-[375px] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative h-48 w-full">
        <img
          src={image || "/placeholder-image.jpg"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>{category}</span>
          <span>{calculateReadTime(description)}</span>
        </div>

        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{title}</h3>

        <p className="text-gray-600 text-sm line-clamp-4 mb-auto">{description}</p>
      </div>
    </div>
  );
};

export default BlogCard;
