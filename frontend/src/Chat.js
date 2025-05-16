import { useState, useRef, useEffect } from "react";
import axios from "axios";
import './ChatComponent.css';

const Chat = () => {
 const [query, setQuery] = useState("");
 const [chatHistory, setChatHistory] = useState([]);
 const [loading, setLoading] = useState(false);
 const chatContainerRef = useRef(null);
 const fileInputRef = useRef(null);
 
 // Enhanced file upload states
 const [selectedFiles, setSelectedFiles] = useState([]);
 const [uploading, setUploading] = useState(false);
 const [uploadedFiles, setUploadedFiles] = useState([]);
 const [hasUploadedFile, setHasUploadedFile] = useState(false);
 const [uploadAttempted, setUploadAttempted] = useState(false);
 
 const handleSendMessage = async () => {
   if (!query.trim() || !hasUploadedFile) return;
   const newQuery = { 
     sender: "user", 
     text: query, 
     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
     status: 'delivered' 
   };
   setChatHistory((prev) => [...prev, newQuery]);
   setLoading(true);
   setQuery("");
   try {
     const res = await axios.post("https://my-ai-chatbot-4vcx.onrender.com/chat/", { query });
     const botResponse = { 
       sender: "bot", 
       text: res.data.response, 
       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
     };
     setChatHistory((prev) => [...prev, botResponse]);
   } catch (error) {
     console.error("Chat error:", error);
     const errorText = `<span class="error-icon">❌</span> Failed to fetch response.`;
     setChatHistory((prev) => [
       ...prev,
       {
         sender: "bot",
         text: errorText,
         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
         isError: true
       },
     ]);
   } finally {
     setLoading(false);
   }
 };

 // Handle file selection
 const handleFileChange = (event) => {
   const files = Array.from(event.target.files);
   console.log("Selected files:", files);
   setSelectedFiles(files);
 };

 // Handle file upload for multiple files
 const handleFilesUpload = async () => {
   if (selectedFiles.length === 0) return;
   
   setUploading(true);
   
   try {
     // Create a single FormData object for all files
     const formData = new FormData();
     
     // Add all files with the field name "files" (plural)
     for (let i = 0; i < selectedFiles.length; i++) {
       formData.append("files", selectedFiles[i]);
     }
     
     console.log("Uploading files:", selectedFiles.map(f => f.name));
     
     // Make a single request with all files
     const response = await axios.post(
       "https://my-ai-chatbot-4vcx.onrender.com/upload/", 
       formData, 
       {
         headers: {
           "Content-Type": "multipart/form-data",
         },
       }
     );
     
     console.log("Upload response:", response.data);
     
     // Store uploaded files in state (but don't display them)
     setUploadedFiles(prev => [...prev, ...selectedFiles.map(f => f.name)]);
     
     setHasUploadedFile(true);
     setUploadAttempted(true);
     
     // Add a more descriptive system message about successful upload
     const fileNames = selectedFiles.map(f => f.name).join(", ");
     setChatHistory((prev) => [
       ...prev,
       {
         sender: "bot",
         text: `<strong>Files uploaded successfully:</strong> ${fileNames}<br><br>You can now ask questions about the content.`,
         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
       },
     ]);
     
     // Clear selected files after upload
     setSelectedFiles([]);
     
   } catch (error) {
     console.error("Upload error details:", error.response?.data || error.message);
     console.error("Full error object:", error);
     
     // Mark upload as attempted even if it failed
     setUploadAttempted(true);
     
     // Add error message to chat with more details
     const errorMessage = error.response?.data?.error || "Failed to upload PDF";
     const errorText = `<span class="error-icon">❌</span> ${errorMessage}. Please try again.`;
     setChatHistory((prev) => [
       ...prev,
       {
         sender: "bot",
         text: errorText,
         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
         isError: true
       },
     ]);
   } finally {
     setUploading(false);
   }
 };

 // Trigger file input click
 const handleUploadClick = () => {
   fileInputRef.current.click();
 };

 useEffect(() => {
   if (chatContainerRef.current) {
     chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
   }
 }, [chatHistory, loading]);

 const handleKeyDown = (e) => {
   if (e.key === "Enter" && !e.shiftKey) {
     e.preventDefault();
     handleSendMessage();
   }
 };

 // Update the message rendering part to properly format HTML responses
 const renderMessageContent = (msg) => {
   if (msg.isError) {
     return <div dangerouslySetInnerHTML={{ __html: msg.text }} />;
   }
   
   // Check if the message contains HTML tags
   const containsHTML = /<[a-z][\s\S]*>/i.test(msg.text);
   
   if (containsHTML) {
     return (
       <div 
         className="formatted-message"
         dangerouslySetInnerHTML={{ __html: msg.text }} 
       />
     );
   }
   
   // For plain text messages, render normally
   return msg.text;
 };

 return (
   <div className="app-container">
     <main className="main-content-area">
       <div className="chat-panel-container">
         <div className="chat-panel-title-wrapper">
           <h2 className="chat-panel-title">My AI Chatbot</h2>
         </div>
         
         {/* Show upload area only when no upload has been attempted */}
         {!uploadAttempted && (
           <div className="upload-area">
             <div className="upload-area-content">
               <div className="upload-instructions">
                 <div className="upload-icon">📄</div>
                 <p>Select one or more PDF files to upload</p>
               </div>
               
               <div className="upload-actions">
                 <button 
                   className="select-files-button" 
                   onClick={handleUploadClick}
                 >
                   Select Files
                 </button>
                 <input
                   type="file"
                   ref={fileInputRef}
                   onChange={handleFileChange}
                   accept=".pdf"
                   multiple
                   style={{ display: 'none' }}
                 />
               </div>
               
               {/* Selected files list */}
               {selectedFiles.length > 0 && (
                 <div className="selected-files">
                   <div className="selected-files-header">
                     Selected Files ({selectedFiles.length}):
                   </div>
                   <ul className="selected-files-list">
                     {selectedFiles.map((file, index) => (
                       <li key={index} className="selected-file-item">
                         <span className="file-icon">📄</span>
                         <span className="file-name">{file.name}</span>
                       </li>
                     ))}
                   </ul>
                   <button 
                     className="upload-selected-button"
                     onClick={handleFilesUpload}
                     disabled={uploading}
                   >
                     {uploading ? "Uploading..." : `Upload ${selectedFiles.length} ${selectedFiles.length === 1 ? 'File' : 'Files'}`}
                   </button>
                 </div>
               )}
             </div>
           </div>
         )}
         
         <div className="chat-messages-area" ref={chatContainerRef}>
           {chatHistory.length === 0 && uploadAttempted ? (
             <div className="empty-state-message">
               <div className="empty-state-icon">💬</div>
               <p>{hasUploadedFile ? "Ask a question about your uploaded PDF" : "Please try uploading a PDF file again"}</p>
             </div>
           ) : (
             chatHistory.map((msg, index) => (
               <div
                 key={index}
                 className={`message-container ${
                   msg.sender === "user" ? "message-container-user" : "message-container-system"
                 }`}
               >
                 <div className="message-content-wrapper">
                   {msg.sender === "bot" && (
                     <div className="avatar-system">🤖</div>
                   )}
                   <div className="message-bubble-wrapper">
                     <div
                       className={
                         msg.sender === "user" 
                           ? "message-bubble-user" 
                           : `message-bubble-system ${msg.isError ? 'error-message' : ''}`
                       }
                     >
                       {renderMessageContent(msg)}
                     </div>
                     {msg.sender === "user" ? (
                       <div className="message-meta-user">
                         <span className="timestamp">{msg.time}</span>
                         {msg.status && (
                           <span className={`check ${msg.status}`}></span>
                         )}
                       </div>
                     ) : (
                       <div className="message-meta-system">
                         <span className="timestamp">{msg.time}</span>
                       </div>
                     )}
                   </div>
                   {msg.sender === "user" && (
                     <div className="avatar-user">👤</div>
                   )}
                 </div>
               </div>
             ))
           )}
           {loading && (
             <div className="typing-indicator-container">
               <div className="avatar-system">🤖</div>
               <div className="typing-indicator">Typing</div>
             </div>
           )}
         </div>
         <div className="chat-input-footer">
           <input
             type="text"
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder={hasUploadedFile ? "Ask a question..." : "Upload a PDF to start chatting"}
             disabled={!hasUploadedFile}
           />
           <button
             onClick={handleSendMessage}
             disabled={!hasUploadedFile}
             className={!hasUploadedFile ? "button-disabled" : ""}
           >
             Send
           </button>
         </div>
       </div>
     </main>
   </div>
 );
};

export default Chat;
