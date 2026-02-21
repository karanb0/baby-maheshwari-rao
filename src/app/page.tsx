'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SeaBackground } from '@/components/SeaCreatures';
import { GameState } from '@/types/game';
import Link from 'next/link';

export default function GuestPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [visitorId, setVisitorId] = useState('');
  const [currentVote, setCurrentVote] = useState<'mom' | 'dad' | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [lastQuestionIndex, setLastQuestionIndex] = useState<number | null>(null);

  // Generate or retrieve visitor ID
  useEffect(() => {
    let id = localStorage.getItem('shoe-game-visitor-id');
    if (!id) {
      id = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('shoe-game-visitor-id', id);
    }
    setVisitorId(id);
  }, []);

  // Fetch game state
  const fetchGameState = async () => {
    try {
      const res = await fetch('/api/game');
      const data = await res.json();
      setGameState(data);
      
      // Reset vote status when question changes
      const currentIdx = data.currentQuestionIndex;
      if (currentIdx !== lastQuestionIndex) {
        setCurrentVote(null);
        setHasVoted(false);
        setLastQuestionIndex(currentIdx);
      }
    } catch (error) {
      console.error('Failed to fetch game state:', error);
    }
  };

  useEffect(() => {
    fetchGameState();
    const interval = setInterval(fetchGameState, 2000);
    return () => clearInterval(interval);
  }, []);

  // Update last question ID tracking
  useEffect(() => {
    if (gameState && lastQuestionIndex !== null) {
      const currentIdx = gameState.currentQuestionIndex;
      if (currentIdx !== lastQuestionIndex) {
        setCurrentVote(null);
        setHasVoted(false);
        setLastQuestionIndex(currentIdx);
      }
    }
  }, [gameState?.currentQuestionIndex]);

  const handleVote = async (choice: 'mom' | 'dad') => {
    if (!gameState || !visitorId) return;
    
    try {
      await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'vote',
          visitorId,
          questionIndex: gameState.currentQuestionIndex,
          choice,
        }),
      });
      
      setCurrentVote(choice);
      setHasVoted(true);
    } catch (error) {
      console.error('Failed to submit vote:', error);
    }
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SeaBackground />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          🐚
        </motion.div>
      </div>
    );
  }

  if (gameState.showQRCode) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <SeaBackground />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 pt-20">
              Waiting for the game to start...
            </h1>
            <p className="text-xl text-white/80">
              The host is getting things ready!
            </p>
            <motion.div
              className="mt-8 flex gap-4 justify-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-4xl">🦀</span>
              <span className="text-4xl">🐠</span>
              <span className="text-4xl">🐢</span>
            </motion.div>
          </motion.div>
        </div>
      </main>
    );
  }

  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <SeaBackground />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        {/* Header */}
        <Link href="/" className="absolute top-4 left-4 text-white/80 hover:text-white">
          ← Back
        </Link>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
            🐚 The Shoe Game 🐚
          </h1>
          <p className="text-white/80 mt-2">
            Question {gameState.currentQuestionIndex + 1} of {gameState.questions.length}
          </p>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState.currentQuestionIndex}
            initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-8 border-2 border-white/30 shadow-xl max-w-lg w-full mb-8"
          >
            <motion.p
              className="text-xl md:text-2xl text-white font-medium text-center leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {currentQuestion}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Voting Buttons */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-lg">
          {/* Dad Button */}
          <motion.button
            onClick={() => handleVote('dad')}
            disabled={hasVoted}
            className={`flex-1 relative overflow-hidden rounded-2xl p-6 md:p-8 transition-all ${
              currentVote === 'dad'
                ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-transparent'
                : ''
            } ${hasVoted && currentVote !== 'dad' ? 'opacity-50' : ''}`}
            whileHover={!hasVoted ? { scale: 1.05 } : {}}
            whileTap={!hasVoted ? { scale: 0.95 } : {}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600" />
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                className="text-6xl md:text-7xl mb-2"
                animate={currentVote === 'dad' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                👨
              </motion.div>
              <span className="text-2xl md:text-3xl font-bold text-white">
                {gameState.dadName}
              </span>
              {currentVote === 'dad' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 text-4xl"
                >
                  ✓
                </motion.div>
              )}
            </div>
          </motion.button>

          {/* Mom Button */}
          <motion.button
            onClick={() => handleVote('mom')}
            disabled={hasVoted}
            className={`flex-1 relative overflow-hidden rounded-2xl p-6 md:p-8 transition-all ${
              currentVote === 'mom'
                ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-transparent'
                : ''
            } ${hasVoted && currentVote !== 'mom' ? 'opacity-50' : ''}`}
            whileHover={!hasVoted ? { scale: 1.05 } : {}}
            whileTap={!hasVoted ? { scale: 0.95 } : {}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600" />
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                className="text-6xl md:text-7xl mb-2"
                animate={currentVote === 'mom' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                👩
              </motion.div>
              <span className="text-2xl md:text-3xl font-bold text-white">
                {gameState.momName}
              </span>
              {currentVote === 'mom' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 text-4xl"
                >
                  ✓
                </motion.div>
              )}
            </div>
          </motion.button>
        </div>

        {/* Vote Confirmation */}
        <AnimatePresence>
          {hasVoted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                className="text-5xl mb-4"
              >
                🎉
              </motion.div>
              <p className="text-xl text-white font-medium">
                Vote submitted! Waiting for next question...
              </p>
              <motion.div
                className="mt-4 flex gap-2 justify-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="w-2 h-2 bg-white rounded-full" />
                <span className="w-2 h-2 bg-white rounded-full" />
                <span className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative elements */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex gap-4 text-3xl opacity-60">
            <span>🐙</span>
            <span>🦑</span>
            <span>🐠</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
