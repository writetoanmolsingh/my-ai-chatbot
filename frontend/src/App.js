import { useState } from "react";
import Chat from "./Chat";

const App = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-[500px] h-[90vh] shadow-2xl">
        <Chat />
      </div>
    </div>
  );
};

export default App;
