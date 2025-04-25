import React from "react";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p style={styles.message}>Sorry, the page you're looking for doesn't exist.</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    marginTop: "100px",
  },
  heading: {
    fontSize: "3rem",
    color: "#ff6347",
  },
  message: {
    fontSize: "1.5rem",
    color: "#555",
  },
};

export default NotFound;
