export const stripHtml = function (html?: string | null) {
  if (!html) return "";

  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
};

export const toTitleCase = function (value?: string | null, fallback = "") {
  if (!value) return fallback;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const formatTime = function (seconds: number) {
  const total = Math.floor(Math.max(seconds, 0));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
