import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Table from "./Table";
import ErrorBoundary from "../../components/ErrorBoundary";
import approvedIcon from "../../assets/Approve.png";
import pendingIcon from "../../assets/Pending.png";
import rejectedIcon from "../../assets/Rejected.png";
import { API_ENDPOINTS } from "../../config/api";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_ENDPOINTS.TEMPLATES.GET_ALL}?customer_id=${user?.customer_id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch templates: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        if (Array.isArray(data.templates)) {
          setTemplates(data.templates);
        } else {
          console.error("Invalid response format:", data);
          //setError("Unexpected response format from server.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        //setError("Failed to load templates. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const approvedCount = templates.filter(
    (t) => t.status?.toLowerCase() === "approved"
  ).length;
  const pendingCount = templates.filter(
    (t) => t.status?.toLowerCase() === "pending"
  ).length;
  const failedCount = templates.filter(
    (t) => t.status?.toLowerCase() === "failed"
  ).length;

  const summaryCards = [
    {
      label: "Approved Templates",
      count: approvedCount,
      image: approvedIcon,
      bgColor: "bg-[#D1FADF]",
    },
    {
      label: "Pending Templates",
      count: pendingCount,
      image: pendingIcon,
      bgColor: "bg-[#FEE4E2]",
    },
    {
      label: "Failed Templates",
      count: failedCount,
      image: rejectedIcon,
      bgColor: "bg-[#FECDCA]",
    },
  ];

  const handleEdit = (updatedTemplates) => {
    setTemplates(updatedTemplates);
   
  };

  const handleDelete = (id) => {
    const newTemplates = templates.filter((template) => template.id !== id);
    setTemplates(newTemplates);
    
  };

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="hidden md:flex flex-col md:flex-row justify-start gap-4">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="w-full md:w-[350px] h-[124px] p-5 rounded-xl bg-white flex items-center gap-6 shadow-[0_4px_8px_0_rgba(0,0,0,0.1)]"
          >
            <div
              className={`w-[60px] h-[60px] rounded-full flex items-center justify-center ${card.bgColor}`}
            >
              <img
                src={card.image}
                alt={card.label}
                className="w-[32px] h-[32px] object-contain"
              />
            </div>
            <div className="text-left">
              <p className="text-[18px] text-[#555] font-medium font-poppins">
                {card.label}
              </p>
              <p className="text-[22px] font-bold font-poppins mt-1">
                {card.count}
              </p>
            </div>
          </div>
        ))}
      </div>

      <ErrorBoundary>
        {loading ? (
          <p className="text-center">Loading templates...</p>
        ) : (
          <Table
            templates={templates}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </ErrorBoundary>
    </div>
  );
};

export default Templates;
