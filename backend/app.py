import os
import logging
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import openai
import fitz  # PyMuPDF
from pymongo import MongoClient
import markdown
load_dotenv()
# OpenAI Azure config
openai.api_type = "azure"
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
openai.api_version = "2024-12-01-preview"
openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")
app = Flask(__name__)
CORS(app, origins=["https://my-ai-chatbot-mauve.vercel.app"])
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
uploaded_texts = []
def extract_text_from_pdf(pdf_path):
   """Extract text from a PDF."""
   try:
       text = ""
       doc = fitz.open(pdf_path)
       for page in doc:
           text += page.get_text("text") + "\n"
       return text.strip()
   except Exception as e:
       raise Exception(f"Failed to extract text from PDF: {str(e)}")
def format_response(raw_response):
   """Clean and convert markdown to HTML."""
   cleaned = raw_response.strip().replace("\n\n", "\n")
   return markdown.markdown(cleaned)
@app.route("/upload/", methods=["POST"])
def upload_files():
   global uploaded_texts
   uploaded_texts.clear()
   files = request.files.getlist("files")
   if not files:
       return jsonify({"error": "No files provided"}), 400
   try:
       for file in files:
           file_location = os.path.join(UPLOAD_DIR, file.filename)
           file.save(file_location)
           if file.filename.endswith(".pdf"):
               uploaded_texts.append(extract_text_from_pdf(file_location))
           else:
               with open(file_location, "r", encoding="utf-8") as f:
                   uploaded_texts.append(f.read())
       return jsonify({"message": "Files uploaded successfully", "uploaded_files": [file.filename for file in files]})
   except Exception as e:
       return jsonify({"error": str(e)}), 500
@app.route("/chat/", methods=["POST"])
def chat():
   global uploaded_texts
   user_query = request.get_json()
   if not user_query or "query" not in user_query:
       return jsonify({"error": "Missing query in request"}), 400
   if not uploaded_texts:
       return jsonify({"error": "No documents uploaded or fetched. Please upload or fetch data first."}), 400
   try:
       if uploaded_texts:
           combined_text = "\n\n".join(uploaded_texts)
           messages = [
               {"role": "system", "content": "You are an AI assistant that provides answers based on the provided documents. Use Markdown formatting — include headers, bullet points, and code blocks where helpful."},
               {"role": "system", "content": f"Here are the uploaded documents:\n\n{combined_text}"},
               {"role": "user", "content": user_query["query"]},
           ]
       response = openai.chat.completions.create(
           model="gpt-4o",
           messages=messages,
           temperature=0.5
       )
       raw_reply = response.choices[0].message.content
       formatted_reply = format_response(raw_reply)
       return jsonify({"response": formatted_reply})
   except Exception as e:
       logging.error(f"Chat API error: {str(e)}")
       return jsonify({"error": f"Chat API error: {str(e)}"}), 500