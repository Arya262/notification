import React from "react";
import { motion } from "framer-motion";
import "./DashboardHome.css";
import vendor from "../../assets/Vector.png";

const DashboardHome = () => {
  return (
    <div className="dashboard-home">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2 px-4 py-2 rounded"
          onClick={() => {/* Add your action here */}}
        >
          <img src={vendor} alt="plus sign" className="w-5 h-5" />
          Add New Item
        </button>
      </div>
      <div className="dashboard-summary">
        <motion.div
          className="summary-item"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3>Total Credit</h3>
          <p>₹10,000</p>
        </motion.div>

        <motion.div
          className="summary-item"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3>Used Credit</h3>
          <p>₹4,200</p>
        </motion.div>

        <motion.div
          className="summary-item"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Remaining Credit</h3>
          <p>₹5,800</p>
        </motion.div>

        <motion.div
          className="summary-item"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3>Plan Type</h3>
          <p>Premium</p>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
