'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { SeaBackground, BabyFish, Bubbles } from '@/components/SeaCreatures';
import { VoteSlider } from '@/components/VoteSlider';
import { GameState, VoteTally } from '@/types/game';

export default function PresentationPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [voteTally, setVoteTally] = useState<VoteTally>({ mom: 0, dad: 0, total: 0, momPercentage: 50, dadPercentage: 50 });
  const [guestUrl, setGuestUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin;
      setGuestUrl(`${baseUrl}`);
    }
  }, []);

  // Fetch game state
  const fetchGameState = async () => {
    try {
      const res = await fetch('/api/game');
      const data = await res.json();
      setGameState(data);
    } catch (error) {
      console.error('Failed to fetch game state:', error);
    }
  };

  // Fetch vote tally for current question
  const fetchVotes = async () => {
    if (!gameState || !gameState.questions[gameState.currentQuestionIndex]) return;
    try {
      const questionId = gameState.questions[gameState.currentQuestionIndex].id;
      const res = await fetch(`/api/game?action=votes&questionId=${questionId}`);
      const data = await res.json();
      setVoteTally(data);
    } catch (error) {
      console.error('Failed to fetch votes:', error);
    }
  };

  useEffect(() => {
    fetchGameState();
    const interval = setInterval(fetchGameState, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchVotes();
    const interval = setInterval(fetchVotes, 500); // Fast polling for real-time feel
    return () => clearInterval(interval);
  }, [gameState?.currentQuestionIndex]);

  if (!gameState) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-900 overflow-hidden">
        <SeaBackground />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-8xl"
        >
          🐚
        </motion.div>
      </div>
    );
  }

  // QR Code Mode
  if (gameState.showQRCode) {
    return (
      <main className="h-screen w-screen overflow-hidden bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-900">
        <SeaBackground />
        <Bubbles count={20} />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
          {/* Animated Title */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-6"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-2"
              animate={{
                textShadow: [
                  '0 0 20px rgba(255,255,255,0.5)',
                  '0 0 60px rgba(255,255,255,0.8)',
                  '0 0 20px rgba(255,255,255,0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🐚 Shoe Game 🐚
            </motion.h1>
          </motion.div>

          {/* Giant QR Code */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <motion.div
              className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl"
              animate={{
                boxShadow: [
                  '0 0 30px rgba(255,255,255,0.3)',
                  '0 0 60px rgba(255,255,255,0.6)',
                  '0 0 30px rgba(255,255,255,0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <QRCodeSVG value={guestUrl} size={280} />
            </motion.div>
          </motion.div>

          {/* Animated sea creatures at bottom */}
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="flex gap-6 items-end">
              <motion.span className="text-4xl" animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 2, repeat: Infinity }}>🐙</motion.span>
              <motion.span className="text-5xl" animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>🐢</motion.span>
              <motion.span className="text-4xl" animate={{ x: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>🐠</motion.span>
              <motion.span className="text-3xl" animate={{ rotate: [0, 15, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>🦀</motion.span>
              <motion.span className="text-4xl" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>🐡</motion.span>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  // Game Mode
  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];

  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-900">
      <SeaBackground />
      <Bubbles count={15} />
      
      <div className="relative z-10 flex flex-col items-center justify-between h-full py-4 px-6">
        {/* Top section: Title and question counter */}
        <div className="text-center">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg"
          >
            🐚 The Shoe Game 🐚
          </motion.h1>
          
          <motion.div
            className="mt-2"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="bg-yellow-400 text-blue-900 px-5 py-1.5 rounded-full font-bold text-lg md:text-xl">
              Question {gameState.currentQuestionIndex + 1} of {gameState.questions.length}
            </span>
          </motion.div>
        </div>

        {/* Middle section: Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            className="bg-white/25 backdrop-blur-md rounded-2xl p-6 md:p-8 border-2 border-white/40 shadow-xl max-w-3xl w-full"
          >
            <motion.p
              className="text-2xl md:text-4xl text-white font-bold text-center leading-snug"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {currentQuestion.text}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Bottom section: Vote Slider */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-4xl"
        >
          <VoteSlider
            tally={voteTally}
            momName={gameState.momName}
            dadName={gameState.dadName}
            momImage="/mom.png"
            dadImage="/dad.png"
            size="large"
          />
        </motion.div>

        {/* Live indicator */}
        <motion.div
          className="absolute top-4 right-4 flex items-center gap-2"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-3 h-3 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-white font-bold text-base">LIVE</span>
        </motion.div>

        {/* Decorative fish - positioned to not overlap content */}
        <BabyFish className="top-1/4 left-4 opacity-40" delay={0} color="#FFB347" />
        <BabyFish className="top-1/3 right-4 opacity-40" delay={1.5} color="#FF6B9D" />
      </div>
    </main>
  );
}
