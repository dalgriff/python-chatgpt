from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chatgpt import askgpt  # Import the function from your chatgpt.py file
from typing import Optional

app = FastAPI()

# CORS (Cross-Origin Resource Sharing) middleware configuration.
# This setup allows requests from any origin (indicated by "*").
# In a production environment, you should restrict 'allow_origins' to trusted domains.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    # allow_origins=["http://localhost:5137"],  # Example: Allow a specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# Define a Pydantic model for the chat request.
# This model is used to validate and parse incoming JSON data in the POST request.
class ChatRequest(BaseModel):
    question: str  # The user's question
    chat_log: Optional[list] = None  # Optional chat log to maintain conversation context

# Endpoint for handling chat requests.
# Receives a ChatRequest object and returns a response with the AI's answer and updated chat log.
@app.post("/chat/")
async def chat(chat_request: ChatRequest):
    try:
        # Call the askgpt function with the provided question and chat log.
        answer, updated_chat_log = askgpt(chat_request.question, chat_request.chat_log)
        return {"answer": answer, "chat_log": updated_chat_log}
    except Exception as e:
        # If an error occurs, raise an HTTPException with status code 500 (Internal Server Error).
        raise HTTPException(status_code=500, detail=str(e))

# Optional: Root endpoint to provide basic API information.
# Useful for health checks and initial API verification.
@app.get("/")
async def read_root():
    return {"message": "Welcome to the ChatGPT API"}
