import React from "react";
import { motion } from "framer-motion";
import MessagingAnalytics from "./MessagingAnalytics.jsx";
import { Wallet, Banknote, PiggyBank, Crown, Plus } from "lucide-react";

// Summary card data
const stats = [
  { title: "Total Credit", icon: Wallet, value: "₹10,000", gradient: "gradient-1" },
  { title: "Used Credit", icon: Banknote, value: "₹4,200", gradient: "gradient-2" },
  { title: "Remaining Credit", icon: PiggyBank, value: "₹5,800", gradient: "gradient-3" },
  { title: "Plan Type", icon: Crown, value: "Premium", gradient: "gradient-4" },
];

const DashboardHome = () => {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h2>
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center gap-2 px-4 py-2 rounded text-sm md:text-base"
          onClick={() => console.log("Add New Item clicked")}
          aria-label="Add new item"
          title="Add new item"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
        {stats.map(({ title, icon: Icon, value, gradient }, i) => (
          <motion.div
            key={title}
            className={`p-6 rounded-xl text-white shadow-md transform transition-transform duration-300 hover:-translate-y-1 text-left sm:text-center relative ${gradient}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 + i * 0.1 }}
          >
            <Icon className="w-8 h-8 mb-3 mx-auto" />
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xl font-bold">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <motion.div
        className="mt-10"
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
