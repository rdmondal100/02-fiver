const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const BASE_URL = API_URL.replace(/\/api\/?$/, "");
const DEFAULT_IMAGE_URL =
    "https://png.pngtree.com/png-vector/20220621/ourmid/pngtree-user-avatar-icon-profile-silhouette-png-image_5252378.png";
const APP_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
const NEWS_API_URL = "https://newsapi.org/v2";
const GUARDIAN_API_URL = "https://content.guardianapis.com";
const MEDIASTACK_API_URL = "http://api.mediastack.com/v1";
const NUTRITIONIX_API_URL = "https://trackapi.nutritionix.com/v2";
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const GUARDIAN_API_KEY = process.env.NEXT_PUBLIC_GUARDIAN_API_KEY;
const MEDIASTACK_API_KEY = process.env.NEXT_PUBLIC_MEDIASTACK_API_KEY;
const NUTRITIONIX_APP_ID = process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = process.env.NEXT_PUBLIC_NUTRITIONIX_API_KEY;
const ZEGO_APP_ID = process.env.NEXT_PUBLIC_ZEGO_APP_ID || 1392571307
const ZEGO_SECRET_KEY = process.env.NEXT_PUBLIC_ZEGO_SECRET_KEY || "f12a9b29506e7cca7d0803636a270dfe"
const WORLD_MAP_IMAGE = 'https://app.tandem.net/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofile-map-hero.5169a879.png&w=1920&q=75'
export {
    API_URL,
    BASE_URL,
    DEFAULT_IMAGE_URL,
    APP_DOMAIN,
    MEDIASTACK_API_URL,
    GUARDIAN_API_URL,
    NEWS_API_URL,
    NUTRITIONIX_API_URL,
    NEWS_API_KEY,
    NUTRITIONIX_API_KEY,
    NUTRITIONIX_APP_ID,
    MEDIASTACK_API_KEY,
    GUARDIAN_API_KEY, ZEGO_APP_ID, ZEGO_SECRET_KEY, WORLD_MAP_IMAGE
};
