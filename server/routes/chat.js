const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Initialize OpenAI conditionally
let openai = null;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
}

// @route   POST /api/chat
// @desc    Process chatbot message
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { history, message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        if (openai) {
            // Use real OpenAI if available
            const messages = history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            }));

            messages.push({ role: 'user', content: message });

            // Add system prompt first
            messages.unshift({
                role: 'system',
                content: 'You are a helpful AI assistant for a futuristic tech startup. Your tone is professional, concise, and visionary. Format your responses with markdown if helpful.'
            });

            const completion = await openai.chat.completions.create({
                messages: messages,
                model: 'gpt-3.5-turbo', // Or gpt-4
            });

            return res.json({
                text: completion.choices[0].message.content,
                sender: 'ai'
            });
        } else {
            // Mock response if no API key
            setTimeout(() => {
                let responseText = "I'm a simulated AI assistant. To get real responses, please provide an `OPENAI_API_KEY` in the server's `.env` file.";

                // Simple keywords matching for better demo
                const lowerMsg = message.toLowerCase();
                if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
                    responseText = "Hello! I am the AI assistant for this tech startup. How can I help you today?";
                } else if (lowerMsg.includes('pricing')) {
                    responseText = "Our pricing is custom tailored to your needs. Please contact our sales team!";
                } else if (lowerMsg.includes('help')) {
                    responseText = "I can help answer questions about our product, documentation, and pricing. What would you like to know?";
                } else if (lowerMsg.includes('report') || lowerMsg.includes('pdf')) {
                    responseText = "You can download your PDF report from the Dashboard page!";
                } else if (lowerMsg.includes('startup') || lowerMsg.includes('idea')) {
                    responseText = "Here's a futuristic startup idea for you:\n\n**Neuro-Sync Productivity**\nA platform that pairs non-invasive wearable neurotechnology with AI to automatically adapt your work environment (lighting, music, notifications) based on your real-time cognitive load and focus levels.\n\n*Would you like another idea or more details on this one?*";
                } else if (lowerMsg.includes('code') || lowerMsg.includes('markdown')) {
                    responseText = "Here is some example code:\n```javascript\nfunction greet() {\n  console.log('Hello World!');\n}\n```";
                }

                res.json({ text: responseText, sender: 'ai' });
            }, 1500); // Simulate typing delay
        }

    } catch (err) {
        console.error('Chatbot error:', err.message);
        res.status(500).json({ text: "Sorry, I'm having trouble connecting to my brain right now.", sender: 'error' });
    }
});

module.exports = router;
