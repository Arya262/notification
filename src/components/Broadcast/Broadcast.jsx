import BroadcastStats from "./BroadcastStats";
import vendor from "../../assets/Vector.png"
import BroadcastDashboard from "./BroadcastDashboard";

const Broadcast = () => {
  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl  font-semibold">Broadcast WhatsApp Campaigns</h2>
          {/* <p className="text-black text-sm mt-2">Launch a campaign today to start engaging new users on WhatsApp for your restaurant</p> */}
        </div>
        <button className="bg-teal-500 hover:bg-teal-600 text-white whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded">
  <img src={vendor} alt="plus sign" className="w-5 h-5" />
  Add Broadcast
</button>

      </div>

      <BroadcastStats />
      <BroadcastDashboard/>
    </div>
  );
};

export default Broadcast;
