"use client";

import UserMenu from "@/components/ui/UserMenu";
import { useLanguage } from "@/context/LanguageContext";
import {
  resetSelectedUser, selectTotalUnreadCount,
  fetchAllChats, fetchAllChatsSilent
} from "@/features/user/chatSlice";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const privet = ["/login", "/sign-up", "/forgot-password", "/reset-password"];

const Navbar = () => {
  const { t } = useLanguage();
  const pathName = usePathname();
  const dispatch = useDispatch();
  const isPaymentVerifyPage = pathName === "/verify-payment";
  const router = useRouter();
  const { profile, status } = useSelector((state) => state.profile);

  const navList = [
    { name: t("nav.findPartner"), url: "community" },
    { name: t("nav.chat"), url: "chat" },
    { name: t("nav.natureNews"), url: "nature-news" },
    { name: "Learn", url: "learning" },
    { name: "Prices", url: "subscription" },
  ];

  const [isSticky, setIsSticky] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const unreadCount = useSelector(selectTotalUnreadCount);

  useEffect(() => {
    if (!profile) {
      return
    }
    dispatch(fetchAllChatsSilent());
    const interval = setInterval(() => {
      dispatch(fetchAllChatsSilent());
    }, 2000);

    return () => clearInterval(interval);
  }, [dispatch]);


  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 8);
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isPrivatePath = privet.some((privetPath) => pathName.includes(privetPath));
  const textColorClass = "text-[#074C77]";

  const handleNavClick = (e, item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      e.preventDefault();
      toast("You must be logged in to access this page.", { icon: "🔒" });
      router.push("/login");
      return;
    }

    if (!profile?.profileCompleted) {
      e.preventDefault();
      toast("Please complete your profile setup first.", { icon: "ℹ️" });
      router.push("/profile");
    }
    if (item?.url === "chat") {
      dispatch(resetSelectedUser());
    }
  };

  const getNavStyles = (url) => {
    const isActive = pathName.startsWith(`/${url}`);
    const activeTextColor = isActive ? "text-[#074C77] font-bold" : textColorClass;
    const activeBgClass = isActive ? "bg-[#f0f8ff] rounded-md" : "";
    const underlineClass = isActive ? "opacity-100 bg-[#074C77]" : "opacity-0 group-hover:opacity-100 bg-black";

    return { isActive, activeTextColor, activeBgClass, underlineClass };
  };

  return (
    <div className={`w-full z-50 h-[75px] md:h-auto transition-colors duration-300 sticky top-0 ${isSticky ? "bg-white" : "bg-transparent"} ${pathName === "/dashboard" && "hidden"}`}>
      <div className="max-w-[1440px] mx-auto flex justify-between items-center px-5 py-4 ">
        {/* Logo & Title */}
        <Link href={"/"}>
          <div className="flex items-center space-x-1">
            <Image
              src="https://res.cloudinary.com/dh20zdtys/image/upload/v1723709261/49f87c8af2a00c070b11e2b15349fa1c_uakips.png"
              width={50}
              height={50}
              alt="Logo"
              unoptimized
            />
            <h2 className={`${textColorClass} font-bold text-[16px] sm:text-xl`}>Enlighten</h2>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        {!isPrivatePath && !isPaymentVerifyPage && (
          <div className="hidden lg:flex space-x-12">
            {navList.map((item) => {
              const { activeTextColor, underlineClass } = getNavStyles(item.url);

              return (
                <Link
                  href={`/${item.url}`}
                  key={item.name}
                  onClick={(e) => handleNavClick(e, item)}
                  className="group"
                >
                  {/* <p className={`${activeTextColor} text-base font-semibold transition-colors duration-300`}>{item.name}</p> */}
                  <p className={`${activeTextColor} text-base font-semibold transition-colors duration-300 flex items-center gap-1`}>
                    {item.name}
                    {item.name === "Chat" && unreadCount > 0 && (
                      <span className="inline-block bg-red-500 text-white text-xs px-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </p>
                  <p className={`w-full rounded-full h-[2px] ${underlineClass} transition-opacity duration-300`}></p>
                </Link>
              );
            })}

          </div>
        )}

        {/* Hamburger Menu (Mobile) */}
        {!isPrivatePath && !isPaymentVerifyPage && (
          <div className="lg:hidden ms-auto">
            <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
              <svg className={`w-6 h-6 ${textColorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        )}

        {/* Buttons / UserMenu (Visible on all screens) */}
        {!isPaymentVerifyPage && (
          status === "loading" ? (
            <div className="flex space-x-3 items-center ml-3">
              <div className="h-8 w-20 bg-gray-300 rounded-full" />
              <div className="h-8 w-20 bg-gray-300 rounded-full" />
            </div>
          ) : (
            <>
              {!profile ? (
                <div className="flex space-x-3 items-center ml-3">
                  {pathName !== "/login" && (
                    <Link href="/login" onClick={() => setMenuOpen(false)}>
                      <button className="text-[#074C77] border-[#074C77]">
                        {t("loginButton")}
                      </button>
                    </Link>
                  )}
                  {pathName !== "/sign-up" && (
                    <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
                      <button className="hover:text-[#074C77] hover:bg-transparent text-base font-normal border-2 border-[#074C77] py-2 px-4 rounded-full bg-[#074C77] text-white">
                        {t("signupButton")}
                      </button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="ml-3">
                  <UserMenu setMenuOpen={setMenuOpen} />
                </div>
              )}
            </>
          )
        )}

      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && !isPrivatePath && (
        <div className="lg:hidden pb-4">
          <div className="flex flex-col space-y-4 bg-white border-gray-200 border shadow-lg z-40 p-4">
            {navList.map((item) => {
              const { activeTextColor, activeBgClass } = getNavStyles(item.url);

              return (
                <Link
                  href={`/${item.url}`}
                  key={item.name}
                  onClick={(e) => {
                    handleNavClick(e, item);
                    setMenuOpen(false);
                  }}
                  className={`group px-3 py-2 transition-colors duration-300 ${activeBgClass}`}
                >
                  <p className={`${activeTextColor} text-base font-semibold flex items-center gap-1`}>
                    {item.name}
                    {item.name === "Chat" && unreadCount > 0 && (
                      <span className="inline-block bg-red-500 text-white text-xs px-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </p>
                </Link>
              );
            })}

          </div>
        </div>

      )}
    </div>
  );
};

export default Navbar;
