'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SeaBackground, BabyOctopus, BabyTurtle, BabyFish } from '@/components/SeaCreatures';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <SeaBackground />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-4"
            animate={{ 
              textShadow: [
                '0 0 20px rgba(255,255,255,0.5)',
                '0 0 40px rgba(255,255,255,0.8)',
                '0 0 20px rgba(255,255,255,0.5)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🐚 Baby Shower 🐚
          </motion.h1>
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-yellow-300 drop-shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            The Shoe Game!
          </motion.h2>
          <motion.p
            className="mt-4 text-lg md:text-xl text-white/90 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Dive deep into fun with this under-the-sea adventure!
          </motion.p>
        </motion.div>

        {/* Navigation cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {/* Admin Card */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/admin" className="block">
              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 shadow-xl hover:bg-white/30 transition-all">
                <div className="text-6xl mb-4 text-center">🎮</div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">Admin</h3>
                <p className="text-white/80 text-center text-sm">
                  Control the game, manage questions, and run the show!
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Guest Card */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/guest" className="block">
              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 shadow-xl hover:bg-white/30 transition-all">
                <div className="text-6xl mb-4 text-center">🗳️</div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">Guest</h3>
                <p className="text-white/80 text-center text-sm">
                  Join the fun and vote on each question!
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Presentation Card */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/presentation" className="block">
              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 shadow-xl hover:bg-white/30 transition-all">
                <div className="text-6xl mb-4 text-center">📺</div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">Presentation</h3>
                <p className="text-white/80 text-center text-sm">
                  Display on the big screen for everyone to see!
                </p>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Decorative sea creatures */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex gap-8 items-end">
            <span className="text-5xl">🐙</span>
            <span className="text-6xl">🐢</span>
            <span className="text-5xl">🐠</span>
            <span className="text-4xl">🦀</span>
            <span className="text-5xl">🐡</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
