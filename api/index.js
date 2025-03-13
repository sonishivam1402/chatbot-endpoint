// api/index.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(express.json());

// Get API key from environment variable
const apiKey = "AIzaSyB7LUmSBt01kl-8uCXsGiZQj25on5JF764";
const genAI = new GoogleGenerativeAI(apiKey);

// Initialize the model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/ask', async (req, res) => {
  // Get the question from the request
  const { question } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }
  
  // Profile information from your resume
  const profileInfo = `
    My name is Shivam Soni. I am a Full-Stack Developer with expertise in React, Node.js, and mobile development (React Native). 
    I work at a software company and also mentor teams in mobile and MERN web development. I have a BTech in Computer Science and 
    Engineering (2024) and have experience working on SaaS projects, SQLite, and API integrations.
  `;
  
  // Create the prompt with system instruction and user query
  const prompt = `
    You are a chatbot that answers questions about Shivam Soni based on the provided information.
    
    ${profileInfo}
    
    User: ${question}
  `;
  
  try {
    // Generate response using Gemini model
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Return the response
    return res.json({ answer: text });
  } catch (error) {
    console.error("Error generating response:", error);
    return res.status(500).json({ error: error.message });
  }
});

// For local testing
app.get('/', (req, res) => {
  res.send("Resume Q&A API is running. Send POST requests to /api/ask");
});

// Set the port
const PORT = process.env.PORT || 3000;

// Check if this is being run directly or as a module
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;