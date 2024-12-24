
import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, Rating, TextField, Fab } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';  

const aiResponses = {
  hello: "Hello there!",
  "how are you?": "I'm doing well, thank you. How about you?",
  "what is your name?": "I'm ChatBot.",
  default: "I'm not sure I understand.",
};

const theme = createTheme({
  palette: {
    mode: 'light', 
  },
});

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [conversations, setConversations] = useState(JSON.parse(localStorage.getItem('conversations')) || []);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [rating, setRating] = useState(0);
  const [subjectiveFeedback, setSubjectiveFeedback] = useState('');
  const [showFeedbackOverview, setShowFeedbackOverview] = useState(false);

  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  const getAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    return aiResponses[lowerMessage] || aiResponses.default;
  };

  const sendMessage = () => {
    if (userInput.trim() === '') return;

    const newMessages = [...messages, { text: userInput, sender: 'user' }];
    setMessages(newMessages);
    setCurrentConversation(prev => ({ ...prev, messages: newMessages }));

    setTimeout(() => {
      const aiResponse = getAIResponse(userInput);
      const updatedMessages = [...newMessages, { text: aiResponse, sender: 'ai' }];
      setMessages(updatedMessages);
      setCurrentConversation(prev => ({ ...prev, messages: updatedMessages }));
    }, 500);

    setUserInput('');
  };

  const startNewConversation = () => {
    const newConversation = { id: Date.now(), messages: [], feedback: null };
    setConversations([...conversations, newConversation]);
    setCurrentConversation(newConversation);
    setMessages([]);
    setRating(0);
    setSubjectiveFeedback('');
    setShowFeedbackOverview(false);
  };

  const loadConversation = (conversation) => {
    setCurrentConversation(conversation);
    setMessages(conversation.messages);
    if (conversation.feedback) {
      setRating(conversation.feedback.rating);
      setSubjectiveFeedback(conversation.feedback.subjectiveFeedback);
    } else {
      setRating(0);
      setSubjectiveFeedback('');
    }
    setShowFeedbackOverview(false);
  };

  const submitFeedback = () => {
    if (!currentConversation) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversation.id) {
        return { ...conv, feedback: { rating, subjectiveFeedback } };
      }
      return conv;
    });
    setConversations(updatedConversations);
    setCurrentConversation(prev => ({ ...prev, feedback: { rating, subjectiveFeedback }}));
    alert("Feedback submitted!");
  };

  const filteredFeedback = conversations.filter(conv => conv.feedback).sort((a, b) => b.feedback?.rating - a.feedback?.rating);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <div className="app-container">
        <aside className="sidebar">
          <h2>Conversations</h2>
          <ul>
            {conversations.map((conversation) => (
              <li key={conversation.id} onClick={() => loadConversation(conversation)}>
                Conversation {new Date(conversation.id).toLocaleString()}
              </li>
            ))}
          </ul>
          <Button variant="contained" onClick={startNewConversation}>New Conversation</Button>
          <Button variant="contained" onClick={() => setShowFeedbackOverview(!showFeedbackOverview)}>Show Feedback Overview</Button>
        </aside>

        <main className="main-content">
          {!showFeedbackOverview && (
            <>
              <div className="chat-area">
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.sender}`}>
                    {message.text}
                    {message.sender === 'ai' && (
                      <div className="feedback-buttons">
                        <Button>Thumbs Up</Button>
                        <Button>Thumbs Down</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="input-area">
                <TextField
                  label="Type your message..."
                  value={userInput}
                  onInput={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  fullWidth
                />
                <Fab color="primary" aria-label="send" onClick={sendMessage}>
                  Send
                </Fab>
              </div>
              {currentConversation && (
                <div className="feedback-section">
                  <h3>Conversation Feedback</h3>
                  <Rating
                    value={rating}
                    max={5}
                    onChange={(e, newValue) => setRating(newValue)}
                  />
                  <TextField
                    label="Subjective Feedback"
                    value={subjectiveFeedback}
                    onInput={(e) => setSubjectiveFeedback(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                  />
                  <Button variant="contained" onClick={submitFeedback}>Submit Feedback</Button>
                </div>
              )}
            </>
          )}

          {showFeedbackOverview && (
            <div className="feedback-overview">
              <h2>Feedback Overview</h2>
              <table>
                <thead>
                  <tr>
                    <th>Conversation</th>
                    <th>Rating</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeedback.map((conv) => (
                    <tr key={conv.id}>
                      <td>{new Date(conv.id).toLocaleString()}</td>
                      <td>{conv.feedback?.rating || "No Rating"}</td>
                      <td>{conv.feedback?.subjectiveFeedback || "No Feedback"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
