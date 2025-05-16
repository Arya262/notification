
export const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  

  let hours = date.getHours() % 12;
  if (hours === 0) hours = 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  

  if (date.toDateString() === now.toDateString()) {
    return `${hours}:${minutes} ${ampm}`;
  }
  

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
 
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
