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
      <svg viewBox="0 0 120 80" className="w-20 h-14 md:w-28 md:h-20">
        <ellipse cx="60" cy="45" rx="35" ry="25" fill="#7ED4AD" />
        <ellipse cx="60" cy="45" rx="28" ry="18" fill="#5CB88A" />
        <path d="M35,45 L28,50 L25,45 L32,42 Z" fill="#7ED4AD" />
        <path d="M85,45 L92,50 L95,45 L88,42 Z" fill="#7ED4AD" />
        <path d="M45,65 L40,75 L50,72 Z" fill="#7ED4AD" />
        <path d="M75,65 L80,75 L70,72 Z" fill="#7ED4AD" />
        <circle cx="25" cy="35" r="12" fill="#7ED4AD" />
        <circle cx="22" cy="33" r="3" fill="#333" />
        <path d="M20,40 Q25,42 30,40" fill="none" stroke="#5CB88A" strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
}

export function BabyJellyfish({ className = '', delay = 0 }: { className?: string; delay?: number }) {
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
      <svg viewBox="0 0 80 120" className="w-12 h-18 md:w-16 md:h-24">
        <ellipse cx="40" cy="30" rx="30" ry="25" fill="#C8A2F8" fillOpacity="0.8" />
        <ellipse cx="40" cy="35" rx="20" ry="15" fill="#E0C8FF" fillOpacity="0.5" />
        <circle cx="30" cy="28" r="4" fill="#333" />
        <circle cx="50" cy="28" r="4" fill="#333" />
        <path d="M35,38 Q40,42 45,38" fill="none" stroke="#9B6DD4" strokeWidth="2" />
        {[...Array(5)].map((_, i) => (
          <motion.path
            key={i}
            d={`M${20 + i * 10},50 Q${18 + i * 10},80 ${20 + i * 10},110`}
            fill="none"
            stroke="#C8A2F8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeOpacity="0.7"
            animate={{
              d: [
                `M${20 + i * 10},50 Q${15 + i * 10},80 ${20 + i * 10},110`,
                `M${20 + i * 10},50 Q${25 + i * 10},80 ${20 + i * 10},110`,
                `M${20 + i * 10},50 Q${15 + i * 10},80 ${20 + i * 10},110`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

export function BabyFish({ className = '', delay = 0, color = '#FFB347' }: { className?: string; delay?: number; color?: string }) {
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
      <svg viewBox="0 0 80 50" className="w-12 h-8 md:w-16 md:h-10">
        <ellipse cx="35" cy="25" rx="25" ry="15" fill={color} />
        <path d="M60,25 L75,10 L75,40 Z" fill={color} />
        <circle cx="22" cy="22" r="5" fill="white" />
        <circle cx="23" cy="23" r="2.5" fill="#333" />
        <path d="M35,10 Q40,5 45,12" fill="none" stroke={color} strokeWidth="4" />
        <path d="M18,30 Q25,33 30,30" fill="none" stroke="#333" strokeWidth="1" />
      </svg>
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
    <motion.div className={`absolute pointer-events-none ${className}`}>
      <svg viewBox="0 0 40 150" className="w-10 h-36 md:w-14 md:h-48">
        {[0, 15, 30].map((offset, i) => (
          <motion.path
            key={i}
            d={`M${10 + offset},150 Q${5 + offset},100 ${15 + offset},70 Q${5 + offset},40 ${10 + offset},0`}
            fill="none"
            stroke={i === 1 ? '#2D8B5F' : '#3AAE76'}
            strokeWidth="8"
            strokeLinecap="round"
            animate={{
              d: [
                `M${10 + offset},150 Q${5 + offset},100 ${15 + offset},70 Q${5 + offset},40 ${10 + offset},0`,
                `M${10 + offset},150 Q${15 + offset},100 ${5 + offset},70 Q${15 + offset},40 ${10 + offset},0`,
                `M${10 + offset},150 Q${5 + offset},100 ${15 + offset},70 Q${5 + offset},40 ${10 + offset},0`,
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
          />
        ))}
      </svg>
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
      <BabyOctopus className="bottom-20 left-10" delay={0} />
      <BabyTurtle className="bottom-16 right-20" delay={1} />
      <BabyJellyfish className="top-20 right-10" delay={0.5} />
      <BabyJellyfish className="top-40 left-20" delay={2} />
      <BabyFish className="top-1/3 left-1/4" delay={0.3} color="#FFB347" />
      <BabyFish className="top-1/2 right-1/3" delay={1.5} color="#FF6B9D" />
      <BabyFish className="bottom-1/3 left-1/3" delay={2.5} color="#87CEEB" />
      
      {/* Seaweed */}
      <Seaweed className="bottom-0 left-5" />
      <Seaweed className="bottom-0 right-10" />
      <Seaweed className="bottom-0 left-1/3" />
    </div>
  );
}
