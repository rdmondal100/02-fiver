import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CategoryTabs = ({ categories, selectedCategory, onSelectCategory }) => {
  const scrollContainerRef = useRef(null);
  const activeRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Auto scroll to active category
  useEffect(() => {
    if (activeRef.current && scrollContainerRef.current) {
      const parent = scrollContainerRef.current;
      const child = activeRef.current;
      const offset =
        child.offsetLeft -
        parent.offsetLeft -
        parent.clientWidth / 2 +
        child.clientWidth / 2;

      parent.scrollTo({ left: offset, behavior: "smooth" });
    }
  }, [selectedCategory]);

  // Check scrollability
  useEffect(() => {
    const el = scrollContainerRef.current;
    const checkScroll = () => {
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    if (el) {
      checkScroll();
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  const scroll = (dir) => {
    const el = scrollContainerRef.current;
    el.scrollBy({ left: dir === "left" ? -150 : 150, behavior: "smooth" });
  };

  return (
    <div className="relative mb-6 w-full">
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 text-gray-600 shadow-md rounded-full p-1 md:hidden"
          onClick={() => scroll("left")}
        >
          <FaChevronLeft size={16} />
        </button>
      )}

      {/* Scrollable category container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto no-scrollbar px-8"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        <div className="flex gap-2 flex-nowrap md:flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              ref={selectedCategory === category ? activeRef : null}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-full transition-all shrink-0 text-sm ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Right arrow */}
      {canScrollRight && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 text-gray-600 shadow-md rounded-full p-1 md:hidden"
          onClick={() => scroll("right")}
        >
          <FaChevronRight size={16} />
        </button>
      )}
    </div>
  );
};

export default CategoryTabs;
