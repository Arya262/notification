import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const data = [
  {
    id: 1, customer_id: 1, usage_date: "2025-06-15", messages_sent: 300, messages_received: 50,
    total_messages: 350, total_cost: 195, gupshup_fees: 96, meta_fees: 30,
  },
  {
    id: 2, customer_id: 1, usage_date: "2025-06-16", messages_sent: 250, messages_received: 40,
    total_messages: 290, total_cost: 162.5, gupshup_fees: 80, meta_fees: 25,
  },
  {
    id: 3, customer_id: 1, usage_date: "2025-06-17", messages_sent: 100, messages_received: 20,
    total_messages: 120, total_cost: 65, gupshup_fees: 32, meta_fees: 10,
  },
  {
    id: 4, customer_id: 2, usage_date: "2025-06-15", messages_sent: 1000, messages_received: 150,
    total_messages: 1150, total_cost: 650, gupshup_fees: 320, meta_fees: 100,
  },
  {
    id: 5, customer_id: 2, usage_date: "2025-06-16", messages_sent: 500, messages_received: 80,
    total_messages: 580, total_cost: 325, gupshup_fees: 160, meta_fees: 50,
  },
  {
    id: 6, customer_id: 2, usage_date: "2025-06-17", messages_sent: 500, messages_received: 70,
    total_messages: 570, total_cost: 325, gupshup_fees: 160, meta_fees: 50,
  },
];

// Pie chart data
const totalSent = data.reduce((sum, d) => sum + d.messages_sent, 0);
const totalReceived = data.reduce((sum, d) => sum + d.messages_received, 0);
const totalGupshup = data.reduce((sum, d) => sum + d.gupshup_fees, 0);
const totalMeta = data.reduce((sum, d) => sum + d.meta_fees, 0);

const messagePieData = [
  { name: "Sent", value: totalSent },
  { name: "Received", value: totalReceived }
];

const costPieData = [
  { name: "Gupshup Fees", value: totalGupshup },
  { name: "Meta Fees", value: totalMeta }
];

const COLORS = ['#00C49F', '#FF8042'];

export default function MessagingAnalytics() {
  return (
    <div className="p-6 space-y-8">
      
      <div>
        <h2 className="text-xl font-bold mb-4">Total Messaging Volume</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="usage_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_messages" stroke="#8884d8" name="Total Messages" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Gupshup Fees</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="usage_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="gupshup_fees" stroke="#82ca9d" name="Gupshup Fees" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Meta Fees</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="usage_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="meta_fees" stroke="#ffc658" name="Meta Fees" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    

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
  );
}
