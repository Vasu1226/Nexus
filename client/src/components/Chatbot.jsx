import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Mic, MicOff, Loader } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your AI assistant. How can I help you today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);

    // Speech Recognition setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    useEffect(() => {
        if (recognition) {
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev + ' ' + transcript);
                setIsListening(false);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };
        }
    }, [recognition]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const toggleListen = () => {
        if (isListening) {
            recognition?.stop();
            setIsListening(false);
        } else {
            recognition?.start();
            setIsListening(true);
        }
    };

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await axios.post('http://localhost:5000/api/chat', {
                history: messages,
                message: userMessage.text
            });

            setMessages(prev => [...prev, response.data]);
        } catch (error) {
            setMessages(prev => [...prev, { text: 'Sorry, I encountered an error communicating with the server.', sender: 'error' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="fixed bottom-24 right-6 w-80 sm:w-96 h-[30rem] glass-dark rounded-2xl flex flex-col z-50 overflow-hidden shadow-2xl border border-white/20"
                    >
                        {/* Header */}
                        <div className="bg-primary/20 backdrop-blur-md p-4 flex justify-between items-center border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">NexusAI Assistant</h3>
                                    <p className="text-xs text-green-400 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span> Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scr">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user'
                                                ? 'bg-primary text-white rounded-br-none'
                                                : msg.sender === 'error'
                                                    ? 'bg-red-500/20 text-red-200 border border-red-500/50 rounded-bl-none'
                                                    : 'bg-white/10 text-gray-100 rounded-bl-none prose prose-invert prose-sm'
                                            }`}
                                    >
                                        {msg.sender === 'ai' ? (
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 rounded-2xl rounded-bl-none p-4 flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-black/20">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={toggleListen}
                                    disabled={!recognition}
                                    className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                        }`}
                                    title={!recognition ? "Speech Recognition not supported in this browser" : "Voice to Text"}
                                >
                                    {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                                </button>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[40px]"
                                >
                                    {isTyping ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg shadow-primary/50 z-50 overflow-hidden"
            >
                <span className="absolute inset-0 bg-white/20 hover:bg-transparent transition-colors"></span>
                {isOpen ? (
                    <X className="w-6 h-6 text-white relative z-10" />
                ) : (
                    <MessageSquare className="w-6 h-6 text-white relative z-10" />
                )}
            </motion.button>
        </>
    );
};

export default Chatbot;
