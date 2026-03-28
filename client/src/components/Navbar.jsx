import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Rocket, User, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
    const { user, logout } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();
    const location = useLocation();

    // Hide nav on scroll down, show on scroll up
    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Features', path: '/features' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: '-100%' },
            }}
            animate={hidden ? 'hidden' : 'visible'}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed w-full z-50 top-0 glass-dark border-b border-white/10"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Rocket className="w-8 h-8 text-primary" />
                            <span className="font-bold text-xl text-gradient">NexusAI</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium ${location.pathname === link.path ? 'text-primary' : 'text-gray-300'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/dashboard" className="text-secondary hover:text-secondary-light transition-colors px-3 py-2 rounded-md text-sm font-medium">
                                        Dashboard
                                    </Link>
                                    <button onClick={logout} className="text-red-400 hover:text-red-300 flex items-center gap-1">
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/?login=true" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="md:hidden glass-dark bg-dark-card"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user ? (
                            <>
                                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-secondary block px-3 py-2 rounded-md text-base font-medium">
                                    Dashboard
                                </Link>
                                <button onClick={() => { logout(); setIsOpen(false); }} className="text-red-400 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/?login=true" onClick={() => setIsOpen(false)} className="text-primary block px-3 py-2 rounded-md text-base font-medium">
                                Sign In
                            </Link>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
