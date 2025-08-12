

// export const  WP_BASE_URL ="http://localhost:8081/wp-json/wp/v2"

export function getWPBaseUrl() {
  const isServer = typeof window === "undefined";
  return isServer
    ? process.env.WP_BASE_URL_SERVER
    : process.env.NEXT_PUBLIC_WP_BASE_URL;
}
