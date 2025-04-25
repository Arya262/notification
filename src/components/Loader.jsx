import React from "react";

const Loader = () => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  spinner: {
    border: "16px solid #f3f3f3", /* Light grey */
    borderTop: "16px solid #3498db", /* Blue */
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    animation: "spin 2s linear infinite",
  },
};

export default Loader;
