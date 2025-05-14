import { useState } from "react";
import axios from "axios";
import { FaUpload, FaFileAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Upload = ({ onUploadSuccess }) => {
 const [selectedFiles, setSelectedFiles] = useState([]);
 const [uploading, setUploading] = useState(false);

 const handleFileChange = (event) => {
   setSelectedFiles(event.target.files);
 };

 const handleUpload = async () => {
   if (!selectedFiles.length) {
     toast.error("Please select at least one file.", { position: "top-center" });
     return;
   }
   setUploading(true);
   const formData = new FormData();
   for (let file of selectedFiles) {
     formData.append("files", file);
   }
   try {
     const response = await axios.post(
       "http://127.0.0.1:5000/upload/",
       formData,
       {
         headers: { "Content-Type": "multipart/form-data" },
       }
     );
     toast.success(`Files uploaded successfully: ${response.data.uploaded_files.join(", ")}`, { position: "top-center" });
     onUploadSuccess && onUploadSuccess(true);
   } catch (error) {
     console.error("Upload error:", error);
     toast.error("Failed to upload files.", { position: "top-center" });
   } finally {
     setUploading(false);
   }
 };

 return (
   <div className="flex flex-col items-center justify-center h-full">
     <div className="bg-blue-50 p-8 rounded-lg border border-blue-300 shadow-lg w-full max-w-2xl">
       <h2 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
         <FaUpload /> Upload File(s)
       </h2>
       <input
         type="file"
         multiple
         onChange={handleFileChange}
         className="mb-4 block w-full p-3 border border-blue-300 rounded"
       />
       <div className="flex gap-6">
         <button
           onClick={handleUpload}
           className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
           disabled={uploading}
         >
           <FaFileAlt /> {uploading ? "Uploading..." : "Upload Files"}
         </button>
       </div>
       <ToastContainer />
     </div>
   </div>
 );
};

export default Upload;
