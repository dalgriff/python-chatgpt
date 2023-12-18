from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chatgpt import askgpt  # Import the function from your chatgpt.py file
from typing import Optional

app = FastAPI()

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    # allow_origins=["http://localhost:5137"],  # Allows the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str
    chat_log: Optional[list] = None

@app.post("/chat/")
async def chat(chat_request: ChatRequest):
    try:
        answer, updated_chat_log = askgpt(chat_request.question, chat_request.chat_log)
        return {"answer": answer, "chat_log": updated_chat_log}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Optional: Add a root endpoint for basic API info
@app.get("/")
async def read_root():
    return {"message": "Welcome to the ChatGPT API"}
