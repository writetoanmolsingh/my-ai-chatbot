import { useState } from "react";
import Upload from "./Upload";
import Chat from "./Chat";
import Sidebar from "./Sidebar";

const App = () => {
 const [activeComponent, setActiveComponent] = useState("upload");

 const renderComponent = () => {
   switch (activeComponent) {
     case "upload":
       return <Upload onUploadSuccess={() => setActiveComponent("chat")} />;
     case "chat":
       return <Chat />;
     default:
       return <Upload onUploadSuccess={() => setActiveComponent("chat")} />;
   }
 };

 return (
   <div className="flex min-h-screen bg-gray-100">
     <Sidebar setActiveComponent={setActiveComponent} />
     <main className="flex-1 p-6 overflow-y-auto">
       {renderComponent()}
     </main>
   </div>
 );
};

export default App;
