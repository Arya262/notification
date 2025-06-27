import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MessagingAnalytics from "./MessagingAnalytics.jsx";
import { Wallet, Banknote, PiggyBank, Crown, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";

const DashboardHome = () => {
  const [summary, setSummary] = useState({
    total_credit: 0,
    total_credit_remaining: 0,
    total_credit_consumed: 0,
    plan_type: "N/A",
  });
  const [usageHistory, setUsageHistory] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.customer_id) return;
    fetch(`${API_ENDPOINTS.CREDIT.GRAPH}?customer_id=${user.customer_id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setSummary({
          total_credit: data.total_credit,
          total_credit_remaining: data.total_credit_remaining,
          total_credit_consumed: data.total_credit_consumed,
          plan_type: "Premium",
        });
        setUsageHistory(data.usage_history || []);
      });
  }, [user?.customer_id]);

  const stats = [
    { title: "Total Credit", icon: Wallet, value: `₹${summary.total_credit}`, gradient: "gradient-1" },
    { title: "Used Credit", icon: Banknote, value: `₹${summary.total_credit_consumed}`, gradient: "gradient-2" },
    { title: "Remaining Credit", icon: PiggyBank, value: `₹${summary.total_credit_remaining}`, gradient: "gradient-3" },
    { title: "Plan Type", icon: Crown, value: summary.plan_type, gradient: "gradient-4" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h2>
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center gap-2 px-4 py-2 rounded text-sm md:text-base cursor-pointer"
          onClick={() => console.log("Add New Item clicked")}
          aria-label="Add new item"
          title="Add new item"
        >
          <Plus className="w-5 h-5" />
          Add Credit
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
        <MessagingAnalytics usageHistory={usageHistory} />
      </motion.div>
    </div>
  );
};

export default DashboardHome;
