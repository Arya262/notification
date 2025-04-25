// utils/time.js
export const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  
  // Format time to 12-hour without AM/PM
  let hours = date.getHours() % 12; // 12-hour format
  if (hours === 0) hours = 12;  // Handle midnight case
  
  const minutes = date.getMinutes().toString().padStart(2, "0"); 
  
  return `${hours}:${minutes}`;
};
