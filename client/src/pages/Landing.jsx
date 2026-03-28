import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

gsap.registerPlugin(ScrollTrigger);

// 3D Object Component
const FloatingTorus = () => {
    const meshRef = useRef();

    useFrame((state) => {
        meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    });

    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef}>
                <torusGeometry args={[1.5, 0.4, 32, 100]} />
                <meshPhysicalMaterial
                    color="#3B82F6"
                    emissive="#2563EB"
                    emissiveIntensity={0.5}
                    roughness={0.1}
                    metalness={0.8}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    wireframe={true}
                />
            </mesh>
        </Float>
    );
};

const Landing = () => {
    const heroRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax effect on scroll
            gsap.to(textRef.current, {
                y: 150,
                opacity: 0,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                }
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <PageTransition>
            <div className="relative min-h-screen overflow-hidden bg-dark-bg">
                {/* Hero Section Container */}
                <section ref={heroRef} className="relative h-screen flex items-center justify-center pt-16">

                    {/* Three.js Canvas Background */}
                    <div className="absolute inset-0 z-0">
                        <Canvas>
                            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1} color="#3B82F6" />
                            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
                            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                            <FloatingTorus />
                            <Environment preset="city" />
                        </Canvas>
                    </div>

                    {/* Overlay Content */}
                    <div ref={textRef} className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="inline-block px-4 py-1.5 mb-6 glass rounded-full text-secondary text-sm font-medium tracking-wide shadow-lg shadow-secondary/20"
                        >
                            The Next Evolution of Web
                        </motion.div>

                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6"
                        >
                            Build the <span className="text-gradient">Future</span><br />
                            With NexusAI
                        </motion.h1>

                        <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
                        >
                            Experience seamless performance, predictive AI analytics, and a breathtaking 3D glassmorphic interface designed for tomorrow's enterprises.
                        </motion.p>

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link to="/features" className="group relative px-8 py-4 bg-primary text-white rounded-full font-semibold overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all">
                                <div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -translate-x-[150%] group-hover:translate-x-[400%] transition-transform duration-700 ease-in-out"></div>
                                <span className="relative flex items-center gap-2">
                                    Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link to="/contact" className="px-8 py-4 glass-dark rounded-full font-semibold border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center">
                                Contact Sales
                            </Link>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
                    >
                        <span className="text-xs text-gray-400 mb-2 tracking-widest uppercase">Scroll</span>
                        <ChevronDown className="w-5 h-5 text-gray-400 animate-bounce" />
                    </motion.div>

                    {/* Bottom gradient fade */}
                    <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-dark-bg to-transparent pointer-events-none"></div>
                </section>

                {/* Info Section underneath hero to demonstrate parallax/scrolling */}
                <section className="py-32 relative z-10 px-4">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div data-aos="fade-right">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Redefining Digital Experiences</h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                Our platform integrates cutting-edge frontend technologies with robust scalable backends, delivering zero-latency updates and stunning visuals.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Real-time WebSocket Data',
                                    'Framer Motion Micro-interactions',
                                    'In-memory High-speed Caching',
                                    'Interactive 3D Elements'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-secondary" />
                                        </div>
                                        <span className="text-gray-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative h-[400px] glass p-8 rounded-3xl overflow-hidden hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-shadow duration-500">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-pulse-slow"></div>
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/30 rounded-full blur-3xl animate-pulse-slow object-delay-200"></div>
                            <div className="relative z-10 h-full flex flex-col justify-center">
                                <h3 className="text-2xl font-bold mb-4">Command Center</h3>
                                <div className="space-y-4">
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} whileInView={{ width: '80%' }} transition={{ duration: 1 }} className="h-full bg-primary" />
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} whileInView={{ width: '60%' }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-secondary" />
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} whileInView={{ width: '90%' }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-green-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PageTransition>
    );
};

export default Landing;
