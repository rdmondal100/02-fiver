'use client'
import { useSelector } from "react-redux";

const LANGUAGES = [
    "Spanish",
    "English",
    "Italian",
    "Russian",
    "Japanese",
    "Chinese",
    "Portuguese",
    "French",
    "German",
];

const LearnGuide = () => {
    const { profile } = useSelector((state) => state.profile);


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch text-primary">
            {/* Left Side: Language Links with Padding */}
            <div className="py-10 px-4 sm:px-6 lg:px-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {/* Learn Languages */}
                    <div>
                        <h3 className="text-primary text-2xl font-semibold mb-4">Learn languages online</h3>
                        <ul className="space-y-2">
                            {LANGUAGES.map((lang) => (
                                <li key={lang}>
                                    <a href={profile ? "/learning" : "/login"} className="hover:underline">Learn {lang}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Practice Languages */}
                    <div>
                        <h3 className="text-primary text-2xl font-semibold mb-4">Find a language exchange partner</h3>
                        <ul className="space-y-2">
                            {LANGUAGES.map((lang) => (
                                <li key={lang}>
                                    <a href={profile ? "/community" : "/login"} className="hover:underline">Practice {lang}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            {/* Right Side: Image without Padding */}
            <div className="w-full h-full">
                <img
                    src="/partner-seat.jpg"
                    alt="Language exchange"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default LearnGuide;
