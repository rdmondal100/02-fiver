'use client'
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useSelector } from "react-redux";
const Footer = () => {
  const { profile } = useSelector((state) => state.profile);
  return (
    <>
      <footer className="bg-primary text-gray-50 py-10">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-sm">
            {/* Useful Information */}
            <div>
              <h3 className="text-white text-2xl font-semibold mb-4">
                🌍 Enlighten
              </h3>
              <p className="text-white mb-0">
                <strong>🌍 Learn languages. 🌱 Give back to nature. 💚</strong>
              </p>
              <p className="text-white">
                {" "}
                Enlighten invests <strong> 10% of all income </strong>into nature protection.
              </p>
            </div>

            {/* Local Tandems - Part 2 */}
            <div>
              <h3 className="text-white text-2xl font-semibold mb-4">
                🔗 Explore
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href={`${profile ? "/nature-news" : "#"}`} className="hover:underline">
                    Blog
                  </a>
                </li>
                <li>
                  <a href={`${profile ? "/community" : "#"}`} className="hover:underline">
                    Find a Language Partner
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Download the App
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Info */}
            <div>
              <h3 className="text-white text-2xl font-semibold mb-4">
                🌱 Our Green Mission
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:underline">
                    How We Give Back
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Environmental Impact
                  </a>
                </li>
                <li>
                  <a href={`${profile ? "/nature-news" : "#"}`} className="hover:underline">
                    Weekly Nature News
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media + App Links */}
            <div>
              <h3 className="text-white text-2xl font-semibold mb-6">
                📬 Connect
              </h3>

              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:underline">
                    support@enlighten.com
                  </a>
                </li>
                <li>
                  Follow us:{" "}
                  <a
                    href="https://www.instagram.com/enligten_official/"
                    target="_blank"
                    className="text-gray-200 hover:text-white"
                  >
                    Instagram
                  </a>{" "}
                  |{" "}
                  <a
                    href="https://x.com/Enligten_App"
                    target="_blank"
                    className="text-gray-200 hover:text-white"
                  >
                    Twitter
                  </a>{" "}
                  |{" "}
                  <a
                    href="https://www.youtube.com/@enligten_officiall"
                    target="_blank"
                    className="text-gray-200 hover:text-white"
                  >
                    YouTube
                  </a>
                  <div className="inline-flex space-x-4 mb-4 ">
                    {/* <a
                      href="https://www.instagram.com/enligten_official/"
                      target="_blank"
                      className="text-gray-200 hover:text-white"
                    >
                      <FaInstagram size={30} />
                    </a> */}
                    {/* <a
                      href="https://www.facebook.com/profile.php?id=61571759064184"
                      target="_blank"
                      className="text-gray-200 hover:text-white"
                    >
                      <FaFacebookF size={30} />
                    </a> */}
                    {/* <a
                      href="https://x.com/Enligten_App"
                      target="_blank"
                      className="text-gray-200 hover:text-white"
                    >
                      <FaXTwitter size={30} />
                    </a> */}
                    {/* <a
                      href="https://www.tiktok.com/@enligten_official"
                      target="_blank"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaTiktok size={30} />
                    </a> */}
                    {/* <a
                      href="https://www.youtube.com/@enligten_officiall"
                      target="_blank"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaYoutube size={30} />
                    </a> */}
                  </div>
                </li>
              </ul>

              <div className="flex items-center space-x-2 mt-5">
                <img
                  src="https://res.cloudinary.com/dh20zdtys/image/upload/v1723709261/49f87c8af2a00c070b11e2b15349fa1c_uakips.png"
                  alt="Logo"
                  className="w-12 h-12 object-contain"
                />
                <span className="text-white font-bold text-xl">Enlighten</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="text-center text-[16px] text-gray-400 bg-black py-6 px-4">
        <p>© 2025 Enligten — Powered by Teachers. Inspired by Nature. 🌿</p>
      </div>
    </>
  );
};

export default Footer;
