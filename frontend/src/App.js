import { useState } from "react";
import Chat from "./Chat";

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-[600px] w-[400px] shadow-2xl">
        <Chat />
      </div>
    </div>
  );
};

export default App;
