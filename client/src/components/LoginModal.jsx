import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Lock, Mail, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

const LoginModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ email: 'admin@techstartup.com', password: 'password123' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAppContext();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('login') === 'true') {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [location]);

    const closeModal = () => {
        setIsOpen(false);
        navigate(location.pathname, { replace: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            login(res.data.token);
            closeModal();
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-md glass-dark rounded-3xl p-8 relative z-10 border border-white/20 shadow-2xl overflow-hidden"
                    >
                        {/* Decorative blurs */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/40 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/40 rounded-full blur-3xl"></div>

                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-20"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative z-10">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                                <p className="text-gray-400 text-sm">Enter your credentials to access the dashboard</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full py-3.5 mt-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors focus:ring-2 ring-offset-2 ring-offset-dark-bg ring-primary disabled:opacity-70 group"
                                >
                                    {loading ? 'Authenticating...' : (
                                        <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;
