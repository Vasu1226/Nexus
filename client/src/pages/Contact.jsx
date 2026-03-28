import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Mail, User, MessageSquare } from 'lucide-react';
import axios from 'axios';
import PageTransition from '../components/PageTransition';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            await axios.post('http://localhost:5000/api/contact', formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });

            // Reset status after a few seconds
            setTimeout(() => setStatus('idle'), 5000);
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    const inputVariants = {
        focus: { scale: 1.02, transition: { duration: 0.2 } },
        blur: { scale: 1, transition: { duration: 0.2 } }
    };

    return (
        <PageTransition>
            <div className="min-h-screen pt-24 pb-20 bg-dark-bg relative overflow-hidden flex items-center justify-center">
                {/* Abstract Backgrounds */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[80px]" />

                <div className="max-w-5xl w-full mx-auto px-4 z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Left Text content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Let's build <br />
                            <span className="text-gradient">something amazing.</span>
                        </h1>
                        <p className="text-gray-400 text-lg mb-8 max-w-md">
                            Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: <Mail className="w-5 h-5" />, text: "hello@nexusai.com" },
                                { icon: <MessageSquare className="w-5 h-5" />, text: "Live chat available 24/7" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-gray-300">
                                    <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-primary">
                                        {item.icon}
                                    </div>
                                    <span className="font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Form Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="glass p-8 md:p-10 rounded-3xl relative overflow-hidden">
                            <h2 className="text-2xl font-bold mb-6 text-white">Send us a message</h2>

                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex flex-col items-center justify-center h-64 text-center"
                                    >
                                        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                                        <p className="text-gray-400">We'll get back to you as soon as possible.</p>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-5 relative z-10"
                                    >
                                        {status === 'error' && (
                                            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200">
                                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                                <p className="text-sm">{errorMsg}</p>
                                            </div>
                                        )}

                                        <motion.div whileFocus="focus" variants={inputVariants} className="relative">
                                            <label className="sr-only">Name</label>
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500 transition-all font-medium"
                                                placeholder="Your Name"
                                            />
                                        </motion.div>

                                        <motion.div whileFocus="focus" variants={inputVariants} className="relative">
                                            <label className="sr-only">Email</label>
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500 transition-all font-medium"
                                                placeholder="Your Email Address"
                                            />
                                        </motion.div>

                                        <motion.div whileFocus="focus" variants={inputVariants}>
                                            <label className="sr-only">Message</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows="4"
                                                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500 transition-all font-medium resize-none"
                                                placeholder="How can we help you?"
                                            ></textarea>
                                        </motion.div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={status === 'submitting'}
                                            type="submit"
                                            className="w-full py-4 bg-gradient-to-r from-primary flex items-center justify-center gap-2 to-secondary text-white rounded-xl font-bold shadow-lg disabled:opacity-70 transition-all"
                                        >
                                            {status === 'submitting' ? (
                                                <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            ) : (
                                                <>Send Message <Send className="w-4 h-4" /></>
                                            )}
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Contact;
