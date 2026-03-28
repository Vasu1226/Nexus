import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tilt } from 'react-tilt';
import { Layers, Zap, Shield, Cpu, Code2, Globe } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: <Zap className="w-8 h-8 text-yellow-400" />,
        title: "Lightning Fast",
        description: "Optimized response times with in-memory caching and optimized frontend bundles."
    },
    {
        icon: <Shield className="w-8 h-8 text-green-400" />,
        title: "Bank-grade Security",
        description: "JWT authentication, rate limiting, and secure connection protocols built-in."
    },
    {
        icon: <Cpu className="w-8 h-8 text-primary" />,
        title: "AI Integration",
        description: "Built-in intelligent assistants to automate tasks and provide insights."
    },
    {
        icon: <Layers className="w-8 h-8 text-secondary" />,
        title: "Modern Stack",
        description: "Utilizing React, Vite, Tailwind, and Node.js for maximum developer productivity."
    },
    {
        icon: <Code2 className="w-8 h-8 text-purple-400" />,
        title: "Clean Architecture",
        description: "Modular controller-service patterns ensuring scalable and maintainable codebases."
    },
    {
        icon: <Globe className="w-8 h-8 text-blue-400" />,
        title: "Global Edge",
        description: "Ready to be deployed on Edge networks for minimal latency worldwide."
    }
];

const Features = () => {
    const cardsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            cardsRef.current.forEach((el, index) => {
                gsap.fromTo(el,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        });

        return () => ctx.revert();
    }, []);

    const defaultTiltOptions = {
        reverse: false,  // reverse the tilt direction
        max: 25,         // max tilt rotation (degrees)
        perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
        scale: 1.05,     // 2 = 200%, 1.5 = 150%, etc..
        speed: 1000,     // Speed of the enter/exit transition
        transition: true, // Set a transition on enter/exit.
        axis: null,      // What axis should be disabled. Can be X or Y.
        reset: true,     // If the tilt effect has to be reset on exit.
        easing: "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
    };

    return (
        <PageTransition>
            <div className="min-h-screen pt-24 pb-20 bg-dark-bg relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-blob" />
                    <div className="absolute bottom-[20%] left-[10%] w-[30rem] h-[30rem] bg-secondary/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-primary font-semibold tracking-wide uppercase text-sm mb-3"
                        >
                            Enterprise Capabilities
                        </motion.h2>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-extrabold mb-6"
                        >
                            Everything you need to <span className="text-gradient">build fast</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-400"
                        >
                            Our comprehensive toolset eliminates boilerplate and lets you focus on creating unmatched user experiences.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} ref={el => cardsRef.current[index] = el}>
                                <Tilt options={defaultTiltOptions} className="h-full">
                                    <div className="h-full glass-dark p-8 rounded-3xl border border-white/10 hover:border-primary/50 transition-colors duration-300 relative group overflow-hidden">
                                        {/* Hover gradient background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="relative z-10">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                                {feature.icon}
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                                            <p className="text-gray-400 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </Tilt>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Features;
