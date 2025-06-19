import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";

const COLORS = ['#00C49F', '#FF8042'];

export default function MessagingAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChartData = async () => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.CREDIT.GRAPH}?customer_id=${user?.customer_id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch usage data");

      const result = await response.json();

      const formatted = result.map((item) => ({
        usage_date: new Date(item.usage_date).toISOString().split("T")[0],
        messages_sent: parseInt(item.messages_sent || 0),
        messages_received: parseInt(item.messages_received || 0),
        total_messages: parseInt(item.messages_sent || 0) + parseInt(item.messages_received || 0),
        total_cost: parseFloat(item.total_cost || 0),
        gupshup_fees: parseFloat(item.gupshup_fees || 0),
        meta_fees: parseFloat(item.meta_fees || 0),
      }));

      setData(formatted);
      console.log(formatted);
    } catch (err) {
      console.error("Error loading chart data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.customer_id) {
      fetchChartData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.customer_id]);

  if (loading) return <p className="p-4 text-gray-600">Loading charts...</p>;
  if (!data.length) return <p className="p-4 text-gray-600">No data available.</p>;

  // Pie chart data
  const totalSent = data.reduce((sum, d) => sum + d.messages_sent, 0);
  const totalReceived = data.reduce((sum, d) => sum + d.messages_received, 0);
  const totalGupshup = data.reduce((sum, d) => sum + d.gupshup_fees, 0);
  const totalMeta = data.reduce((sum, d) => sum + d.meta_fees, 0);

  const messagePieData = [
    { name: "Sent", value: totalSent },
    { name: "Received", value: totalReceived },
  ];

  const costPieData = [
    { name: "Gupshup Fees", value: totalGupshup },
    { name: "Meta Fees", value: totalMeta },
  ];

  return (
    <div className="p-6 space-y-8">

      {/* Line Chart: Total Messages */}
      <div>
        <h2 className="text-xl font-bold mb-4">Total Messaging Volume</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="usage_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_messages" stroke="#8884d8" name="Total Messages" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart: Gupshup Fees */}
      <div>
        <h2 className="text-xl font-bold mb-4">Gupshup Fees</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="usage_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="gupshup_fees" stroke="#82ca9d" name="Gupshup Fees" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart: Meta Fees */}
      <div>
        <h2 className="text-xl font-bold mb-4">Meta Fees</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="usage_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="meta_fees" stroke="#ffc658" name="Meta Fees" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart: Message Distribution */}
      <div>
        <h2 className="text-xl font-bold">Message Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={messagePieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {messagePieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart: Cost Distribution */}
      <div>
        <h2 className="text-xl font-bold">Cost Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={costPieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {costPieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
