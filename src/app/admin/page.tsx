'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { SeaBackground } from '@/components/SeaCreatures';
import { VoteSlider } from '@/components/VoteSlider';
import { GameState, VoteTally } from '@/types/game';
import Link from 'next/link';

export default function AdminPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [voteTally, setVoteTally] = useState<VoteTally>({ mom: 0, dad: 0, total: 0, momPercentage: 50, dadPercentage: 50 });
  const [guestUrl, setGuestUrl] = useState('');
  const [momName, setMomName] = useState('Mom');
  const [dadName, setDadName] = useState('Dad');

  useEffect(() => {
    // Set guest URL based on current location
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin;
      setGuestUrl(`${baseUrl}/guest`);
    }
  }, []);

  // Fetch game state
  const fetchGameState = async () => {
    try {
      const res = await fetch('/api/game');
      const data = await res.json();
      setGameState(data);
      setMomName(data.momName);
      setDadName(data.dadName);
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
    const interval = setInterval(fetchGameState, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchVotes();
    const interval = setInterval(fetchVotes, 1000);
    return () => clearInterval(interval);
  }, [gameState?.currentQuestionIndex]);

  const updateGame = async (action: string, params: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...params }),
      });
      const data = await res.json();
      setGameState(data);
    } catch (error) {
      console.error('Failed to update game:', error);
    }
  };

  const handleSetQuestion = (index: number) => {
    updateGame('setQuestion', { index });
  };

  const handleToggleQR = (show: boolean) => {
    updateGame('toggleQR', { show });
  };

  const handleSaveNames = () => {
    updateGame('setNames', { momName, dadName });
  };

  const handleResetVotes = () => {
    if (confirm('Are you sure you want to reset all votes?')) {
      updateGame('resetVotes', {});
    }
  };

  const handleResetGame = () => {
    if (confirm('Are you sure you want to reset the entire game?')) {
      updateGame('resetGame', {});
    }
  };

  const handleAddVote = (choice: 'mom' | 'dad') => {
    if (!gameState) return;
    const questionId = gameState.questions[gameState.currentQuestionIndex].id;
    const visitorId = `admin-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    updateGame('vote', { visitorId, questionId, choice });
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

  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <SeaBackground />
      
      <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-white/80 hover:text-white flex items-center gap-2">
            ← Back
          </Link>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg"
          >
            🎮 Admin Control Panel
          </motion.h1>
          <div className="w-20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Parent Names */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30"
            >
              <h2 className="text-xl font-bold text-white mb-4">👪 Parent Names</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-white/80 text-sm mb-1">Dad&apos;s Name</label>
                  <input
                    type="text"
                    value={dadName}
                    onChange={(e) => setDadName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Dad"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-1">Mom&apos;s Name</label>
                  <input
                    type="text"
                    value={momName}
                    onChange={(e) => setMomName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="Mom"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveNames}
                className="w-full py-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg text-white font-bold hover:from-green-500 hover:to-emerald-600 transition-all"
              >
                Save Names
              </button>
            </motion.div>

            {/* QR Code Toggle */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30"
            >
              <h2 className="text-xl font-bold text-white mb-4">📱 QR Code Display</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => handleToggleQR(true)}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    gameState.showQRCode
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/20 text-white/60 hover:bg-white/30'
                  }`}
                >
                  Show QR
                </button>
                <button
                  onClick={() => handleToggleQR(false)}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    !gameState.showQRCode
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-white/20 text-white/60 hover:bg-white/30'
                  }`}
                >
                  Show Game
                </button>
              </div>
            </motion.div>

            {/* Question Navigator */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30"
            >
              <h2 className="text-xl font-bold text-white mb-4">❓ Questions</h2>
              
              {/* Current Question Display */}
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <p className="text-sm text-white/60 mb-1">Current Question ({gameState.currentQuestionIndex + 1}/{gameState.questions.length})</p>
                <p className="text-lg text-white font-medium">{currentQuestion?.text}</p>
              </div>

              {/* Navigation */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => handleSetQuestion(gameState.currentQuestionIndex - 1)}
                  disabled={gameState.currentQuestionIndex === 0}
                  className="flex-1 py-3 bg-white/20 rounded-lg text-white font-bold hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => handleSetQuestion(gameState.currentQuestionIndex + 1)}
                  disabled={gameState.currentQuestionIndex >= gameState.questions.length - 1}
                  className="flex-1 py-3 bg-white/20 rounded-lg text-white font-bold hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>

              {/* Question List */}
              <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-white/30">
                {gameState.questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => handleSetQuestion(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      index === gameState.currentQuestionIndex
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <span className="font-bold mr-2">{index + 1}.</span>
                    {q.text}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Reset Controls */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30"
            >
              <h2 className="text-xl font-bold text-white mb-4">🔄 Reset Options</h2>
              <div className="flex gap-4">
                <button
                  onClick={handleResetVotes}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg text-white font-bold hover:from-orange-500 hover:to-red-500 transition-all"
                >
                  Reset Votes
                </button>
                <button
                  onClick={handleResetGame}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-700 rounded-lg text-white font-bold hover:from-red-600 hover:to-red-800 transition-all"
                >
                  Reset All
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {/* QR Code Preview */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30"
            >
              <h2 className="text-xl font-bold text-white mb-4">📱 Guest Join QR</h2>
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-xl shadow-xl">
                  <QRCodeSVG value={guestUrl} size={180} />
                </div>
                <p className="mt-4 text-white/80 text-center text-sm break-all">{guestUrl}</p>
              </div>
            </motion.div>

            {/* Live Vote Preview */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30"
            >
              <h2 className="text-xl font-bold text-white mb-4">📊 Live Votes</h2>
              <VoteSlider 
                tally={voteTally} 
                momName={gameState.momName} 
                dadName={gameState.dadName}
                momImage="/mom.png"
                dadImage="/dad.png"
              />
              
              {/* Manual Vote Buttons */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm text-white/60 text-center mb-3">Add Manual Votes</p>
                <div className="flex justify-between gap-4">
                  <button
                    onClick={() => handleAddVote('dad')}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <span>+1</span>
                    <span>{gameState.dadName}</span>
                  </button>
                  <button
                    onClick={() => handleAddVote('mom')}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg text-white font-bold hover:from-pink-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                  >
                    <span>+1</span>
                    <span>{gameState.momName}</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Presentation Link */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30"
            >
              <h2 className="text-xl font-bold text-white mb-4">📺 Presentation Mode</h2>
              <Link href="/presentation" target="_blank">
                <button className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-bold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg">
                  Open Presentation View →
                </button>
              </Link>
              <p className="mt-3 text-white/60 text-sm text-center">
                Open this on the big screen for everyone to see!
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
