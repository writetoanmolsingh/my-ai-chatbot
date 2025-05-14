import { useState, useRef, useEffect } from "react";
import axios from "axios";
const Chat = () => {
 const [query, setQuery] = useState("");
 const [chatHistory, setChatHistory] = useState([]);
 const [loading, setLoading] = useState(false);
 const chatContainerRef = useRef(null);
 const handleSendMessage = async () => {
   if (!query.trim()) return;
   const newQuery = { sender: "user", text: query };
   setChatHistory((prev) => [...prev, newQuery]);
   setLoading(true);
   setQuery("");
   try {
     const res = await axios.post("http://127.0.0.1:5000/chat/", { query });
     const botResponse = { sender: "bot", text: res.data.response };
     setChatHistory((prev) => [...prev, botResponse]);
   } catch (error) {
     console.error("Chat error:", error);
     setChatHistory((prev) => [
       ...prev,
       { sender: "bot", text: "❌ Failed to fetch response." },
     ]);
   } finally {
     setLoading(false);
   }
 };
 useEffect(() => {
   chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
 }, [chatHistory]);
 return (
   <div className="flex flex-col h-full bg-blue-50 p-4 rounded-md border border-blue-300 shadow-sm">
     <h2 className="text-md font-semibold text-blue-900 mb-3">
       Chat with PDF chatbot
     </h2>
     <div className="flex-1 overflow-y-auto bg-white p-4 rounded border">
       {chatHistory.map((msg, index) => (
         <div
           key={index}
           className={`mb-3 flex ${
             msg.sender === "user" ? "justify-end" : "justify-start"
           }`}
         >
           <div
             className={`p-3 rounded-lg max-w-[70%] text-sm ${
               msg.sender === "user"
                 ? "bg-blue-600 text-white"
                 : "bg-gray-200 text-gray-800"
             }`}
           >
             {msg.sender === "bot" ? (
               <div dangerouslySetInnerHTML={{ __html: msg.text }} />
             ) : (
               msg.text
             )}
           </div>
         </div>
       ))}
       {loading && (
         <div className="flex justify-start">
           <div className="p-2 bg-gray-200 text-gray-800 rounded-lg text-sm">
             Typing...
           </div>
         </div>
       )}
       <div ref={chatContainerRef}></div>
     </div>
     <div className="flex gap-2 mt-4">
       <input
         type="text"
         value={query}
         onChange={(e) => setQuery(e.target.value)}
         placeholder="Ask a question..."
         className="flex-1 p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
       />
       <button
         onClick={handleSendMessage}
         className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
       >
         Send
       </button>
     </div>
   </div>
 );
};
export default Chat;
