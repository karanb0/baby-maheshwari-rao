'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { SeaBackground, BabyFish, Bubbles } from '@/components/SeaCreatures';
import { VoteSlider } from '@/components/VoteSlider';
import { GameState, VoteTally } from '@/types/game';
import { FeudState } from '@/types/feud';
import { ActiveGame } from '@/lib/activeGameStore';

export default function PresentationPage() {
  const [activeGame, setActiveGame] = useState<ActiveGame>('shoe');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [voteTally, setVoteTally] = useState<VoteTally>({ mom: 0, dad: 0, total: 0, momPercentage: 50, dadPercentage: 50 });
  const [feudState, setFeudState] = useState<FeudState | null>(null);
  const [guestUrl, setGuestUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGuestUrl(window.location.origin);
    }
  }, []);

  const fetchActiveGame = useCallback(async () => {
    try {
      const res = await fetch('/api/active-game');
      const data = await res.json();
      setActiveGame(data.activeGame);
    } catch (e) { console.error(e); }
  }, []);

  const fetchGameState = useCallback(async () => {
    try {
      const res = await fetch('/api/game');
      const data = await res.json();
      setGameState(data);
    } catch (e) { console.error(e); }
  }, []);

  const fetchVotes = useCallback(async () => {
    if (!gameState || !gameState.questions[gameState.currentQuestionIndex]) return;
    try {
      const questionId = gameState.questions[gameState.currentQuestionIndex].id;
      const res = await fetch(`/api/game?action=votes&questionId=${questionId}`);
      const data = await res.json();
      setVoteTally(data);
    } catch (e) { console.error(e); }
  }, [gameState]);

  const fetchFeudState = useCallback(async () => {
    try {
      const res = await fetch('/api/feud');
      const data = await res.json();
      setFeudState(data);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchActiveGame();
    fetchGameState();
    fetchFeudState();
    const interval = setInterval(() => {
      fetchActiveGame();
      if (activeGame === 'shoe') fetchGameState();
      if (activeGame === 'feud') fetchFeudState();
    }, 1500);
    return () => clearInterval(interval);
  }, [activeGame, fetchActiveGame, fetchGameState, fetchFeudState]);

  useEffect(() => {
    if (activeGame !== 'shoe') return;
    fetchVotes();
    const interval = setInterval(fetchVotes, 500);
    return () => clearInterval(interval);
  }, [activeGame, fetchVotes]);

  useEffect(() => {
    if (activeGame !== 'feud') return;
    const interval = setInterval(fetchFeudState, 800);
    return () => clearInterval(interval);
  }, [activeGame, fetchFeudState]);

  // Loading
  if ((activeGame === 'shoe' && !gameState) || (activeGame === 'feud' && !feudState)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-900 overflow-hidden">
        <SeaBackground />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-8xl">
          🐚
        </motion.div>
      </div>
    );
  }

  if (activeGame === 'feud' && feudState) {
    return <FeudPresentation feudState={feudState} />;
  }

  if (!gameState) return null;

  // Shoe Game: QR Code Mode
  if (gameState.showQRCode) {
    return (
      <main className="h-screen w-screen overflow-hidden bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-900">
        <SeaBackground />
        <Bubbles count={20} />
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
          <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-6">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-2"
              animate={{ textShadow: ['0 0 20px rgba(255,255,255,0.5)', '0 0 60px rgba(255,255,255,0.8)', '0 0 20px rgba(255,255,255,0.5)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🐚 Shoe Game 🐚
            </motion.h1>
          </motion.div>

          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
            <motion.div
              className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl"
              animate={{ boxShadow: ['0 0 30px rgba(255,255,255,0.3)', '0 0 60px rgba(255,255,255,0.6)', '0 0 30px rgba(255,255,255,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <QRCodeSVG value={guestUrl} size={280} />
            </motion.div>
          </motion.div>

          <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
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

  // Shoe Game: Game Mode
  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];

  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-900">
      <SeaBackground />
      <Bubbles count={15} />
      <div className="relative z-10 flex flex-col items-center justify-between h-full py-4 px-6">
        <div className="text-center">
          <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
            🐚 The Shoe Game 🐚
          </motion.h1>
          <motion.div className="mt-2" animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <span className="bg-yellow-400 text-blue-900 px-5 py-1.5 rounded-full font-bold text-lg md:text-xl">
              Question {gameState.currentQuestionIndex + 1} of {gameState.questions.length}
            </span>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            className="bg-white/25 backdrop-blur-md rounded-2xl p-6 md:p-8 border-2 border-white/40 shadow-xl max-w-3xl w-full"
          >
            <motion.p className="text-2xl md:text-4xl text-white font-bold text-center leading-snug" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              {currentQuestion.text}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="w-full max-w-4xl">
          <VoteSlider tally={voteTally} momName={gameState.momName} dadName={gameState.dadName} momImage="/mom.png" dadImage="/dad.png" size="large" />
        </motion.div>

        <motion.div className="absolute top-4 right-4 flex items-center gap-2" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <motion.div className="w-3 h-3 bg-red-500 rounded-full" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
          <span className="text-white font-bold text-base">LIVE</span>
        </motion.div>

        <BabyFish className="top-1/4 left-4 opacity-40" delay={0} color="#FFB347" />
        <BabyFish className="top-1/3 right-4 opacity-40" delay={1.5} color="#FF6B9D" />
      </div>
    </main>
  );
}

/* ═══════════════════════════════════════════
   Family Feud Presentation
   ═══════════════════════════════════════════ */

function FeudPresentation({ feudState }: { feudState: FeudState }) {
  const category = feudState.categories[feudState.currentCategoryIndex];
  const revealed = feudState.revealedAnswers[category.id] || [];
  const leftAnswers = category.answers.slice(0, 4);
  const rightAnswers = category.answers.slice(4, 8);

  const [prevStrikes, setPrevStrikes] = useState(feudState.strikes);
  const [showBigX, setShowBigX] = useState(false);

  useEffect(() => {
    if (feudState.strikes > prevStrikes) {
      setShowBigX(true);
      const timer = setTimeout(() => setShowBigX(false), 1200);
      return () => clearTimeout(timer);
    }
    setPrevStrikes(feudState.strikes);
  }, [feudState.strikes, prevStrikes]);

  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-b from-indigo-900 via-blue-900 to-slate-900">
      <SeaBackground />

      {/* Big X center-screen animation */}
      <AnimatePresence>
        {showBigX && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              className="text-red-500 font-bold select-none"
              style={{ filter: 'drop-shadow(0 0 60px rgba(239,68,68,0.9)) drop-shadow(0 0 120px rgba(239,68,68,0.5))' }}
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{
                scale: [0, 1.4, 1.2],
                rotate: [-180, 10, 0],
                opacity: [0, 1, 1],
                fontSize: ['0rem', '18rem', '16rem'],
                y: [0, 0, 0],
              }}
              exit={{
                scale: 0.35,
                y: 300,
                opacity: 0.6,
                fontSize: '4rem',
                transition: { duration: 0.6, ease: 'easeIn' },
              }}
              transition={{
                duration: 0.5,
              }}
            >
              ✕
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col h-full p-4 md:p-6">
        {/* Live indicator */}
        <motion.div className="absolute top-4 right-4 flex items-center gap-2 z-20" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <motion.div className="w-3 h-3 bg-red-500 rounded-full" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
          <span className="text-white font-bold text-base">LIVE</span>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">Baby Family Feud</h1>
        </motion.div>

        {/* Category Title */}
        <motion.div
          key={category.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-4"
        >
          <div className="inline-block bg-amber-500/90 backdrop-blur-sm px-8 py-3 rounded-xl border-2 border-amber-300/50 shadow-lg">
            <p className="text-xl md:text-3xl font-bold text-white">{category.title}</p>
          </div>
        </motion.div>

        {/* Answer Board */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-3 md:gap-4 w-full max-w-5xl">
            {/* Left column: answers 1-4 */}
            <div className="space-y-3">
              {leftAnswers.map((answer, i) => (
                <FeudAnswerCard key={i} answer={answer} index={i} isRevealed={revealed.includes(i)} />
              ))}
            </div>
            {/* Right column: answers 5-8 */}
            <div className="space-y-3">
              {rightAnswers.map((answer, i) => (
                <FeudAnswerCard key={i + 4} answer={answer} index={i + 4} isRevealed={revealed.includes(i + 4)} />
              ))}
            </div>
          </div>
        </div>

        {/* Strike tracker at bottom */}
        <div className="flex justify-center gap-6 my-2 h-16">
          {[0, 1, 2].map(i => (
            <AnimatePresence key={i}>
              {i < feudState.strikes && (
                <motion.span
                  initial={{ scale: 0, opacity: 0, y: -20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                  className="text-5xl md:text-6xl text-red-500 font-bold drop-shadow-[0_0_20px_rgba(239,68,68,0.7)]"
                >
                  ✕
                </motion.span>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Scoreboard */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-auto">
          <div className="flex justify-center gap-6 md:gap-12">
            <div className={`text-center px-8 md:px-16 py-3 rounded-xl transition-all ${feudState.activeTeam === 1 ? 'bg-blue-600/80 ring-2 ring-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`}>
              <p className="text-white/80 text-sm md:text-base font-medium">{feudState.teamNames[0]}</p>
              <p className="text-3xl md:text-5xl font-bold text-white">{feudState.scores[0]}</p>
            </div>
            <div className="flex items-center">
              <span className="text-2xl md:text-3xl text-white/40 font-bold">VS</span>
            </div>
            <div className={`text-center px-8 md:px-16 py-3 rounded-xl transition-all ${feudState.activeTeam === 2 ? 'bg-orange-600/80 ring-2 ring-orange-300 shadow-[0_0_30px_rgba(249,115,22,0.5)]' : 'bg-white/10'}`}>
              <p className="text-white/80 text-sm md:text-base font-medium">{feudState.teamNames[1]}</p>
              <p className="text-3xl md:text-5xl font-bold text-white">{feudState.scores[1]}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function FeudAnswerCard({ answer, index, isRevealed }: { answer: { text: string; points: number }; index: number; isRevealed: boolean }) {
  return (
    <div className="perspective-1000">
      <AnimatePresence mode="wait">
        {isRevealed ? (
          <motion.div
            key="revealed"
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl px-5 py-3 md:py-4 border-2 border-blue-400/50 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-blue-300 font-bold text-lg md:text-xl">{index + 1}</span>
              <span className="text-white font-bold text-lg md:text-2xl">{answer.text}</span>
            </div>
            <span className="text-yellow-300 font-bold text-xl md:text-2xl">{answer.points}</span>
          </motion.div>
        ) : (
          <motion.div
            key="hidden"
            exit={{ rotateX: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center bg-gradient-to-r from-blue-800/80 to-indigo-800/80 rounded-xl px-5 py-3 md:py-4 border-2 border-blue-500/30"
          >
            <span className="text-blue-300/60 font-bold text-2xl md:text-3xl">{index + 1}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
