import React, { useState } from "react";
import { motion } from "framer-motion";
import "./DashboardHome.css";

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

const DashboardHome = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setModalOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "New user signed up!", type: "info" },
    { id: 2, text: "Server maintenance tonight", type: "warning" },
  ]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="dashboard-summary">
            <motion.div
              className="summary-item"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>Recent Activity</h3>
              <p>View your latest activities and updates.</p>
            </motion.div>

            <motion.div
              className="summary-item"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h3>System Status</h3>
              <p>Check the current system status and notifications.</p>
            </motion.div>

            <motion.div
              className="summary-item"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <h3>Quick Links</h3>
              <p>Access frequently used features quickly.</p>
            </motion.div>
          </div>
        );
      case "reports":
        return <p>Reports will be shown here.</p>;
      case "settings":
        return <p>Settings content will be here.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-home">
      <h2>Welcome to Your Dashboard!</h2>
      <p>Choose from the options below to explore your dashboard.</p>

      {/* Notifications */}
      <div className="notifications">
        {notifications.map((note) => (
          <div key={note.id} className={`notification ${note.type}`}>
            {note.text}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button onClick={() => setActiveTab("overview")}>Overview</button>
        <button onClick={() => setActiveTab("reports")}>Reports</button>
        <button onClick={() => setActiveTab("settings")}>Settings</button>
        <button onClick={() => setModalOpen(true)}>Open Modal</button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">{renderTabContent()}</div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h3>Detailed Stats</h3>
        <p>Here’s where you could show charts or deeper insights.</p>
      </Modal>
    </div>
  );
};

export default DashboardHome;
