const express = require('express');
const ChatSession = require('../models/ChatSession');
const User = require('../models/User');
const router = express.Router();

// AI Response generation (simplified version - in production, integrate with OpenAI API)
const generateAIResponse = (userMessage, userContext) => {
  const responses = {
    greeting: [
      "Hello! I'm here to help you with your mental health concerns. How are you feeling today?",
      "Hi there! I'm your AI mental health assistant. What's on your mind?",
      "Welcome! I'm here to listen and provide support. What would you like to talk about?"
    ],
    anxiety: [
      "I understand you're feeling anxious. Let's try some breathing exercises together. Take a deep breath in for 4 counts, hold for 4, and exhale for 6 counts.",
      "Anxiety can be overwhelming. Remember, it's okay to feel this way. Would you like to try some grounding techniques?",
      "Let's focus on what you can control right now. Can you name 3 things you can see, hear, or feel in this moment?"
    ],
    depression: [
      "I hear that you're struggling. Depression can make everything feel heavy. You're not alone in this.",
      "It takes courage to reach out. Even small steps matter. What's one thing that brought you a little joy recently?",
      "Depression can be isolating. Remember that seeking help is a sign of strength, not weakness."
    ],
    stress: [
      "Stress is a natural response, but it can be managed. Let's break down what's causing you stress right now.",
      "When we're stressed, our thoughts can spiral. Let's focus on one thing at a time. What's the most pressing concern?",
      "Stress management is a skill that can be learned. Would you like to try some relaxation techniques?"
    ],
    crisis: [
      "I'm concerned about your safety. Please reach out to a trusted person or professional immediately.",
      "If you're having thoughts of self-harm, please contact your local emergency services or a crisis hotline.",
      "Your safety is the most important thing right now. Please seek immediate professional help."
    ]
  };

  // Simple keyword-based response selection
  const message = userMessage.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  }
  
  if (message.includes('anxious') || message.includes('anxiety') || message.includes('worried')) {
    return responses.anxiety[Math.floor(Math.random() * responses.anxiety.length)];
  }
  
  if (message.includes('depressed') || message.includes('sad') || message.includes('hopeless')) {
    return responses.depression[Math.floor(Math.random() * responses.depression.length)];
  }
  
  if (message.includes('stressed') || message.includes('overwhelmed') || message.includes('pressure')) {
    return responses.stress[Math.floor(Math.random() * responses.stress.length)];
  }
  
  if (message.includes('hurt') || message.includes('suicide') || message.includes('end it')) {
    return responses.crisis[Math.floor(Math.random() * responses.crisis.length)];
  }
  
  return "I'm here to listen and support you. Can you tell me more about what you're experiencing?";
};

// Start new chat session
router.post('/start', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const chatSession = new ChatSession({
      userId,
      sessionId,
      messages: [],
      status: 'active'
    });
    
    await chatSession.save();
    
    res.json({
      message: 'Chat session started',
      sessionId,
      chatSession
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start chat session', error: error.message });
  }
});

// Send message in chat
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message, userId } = req.body;
    
    const chatSession = await ChatSession.findOne({ sessionId });
    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    
    // Add user message
    const userMessage = {
      sender: 'user',
      content: message,
      timestamp: new Date(),
      messageType: 'text'
    };
    
    chatSession.messages.push(userMessage);
    
    // Generate AI response
    const aiResponse = generateAIResponse(message, { userId });
    
    const aiMessage = {
      sender: 'ai',
      content: aiResponse,
      timestamp: new Date(),
      messageType: 'text',
      metadata: {
        confidence: 0.8,
        suggestedActions: ['breathing_exercise', 'grounding_technique', 'schedule_appointment']
      }
    };
    
    chatSession.messages.push(aiMessage);
    
    // Check for crisis keywords and update risk level
    const crisisKeywords = ['suicide', 'hurt myself', 'end it all', 'not worth living'];
    const hasCrisisKeywords = crisisKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
    
    if (hasCrisisKeywords) {
      chatSession.riskLevel = 'critical';
      chatSession.status = 'escalated';
    }
    
    await chatSession.save();
    
    res.json({
      message: 'Message sent successfully',
      userMessage,
      aiMessage,
      riskLevel: chatSession.riskLevel,
      status: chatSession.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
});

// Get chat history
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const chatSession = await ChatSession.findOne({ sessionId });
    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    
    res.json(chatSession);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chat history', error: error.message });
  }
});

// Get user's chat sessions
router.get('/sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const sessions = await ChatSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chat sessions', error: error.message });
  }
});

// Escalate chat to counselor
router.post('/escalate', async (req, res) => {
  try {
    const { sessionId, counselorId, reason } = req.body;
    
    const chatSession = await ChatSession.findOne({ sessionId });
    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    
    chatSession.status = 'escalated';
    chatSession.escalatedTo = counselorId;
    chatSession.riskLevel = 'high';
    
    await chatSession.save();
    
    res.json({
      message: 'Chat escalated to counselor successfully',
      chatSession
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to escalate chat', error: error.message });
  }
});

// Resolve chat session
router.post('/resolve', async (req, res) => {
  try {
    const { sessionId, resolution } = req.body;
    
    const chatSession = await ChatSession.findOne({ sessionId });
    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    
    chatSession.status = 'resolved';
    chatSession.resolvedAt = new Date();
    
    await chatSession.save();
    
    res.json({
      message: 'Chat session resolved successfully',
      chatSession
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to resolve chat session', error: error.message });
  }
});

module.exports = router;



