import React from "react";
import { motion } from "framer-motion";
import "./DashboardHome.css";
import MessagingAnalytics from "./charts.jsx";
import vendor from "../../assets/Vector.png";

// Lucide icons
import { Wallet, Banknote, PiggyBank, Crown } from "lucide-react";

const DashboardHome = () => {
  return (
    <div>
      <div className="dashboard-home">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h2>
          <button
            className="bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center gap-2 px-4 py-2 rounded text-sm md:text-base"
            onClick={() => console.log("Add New Item clicked")}
            aria-label="Add new item"
            title="Add new item"
          >
            <img src={vendor} alt="plus sign" className="w-5 h-5" />
            Add New Item
          </button>
        </div>

        <div className="dashboard-summary">
          <motion.div
            className="summary-item gradient-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Wallet className="summary-icon" />
            <h3>Total Credit</h3>
            <p>₹10,000</p>
          </motion.div>

          <motion.div
            className="summary-item gradient-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Banknote className="summary-icon" />
            <h3>Used Credit</h3>
            <p>₹4,200</p>
          </motion.div>

          <motion.div
            className="summary-item gradient-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PiggyBank className="summary-icon" />
            <h3>Remaining Credit</h3>
            <p>₹5,800</p>
          </motion.div>

          <motion.div
            className="summary-item gradient-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Crown className="summary-icon" />
            <h3>Plan Type</h3>
            <p>Premium</p>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MessagingAnalytics />
      </motion.div>
    </div>
  );
};

export default DashboardHome;