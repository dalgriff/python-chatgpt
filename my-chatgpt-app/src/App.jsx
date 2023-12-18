import React, { useState } from 'react';
import './App.css';

 function ChatMessage({ message }) {
  // Ensure that message.content is a string before rendering
  const messageContent = typeof message.content === 'string' ? message.content : '';

  return (
    <div className={`message ${message.role}`}>
      <p>{messageContent}</p>
    </div>
  );
}


function ChatMessages({ messages }) {
  return (
    <div className="messages">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </div>
  );
}

function App() {
  const [question, setQuestion] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true to display a spinner
    const res = await fetch('http://127.0.0.1:8000/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, chat_log: chatLog }),
    });
    const data = await res.json();
    setIsLoading(false); // Set loading to false to hide the spinner
    console.log(data);
  
    // Ensure the assistant's response content is a string
    const assistantResponseContent = typeof data.answer === 'string' ? data.answer : JSON.stringify(data.answer);
  
    // Update the chat log with the user's question and the assistant's response
    setChatLog([...chatLog, { role: 'user', content: question }, { role: 'assistant', content: assistantResponseContent }]);
    setQuestion('');
  };
  

  return (
    <div className="App">
      <h1>Chat with GPT-3</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something..."
        />
        <button type="submit">Send</button>
      </form>
      {isLoading ? (
        <div className='spinner'></div>
      ): (
      <ChatMessages messages={chatLog} />
      )}
    </div>
  );
}

export default App;
