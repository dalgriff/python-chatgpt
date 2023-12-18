import React, { useState } from 'react';
import './App.css';

/**
 * Represents a single chat message.
 * @param {object} message - The message object containing 'content' and 'role'.
 * @returns A styled chat message component.
 */
function ChatMessage({ message }) {
  // Ensure that message.content is a string before rendering
  const messageContent = typeof message.content === 'string' ? message.content : '';

  return (
    <div className={`message ${message.role}`}>
      <p>{messageContent}</p>
    </div>
  );
}

/**
 * Renders a list of chat messages.
 * @param {array} messages - An array of message objects to display.
 * @returns A container with all chat messages.
 */
function ChatMessages({ messages }) {
  return (
    <div className="messages">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </div>
  );
}

/**
 * Main application component.
 * Manages the state of the chat, including the current question, chat log, and loading status.
 * @returns The main chat application interface.
 */
function App() {
  const [question, setQuestion] = useState(''); // State for the current question input
  const [chatLog, setChatLog] = useState([]); // State for the chat log history
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  /**
   * Handles the form submission and sends the chat request.
   * @param {object} e - The event object from the form submission.
   */
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
      ) : (
        <ChatMessages messages={chatLog} />
      )}
    </div>
  );
}

export default App;
