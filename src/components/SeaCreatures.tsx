'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

export function BabyOctopus({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      animate={{
        y: [0, -15, 0],
        rotate: [-5, 5, -5],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-24 md:h-24">
        <ellipse cx="50" cy="35" rx="30" ry="25" fill="#FF9ECD" />
        <circle cx="40" cy="30" r="8" fill="white" />
        <circle cx="60" cy="30" r="8" fill="white" />
        <circle cx="42" cy="32" r="4" fill="#333" />
        <circle cx="62" cy="32" r="4" fill="#333" />
        <ellipse cx="50" cy="42" rx="4" ry="2" fill="#FF6B9D" />
        {[...Array(6)].map((_, i) => (
          <motion.path
            key={i}
            d={`M${30 + i * 8},55 Q${25 + i * 8},75 ${30 + i * 8},90`}
            fill="none"
            stroke="#FF9ECD"
            strokeWidth="6"
            strokeLinecap="round"
            animate={{ d: [
              `M${30 + i * 8},55 Q${25 + i * 8},75 ${30 + i * 8},90`,
              `M${30 + i * 8},55 Q${35 + i * 8},75 ${30 + i * 8},90`,
              `M${30 + i * 8},55 Q${25 + i * 8},75 ${30 + i * 8},90`,
            ]}}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

export function BabyTurtle({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      animate={{
        x: [0, 20, 0],
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      <img 
        src="/baby-turtle.svg" 
        alt="Baby Turtle" 
        className='w-36 h-48 md:w-32 md:h-48' 
      />
    </motion.div>
  );
}

export function BabyJellyfish({ className = '', delay = 0, size = 'default' }: { className?: string; delay?: number; size?: 'default' | 'large' }) {
  const sizeClasses = size === 'large' 
    ? 'w-30 h-40 md:w-32 md:h-48' 
    : 'w-12 h-18 md:w-16 md:h-24';
  
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      animate={{
        y: [0, -30, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 3.5,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      <div className={sizeClasses}>
        <img 
          src="/baby-jellyfish.svg" 
          alt="Baby Jellyfish" 
          className="w-full h-full object-contain"
        />
      </div>
    </motion.div>
  );
}

export function BabyFish({ className = '', delay = 0, color = '#FFB347' }: { className?: string; delay?: number; color?: string }) {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    fetch('/baby-fish.svg')
      .then(res => res.text())
      .then(text => {
        // Replace currentColor with the actual color value
        const processedSvg = text.replace(/currentColor/g, color);
        setSvgContent(processedSvg);
      })
      .catch(err => console.error('Failed to load baby-fish.svg:', err));
  }, [color]);

  if (!svgContent) {
    return null;
  }

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      animate={{
        x: [0, 30, 0],
        y: [0, -5, 5, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      <div 
        className="w-12 h-8 md:w-16 md:h-10"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </motion.div>
  );
}

export function BabySeahorse({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute pointer-events-none pt-5 ${className}`}
      animate={{
        x: [0, 20, 0],
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      <img 
        src="/baby-seahorse.svg" 
        alt="Baby Seahorse" 
        className='w-24 h-36 md:w-32 md:h-48' 
      />
    </motion.div>
  );
}

export function Bubbles({ count = 15 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate stable random values on mount
  const bubbleData = useMemo(() => {
    return [...Array(count)].map(() => ({
      width: Math.random() * 20 + 8,
      left: Math.random() * 100,
      xOffset: Math.random() * 50 - 25,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 10,
    }));
  }, [count]);

  if (!mounted) {
    return null;
  }

  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {bubbleData.map((bubble, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20 border border-white/30"
          style={{
            width: bubble.width,
            height: bubble.width,
            left: `${bubble.left}%`,
            bottom: -50,
          }}
          animate={{
            y: [0, -screenHeight - 100],
            x: [0, bubble.xOffset],
            opacity: [0.7, 0],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}



export function Seaweed({ className = '' }: { className?: string }) {
  return (
    <motion.div className={`absolute pointer-events-none bottom-0 ${className}`}>
      <div className="w-40 h-96 md:w-56 md:h-[28rem]">
        <img 
          src="/seaweed.svg" 
          alt="Seaweed" 
          className="w-full h-full object-contain object-bottom"
        />
      </div>
    </motion.div>
  );
}

export function Seaweed2({ className = '' }: { className?: string }) {
  return (
    <motion.div className={`absolute pointer-events-none bottom-0 ${className}`}>
      <div className="w-40 h-96 md:w-56 md:h-[28rem]">
        <img 
          src="/seaweed2.svg" 
          alt="Seaweed2" 
          className="w-full h-full object-contain object-bottom"
        />
      </div>
    </motion.div>
  );
}

export function SeaBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient waves */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-900" />
      
      {/* Light rays */}
      <div className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-b from-white/20 to-transparent transform -skew-x-12" />
      <div className="absolute top-0 left-1/2 w-24 h-full bg-gradient-to-b from-white/15 to-transparent transform skew-x-6" />
      <div className="absolute top-0 right-1/4 w-20 h-full bg-gradient-to-b from-white/10 to-transparent transform -skew-x-3" />
      
      {/* Sandy bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-200/40 to-transparent" />
      
      <Bubbles count={20} />
      
      {/* Sea creatures scattered around */}
      <BabyTurtle className="top-40 left-10" delay={1}  />
      <BabyJellyfish className="top-20 right-10" delay={0.5} size="large" />
      <BabySeahorse className="top-1/2 right-10" delay={0.8} />
      <BabyFish className="top-40 left-1/4" delay={0.3} color="#FFB347" />
      <BabyFish className="top-1/2 right-1/3" delay={1.5} color="#FF6B9D" />
      <BabyFish className="bottom-1/3 left-1/3" delay={2.5} color="#87CEEB" />
      
      {/* Seaweed */}
      <Seaweed className="left-5" />
      <Seaweed2 className="right-10" />
    </div>
  );
}
