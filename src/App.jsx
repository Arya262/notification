import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import ContactList from "./components/ContactList";
import Templates from "./components/Templates";
import Chats from "./components/Chats";
import Broadcast from "./components/Broadcast/Broadcast";
// import Setting from "./components/Setting";
import Help from "./components/Help";
import Setting from "./components/Setting";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {/* Dashboard default */}
        <Route index element={<div>Welcome to Dashboard</div>} />
        
        {/* Child Routes */}
        <Route path="contact" element={<ContactList />} />
        <Route path="templates" element={<Templates />} />
        <Route path="chats" element={<Chats />} />
        <Route path="broadcast" element={<Broadcast />} />
        {/* <Route path="setting" element={<Setting />} /> */}
        <Route path="settings" element={<Setting />} />
        <Route path="help" element={<Help />} />
      </Route>
    </Routes>
  );
}

export default App;
