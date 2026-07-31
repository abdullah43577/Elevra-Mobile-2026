export const formatTime = function (seconds: number) {
  const total = Math.floor(Math.max(seconds, 0));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
