import React from 'react';
import { Rocket, Twitter, Github, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-dark-bg border-t border-white/10 pt-10 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <Rocket className="w-6 h-6 text-primary" />
                        <span className="font-bold text-lg text-gradient">NexusAI</span>
                    </div>

                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                            <span className="sr-only">Twitter</span>
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                            <span className="sr-only">GitHub</span>
                            <Github className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                            <span className="sr-only">LinkedIn</span>
                            <Linkedin className="h-5 w-5" />
                        </a>
                    </div>
                </div>
                <div className="mt-8 border-t border-white/5 pt-6 flex justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} NexusAI Inc. All rights reserved.</p>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-gray-300">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-300">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
