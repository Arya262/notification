import React from "react";
import { Handle, Position } from "reactflow";

const TemplateNode = ({ data }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md w-[220px]
        h-[260px] sm:h-[280px] md:h-[300px] lg:h-[320px]
        relative border-2 transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg ${
          data.selected ? "border-teal-500 ring-2 ring-teal-400" : "border-gray-300"
        }`}
    >
      {/* Target (input) handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#0d9488" }}
      />

      {/* Node content */}
      {data.image ? (
        <img
          src={data.image}
          alt={data.label}
          className="w-full object-cover rounded-t
            h-[100px] sm:h-[110px] md:h-[120px] lg:h-[130px]"
          onError={(e) => (e.target.src = "/placeholder.jpg")}
        />
      ) : (
        <div
          className="w-full bg-gray-200 animate-pulse rounded-t
            h-[100px] sm:h-[110px] md:h-[120px] lg:h-[130px]"
        />
      )}

      <div className="p-2 sm:p-3 md:p-4">
        <h3 className="text-md font-semibold">{data.label}</h3>

        {data.category && (
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full my-1">
            {data.category}
          </span>
        )}

        {data.meta && (
          <p className="text-xs text-gray-700 truncate" title={data.meta}>
            {data.meta}
          </p>
        )}
      </div>

      {/* Source (output) handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#0d9488" }}
      />
    </div>
  );
};

export default TemplateNode;
