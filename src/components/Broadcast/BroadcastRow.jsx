import { Pencil, Trash2 } from "lucide-react";

const BroadcastRow = ({ date, name, type, messageType, schedule, status }) => (
  <tr className="border-b border-[#C3C3C3] last:border-0 text-sm text-gray-800">
    <td className="px-4 py-3">
      <input type="checkbox" className="w-4 h-4" />
    </td>
    <td className="px-4 py-3">{date}</td>
    <td className="px-4 py-3">{name}</td>
    <td className="px-4 py-3">{type}</td>
    <td className="px-4 py-3">{messageType}</td>
    <td className="px-4 py-3">{schedule}</td>
    <td className="px-4 py-3 font-semibold text-green-600">{status}</td>
    <td className="px-4 py-3 flex items-center space-x-2">
      <button className="p-1 rounded hover:bg-gray-100">
        <Pencil size={16} className="text-gray-600" />
      </button>
      <button className="p-1 rounded hover:bg-red-100">
        <Trash2 size={16} className="text-red-500" />
      </button>
    </td>
  </tr>
);

export default BroadcastRow;
