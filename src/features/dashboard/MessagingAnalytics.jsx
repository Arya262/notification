import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  parseISO, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek
} from "date-fns";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";

// Utility: Get date range for filter
function getDateRange(filter, options) {
  switch (filter) {
    case "Monthly":
      const [year, month] = options.month.split("-").map(Number);
      return [new Date(year, month - 1, 1), endOfMonth(new Date(year, month - 1, 1))];
    case "Weekly":
      return [startOfWeek(new Date(options.week), { weekStartsOn: 1 }), endOfWeek(new Date(options.week), { weekStartsOn: 1 })];
    case "Yearly":
      return [new Date(`${options.year}-01-01`), new Date(`${options.year}-12-31`)];
    case "Custom":
      return [parseISO(options.start), parseISO(options.end)];
    default:
      return [null, null];
  }
}

const MESSAGE_COLORS = ['#00C49F', '#FFBB28'];
const COST_COLORS = ['#8884d8', '#82ca9d'];
const FILTER_OPTIONS = ["Weekly", "Monthly", "Yearly", "Custom"];

export default function MessagingAnalytics({ usageHistory }) {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("Monthly");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedWeekStart, setSelectedWeekStart] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // ✅ Define today's date & month for max attributes
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0]; 
  const todayMonth = todayDate.slice(0, 7); 

  useEffect(() => {
    if (usageHistory && usageHistory.length > 0) {
      const formatted = usageHistory.map(item => ({
        customer_id: item.customer_id,
        usage_date: new Date(item.usage_date).toISOString().split("T")[0],
        messages_sent: parseInt(item.messages_sent || 0),
        messages_received: parseInt(item.messages_received || 0),
        gupshup_fees: parseFloat(item.gupshup_fees || 0),
        meta_fees: parseFloat(item.meta_fees || 0),
        total_cost: parseFloat(item.total_cost || 0),
      }));
      setData(formatted);
    } else {
      setData([]);
    }
    setLoading(false);
  }, [usageHistory]);

  // Set dynamic defaults after data is loaded
  useEffect(() => {
    if (data.length > 0) {
      const latest = data[data.length - 1];
      const usageDate = latest.usage_date;
      const dateObj = new Date(usageDate);

      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getDate()).padStart(2, "0");

      setSelectedMonth(`${yyyy}-${mm}`);
      setSelectedWeekStart(`${yyyy}-${mm}-${dd}`);
      setSelectedYear(`${yyyy}`);
      setCustomStart(`${yyyy}-${mm}-01`);
      setCustomEnd(`${yyyy}-${mm}-${dd}`);
    }
  }, [data]);

  const YEAR_OPTIONS = useMemo(() => {
    const years = data.map(d => new Date(d.usage_date).getFullYear());
    return Array.from(new Set(years)).sort((a, b) => b - a).map(String);
  }, [data]);

  const filteredData = useMemo(() => {
    const [start, end] = getDateRange(filter, {
      month: selectedMonth,
      week: selectedWeekStart,
      year: selectedYear,
      start: customStart,
      end: customEnd
    });

    if (start && end && start > end) return [];

    return data
      .filter(item => {
        const date = parseISO(item.usage_date);
        return (!isNaN(date) && (!start || !end || (date >= start && date <= end)));
      })
      .map(d => ({
        ...d,
        total_messages: d.messages_sent + d.messages_received
      }))
      .sort((a, b) => new Date(a.usage_date) - new Date(b.usage_date));
  }, [data, filter, selectedMonth, selectedWeekStart, selectedYear, customStart, customEnd]);

  const totalSent = filteredData.reduce((sum, d) => sum + d.messages_sent, 0);
  const totalReceived = filteredData.reduce((sum, d) => sum + d.messages_received, 0);
  const totalGupshup = filteredData.reduce((sum, d) => sum + d.gupshup_fees, 0);
  const totalMeta = filteredData.reduce((sum, d) => sum + d.meta_fees, 0);

  const messagePieData = useMemo(() => [
    { name: "Sent", value: totalSent },
    { name: "Received", value: totalReceived }
  ], [totalSent, totalReceived]);

  const costPieData = useMemo(() => [
    { name: "Gupshup Fees", value: totalGupshup },
    { name: "Meta Fees", value: totalMeta }
  ], [totalGupshup, totalMeta]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <span className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-blue-500"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      {/* ✅ Filter Controls */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {filter === "Yearly" && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            {YEAR_OPTIONS.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        )}

        {filter === "Monthly" && (
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            max={todayMonth} // ✅ prevent future months
            className="border px-3 py-2 rounded"
          />
        )}

        {filter === "Weekly" && (
          <input
            type="date"
            value={selectedWeekStart}
            onChange={(e) => setSelectedWeekStart(e.target.value)}
            max={todayDate} // ✅ prevent future dates
            className="border px-3 py-2 rounded"
          />
        )}

        {filter === "Custom" && (
          <>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              max={todayDate} // ✅ prevent future start date
              className="border px-3 py-2 rounded"
            />
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              max={todayDate} // ✅ prevent future end date
              className="border px-3 py-2 rounded"
            />
          </>
        )}
      </div>

      {filteredData.length === 0 ? (
        <p className="text-center text-gray-500">No data available for the selected filter.</p>
      ) : (
        <>
          <ChartBlock title="Total Messaging Volume" dataKey="total_messages" stroke="#8884d8" data={filteredData} />
          <ChartBlock title="Gupshup Fees" dataKey="gupshup_fees" stroke="#82ca9d" data={filteredData} />
          <ChartBlock title="Meta Fees" dataKey="meta_fees" stroke="#ffc658" data={filteredData} />

          <div>
            <h2 className="text-xl font-semibold mb-4">Message Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={messagePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {messagePieData.map((_, index) => (
                    <Cell key={index} fill={MESSAGE_COLORS[index % MESSAGE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} messages`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Cost Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={costPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {costPieData.map((_, index) => (
                    <Cell key={index} fill={COST_COLORS[index % COST_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

function ChartBlock({ title, dataKey, stroke, data }) {
  const isCurrency = dataKey.includes("fees");

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="usage_date" />
          <YAxis tickFormatter={(val) => isCurrency ? `₹${val}` : val} />
          <Tooltip formatter={(value) => typeof value === 'number' ? (isCurrency ? `₹${value}` : value) : value} />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke={stroke} name={title} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
