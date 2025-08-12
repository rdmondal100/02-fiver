export const LANGUAGES = [
    { icon: "/eng.svg", show: "English", value: "english" },
    { icon: "/italy.svg", show: "Italian", value: "italian" },
    { icon: "/spain.svg", show: "Spanish", value: "spanish" },
    { icon: "/france.svg", show: "French", value: "french" },
    { icon: "/germany.svg", show: "German", value: "german" },
    { icon: "/china.svg", show: "Chinese", value: "chinese" },
    { icon: "/japan.svg", show: "Japanese", value: "japanese" },
    { icon: "/portugal.svg", show: "Portuguese", value: "portuguese" },
    { icon: "/russia.svg", show: "Russian", value: "russian" },
    { icon: "/korean.svg", show: "Korean", value: "korean" },
    { icon: "/india.svg", show: "Hindi", value: "hindi" },
];

export const getLanguageLabel = (value) => {
    return LANGUAGES.find((lang) => lang.value === value)?.show || value;
};