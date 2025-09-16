import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Send,
  Bot,
  User,
  Plus,
  MessageCircle,
  AlertTriangle,
  Shield,
  Heart
} from 'lucide-react';

const Chat = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSessionId]);

  // Start new chat session
  const startChatMutation = useMutation(
    () => axios.post('/api/chat/start', { userId: user._id }),
    {
      onSuccess: (response) => {
        setCurrentSessionId(response.data.sessionId);
        queryClient.invalidateQueries(['chatHistory', user._id]);
      },
      onError: (error) => {
        toast.error('Failed to start chat session');
      }
    }
  );

  // Send message mutation
  const sendMessageMutation = useMutation(
    (messageData) => axios.post('/api/chat/message', messageData),
    {
      onSuccess: (response) => {
        setMessage('');
        setIsTyping(false);
        queryClient.invalidateQueries(['chatHistory', currentSessionId]);
        
        // Check for crisis indicators
        if (response.data.riskLevel === 'critical') {
          toast.error('Crisis detected! Please seek immediate help.');
        }
      },
      onError: (error) => {
        setIsTyping(false);
        toast.error('Failed to send message');
      }
    }
  );

  // Get chat history
  const { data: chatHistory, isLoading } = useQuery(
    ['chatHistory', currentSessionId],
    () => axios.get(`/api/chat/history/${currentSessionId}`),
    {
      enabled: !!currentSessionId,
      refetchInterval: 2000, // Poll for new messages
    }
  );

  // Get user's chat sessions
  const { data: userSessions } = useQuery(
    ['userSessions', user._id],
    () => axios.get(`/api/chat/sessions/${user._id}`),
    {
      enabled: !!user._id,
    }
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentSessionId) return;

    const messageData = {
      sessionId: currentSessionId,
      message: message.trim(),
      userId: user._id
    };

    setIsTyping(true);
    sendMessageMutation.mutate(messageData);
  };

  const handleStartNewChat = () => {
    startChatMutation.mutate();
  };

  const handleSessionSelect = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskLevelIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {t('aiAssistant')}
              </h1>
              <p className="text-sm text-gray-500">
                Your AI mental health companion
              </p>
            </div>
          </div>
          <button
            onClick={handleStartNewChat}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Chat History */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-900">Chat History</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {userSessions?.data?.map((session) => (
              <button
                key={session._id}
                onClick={() => handleSessionSelect(session.sessionId)}
                className={`w-full text-left p-3 border-b border-gray-200 hover:bg-gray-100 ${
                  currentSessionId === session.sessionId ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      Chat {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {session.riskLevel && session.riskLevel !== 'low' && (
                    <div className={`flex items-center space-x-1 ${getRiskLevelColor(session.riskLevel)}`}>
                      {getRiskLevelIcon(session.riskLevel)}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {session.messages?.length || 0} messages
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {!currentSessionId ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Start a conversation
                </h3>
                <p className="text-gray-500 mb-6">
                  I'm here to listen and provide support. Click "New Chat" to begin.
                </p>
                <button
                  onClick={handleStartNewChat}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start New Chat
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  chatHistory?.data?.messages?.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {msg.sender === 'ai' && (
                            <Bot className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                          )}
                          {msg.sender === 'user' && (
                            <User className="h-4 w-4 text-white mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{msg.content}</p>
                            {msg.metadata?.suggestedActions && (
                              <div className="mt-2 space-y-1">
                                {msg.metadata.suggestedActions.map((action, actionIndex) => (
                                  <button
                                    key={actionIndex}
                                    className="block w-full text-left text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100"
                                  >
                                    {action.replace(/_/g, ' ')}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-blue-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Crisis Warning */}
              {chatHistory?.data?.riskLevel === 'critical' && (
                <div className="bg-red-50 border-t border-red-200 p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">
                        Crisis Support Available
                      </h4>
                      <p className="text-sm text-red-700">
                        If you're having thoughts of self-harm, please contact emergency services immediately.
                      </p>
                      <div className="mt-2 flex space-x-4">
                        <a
                          href="tel:988"
                          className="text-sm font-medium text-red-600 hover:text-red-500"
                        >
                          Call 988 (Crisis Line)
                        </a>
                        <a
                          href="tel:911"
                          className="text-sm font-medium text-red-600 hover:text-red-500"
                        >
                          Call 911 (Emergency)
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('typeMessage')}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={sendMessageMutation.isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || sendMessageMutation.isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border-t border-blue-200 p-3">
        <div className="flex items-center space-x-2 text-sm text-blue-700">
          <Shield className="h-4 w-4" />
          <span>
            Your conversations are confidential and encrypted. We prioritize your privacy and safety.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chat;



