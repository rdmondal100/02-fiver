import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProfileMenuBar = ({ activeTab, handleMenuItemClick, menuItems }) => {
    const listRef = useRef(null);
    const activeRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        if (activeRef.current && listRef.current) {
            const parent = listRef.current;
            const child = activeRef.current;
            const offset =
                child.offsetLeft -
                parent.offsetLeft -
                parent.clientWidth / 2 +
                child.clientWidth / 2;

            parent.scrollTo({ left: offset, behavior: "smooth" });
        }
    }, [activeTab]);

    useEffect(() => {
        const el = listRef.current;
        const checkScroll = () => {
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
        const el = listRef.current;
        el.scrollBy({ left: dir === "left" ? -100 : 100, behavior: "smooth" });
    };

    return (
        <div className="md:w-1/4 pr-6 relative">
            {/* Prev Button (small screens only) */}
            {canScrollLeft && (
                <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-transparent border-2 border-primary text-primary shadow-md rounded-full p-1 md:hidden"
                    onClick={() => scroll("left")}
                >
                    <FaChevronLeft size={18} />
                </button>
            )}

            <ul
                ref={listRef}
                className={`
                    flex md:flex-col flex-row 
                    items-start gap-5 text-base 
                    overflow-x-auto md:overflow-visible 
                    whitespace-nowrap scroll-smooth
                    md:h-auto h-12
                `}
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        ref={activeTab === item.label ? activeRef : null}
                        className={`list-none ${activeTab === item.label
                            ? "bg-gray-200 text-blue-500"
                            : "text-[#222] hover:bg-gray-100 hover:text-blue-500"
                            } rounded-full px-7 py-2 cursor-pointer transition-all shrink-0`}
                        onClick={() => handleMenuItemClick(item.label)}
                    >
                        {item.label}
                    </li>
                ))}
            </ul>

            {/* Next Button (small screens only) */}
            {canScrollRight && (
                <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-transparent border-2 border-primary text-primary shadow-md rounded-full p-1 md:hidden"
                    onClick={() => scroll("right")}
                >
                    <FaChevronRight size={18} />
                </button>
            )}
        </div>
    );
};

export default ProfileMenuBar;
