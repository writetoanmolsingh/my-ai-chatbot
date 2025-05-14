# AI-Project

## Prerequisites
- Python 3.x
- Node.js
- npm

## Setup Instructions

### Backend

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```

2. Create a virtual environment:
    ```bash
    python -m venv venv
    ```

3. Activate the virtual environment:
    - On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```
    - On Windows:
        ```bash
        venv\Scripts\activate
        ```

4. Create a `.env` file in the backend directory and add your environment variables:
    ```plaintext
    AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
    AZURE_OPENAI_API_KEY=your_azure_openai_api_key
    MONGO_URI=your_mongo_uri
    ```

5. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

6. Start the backend server:
    ```bash
    python app.py
    ```

### Frontend

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Start the frontend server:
    ```bash
    npm start
    ```

## Environment Variables

Ensure you have a `.env` file in the backend directory with the following keys:
```plaintext
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_API_KEY=your_azure_openai_api_key