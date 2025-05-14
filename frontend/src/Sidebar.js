import React from "react";
import { FaUpload, FaComments, FaHistory, FaCog } from "react-icons/fa";
import Navbar from "./Navbar";

const Sidebar = ({ setActiveComponent }) => {
 return (
   <div className="w-60 bg-blue-900 text-white flex flex-col p-4">
     <nav className="space-y-6">
       <Navbar />
       <button
         className="flex items-center gap-3 hover:bg-blue-800 p-2 rounded"
         onClick={() => setActiveComponent("upload")}
       >
         <FaUpload /> Upload
       </button>
       <button
         className="flex items-center gap-3 hover:bg-blue-800 p-2 rounded"
         onClick={() => setActiveComponent("chat")}
       >
         <FaComments /> Chat
       </button>
     </nav>
   </div>
 );
};

export default Sidebar;
