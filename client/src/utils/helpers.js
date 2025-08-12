export const isRecentLoginWithin5Min = (timestamp) => {
    if (!timestamp) return false;

    const now = new Date();
    const loginTime = new Date(timestamp);
    const diffInMs = now - loginTime;
    const diffInMinutes = diffInMs / (1000 * 60);

    return diffInMinutes <= 5;
};

export const formatFullDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};


export function formatName(displayName) {
    if (!displayName) return "";

    const parts = displayName.trim().split(" ");

    if (parts.length > 1) {
        return `${parts[0]} ${parts[1][0]}.`;
    }

    return displayName;
}
