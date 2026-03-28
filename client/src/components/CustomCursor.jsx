import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (
                e.target.tagName.toLowerCase() === 'button' ||
                e.target.tagName.toLowerCase() === 'a' ||
                e.target.closest('button') ||
                e.target.closest('a') ||
                e.target.classList.contains('interactive')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 rounded-full bg-primary pointer-events-none z-[9999] mix-blend-screen"
                animate={{
                    x: mousePosition.x - 8,
                    y: mousePosition.y - 8,
                    scale: isHovering ? 0.5 : 1,
                }}
                transition={{ type: 'tween', ease: 'backOut', duration: 0.15 }}
            />
            <motion.div
                className="fixed top-0 left-0 w-10 h-10 rounded-full border border-secondary pointer-events-none z-[9998] mix-blend-screen"
                animate={{
                    x: mousePosition.x - 20,
                    y: mousePosition.y - 20,
                    scale: isHovering ? 1.5 : 1,
                    backgroundColor: isHovering ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                }}
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
            />
        </>
    );
};

export default CustomCursor;
