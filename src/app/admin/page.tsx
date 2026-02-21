'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { SeaBackground } from '@/components/SeaCreatures';
import { VoteSlider } from '@/components/VoteSlider';
import { GameState, VoteTally } from '@/types/game';
import { FeudState } from '@/types/feud';
import { ActiveGame } from '@/lib/activeGameStore';
import Link from 'next/link';

type Tab = 'shoe' | 'feud' | 'price';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>('shoe');
  const [activeGame, setActiveGame] = useState<ActiveGame>('shoe');

  // Shoe Game state
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [voteTally, setVoteTally] = useState<VoteTally>({ mom: 0, dad: 0, total: 0, momPercentage: 50, dadPercentage: 50 });
  const [guestUrl, setGuestUrl] = useState('');
  const [momName, setMomName] = useState('Mom');
  const [dadName, setDadName] = useState('Dad');

  // Feud state
  const [feudState, setFeudState] = useState<FeudState | null>(null);
  const [teamName1, setTeamName1] = useState('Team 1');
  const [teamName2, setTeamName2] = useState('Team 2');

  // Price is Right state
  const [showPrices, setShowPrices] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGuestUrl(window.location.origin);
      if (sessionStorage.getItem('admin-auth') === 'true') {
        setAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.authenticated) {
        setAuthenticated(true);
        setPasswordError(false);
        sessionStorage.setItem('admin-auth', 'true');
      } else {
        setPasswordError(true);
      }
    } catch {
      setPasswordError(true);
    }
  };

  // ── Active game ──
  const fetchActiveGame = useCallback(async () => {
    try {
      const res = await fetch('/api/active-game');
      const data = await res.json();
      setActiveGame(data.activeGame);
    } catch (e) { console.error(e); }
  }, []);

  const handleSetActiveGame = async (game: ActiveGame) => {
    try {
      const res = await fetch('/api/active-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game }),
      });
      const data = await res.json();
      setActiveGame(data.activeGame);
    } catch (e) { console.error(e); }
  };

  // ── Shoe Game ──
  const fetchGameState = useCallback(async () => {
    try {
      const res = await fetch('/api/game');
      const data = await res.json();
      setGameState(data);
      setMomName(data.momName);
      setDadName(data.dadName);
    } catch (e) { console.error(e); }
  }, []);

  const fetchVotes = useCallback(async () => {
    if (!gameState || !gameState.questions[gameState.currentQuestionIndex]) return;
    try {
      const res = await fetch(`/api/game?action=votes&questionIndex=${gameState.currentQuestionIndex}`);
      const data = await res.json();
      setVoteTally(data);
    } catch (e) { console.error(e); }
  }, [gameState]);

  const updateGame = async (action: string, params: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...params }),
      });
      const data = await res.json();
      setGameState(data);
    } catch (e) { console.error(e); }
  };

  // ── Feud ──
  const fetchFeudState = useCallback(async () => {
    try {
      const res = await fetch('/api/feud');
      const data = await res.json();
      setFeudState(data);
      setTeamName1(data.teamNames[0]);
      setTeamName2(data.teamNames[1]);
    } catch (e) { console.error(e); }
  }, []);

  const updateFeud = async (action: string, params: Record<string, unknown> = {}) => {
    try {
      const res = await fetch('/api/feud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...params }),
      });
      const data = await res.json();
      setFeudState(data);
    } catch (e) { console.error(e); }
  };

  // ── Price is Right ──
  const fetchShowPrices = useCallback(async () => {
    try {
      const res = await fetch('/api/price-is-right');
      const data = await res.json();
      setShowPrices(data.showPrices);
    } catch (e) { console.error(e); }
  }, []);

  const handleTogglePrices = async (show: boolean) => {
    try {
      const res = await fetch('/api/price-is-right', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showPrices: show }),
      });
      const data = await res.json();
      setShowPrices(data.showPrices);
    } catch (e) { console.error(e); }
  };

  // ── Polling ──
  useEffect(() => {
    fetchActiveGame();
    fetchGameState();
    fetchFeudState();
    fetchShowPrices();
    const interval = setInterval(() => {
      fetchActiveGame();
      fetchGameState();
      fetchFeudState();
      fetchShowPrices();
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchActiveGame, fetchGameState, fetchFeudState, fetchShowPrices]);

  useEffect(() => {
    fetchVotes();
    const interval = setInterval(fetchVotes, 1000);
    return () => clearInterval(interval);
  }, [fetchVotes]);

  // ── Shoe Game handlers ──
  const handleSetQuestion = (index: number) => updateGame('setQuestion', { index });
  const handleToggleQR = (show: boolean) => updateGame('toggleQR', { show });
  const handleSaveNames = () => updateGame('setNames', { momName, dadName });
  const handleResetVotes = () => { if (confirm('Reset all votes?')) updateGame('resetVotes', {}); };
  const handleResetGame = () => { if (confirm('Reset entire shoe game?')) updateGame('resetGame', {}); };
  const handleAddVote = (choice: 'mom' | 'dad') => {
    if (!gameState) return;
    const visitorId = `admin-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    updateGame('vote', { visitorId, questionIndex: gameState.currentQuestionIndex, choice });
  };

  // ── Feud handlers ──
  const handleRevealAnswer = (categoryId: string, answerIndex: number, awardPoints = true) => {
    updateFeud('revealAnswer', { categoryId, answerIndex, awardPoints });
  };
  const handleMarkWrong = () => updateFeud('markWrong');
  const handleSwitchTeam = () => updateFeud('switchTeam');
  const handleSetCategory = (index: number) => updateFeud('setCategory', { index });
  const handleSaveTeamNames = () => updateFeud('setTeamNames', { name1: teamName1, name2: teamName2 });
  const handleResetStrikes = () => updateFeud('resetStrikes');
  const handleToggleStealMode = () => updateFeud('toggleStealMode');
  const handleBankRound = () => updateFeud('bankRound');
  const handleResetFeud = () => { if (confirm('Reset Family Feud?')) updateFeud('resetFeud'); };

  // ── Password gate ──
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SeaBackground />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 bg-white/20 backdrop-blur-md rounded-2xl p-8 border-2 border-white/30 w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold text-white text-center mb-6">Admin Access</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
              placeholder="Enter password"
              autoFocus
              className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all ${
                passwordError ? 'border-red-400 focus:ring-red-400' : 'border-white/30 focus:ring-blue-400'
              }`}
            />
            {passwordError && (
              <p className="text-red-300 text-sm mt-2">Incorrect password</p>
            )}
            <button
              type="submit"
              className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-bold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
            >
              Enter
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── Loading ──
  if (!gameState || !feudState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SeaBackground />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-6xl">
          🐚
        </motion.div>
      </div>
    );
  }

  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  const currentCategory = feudState.categories[feudState.currentCategoryIndex];
  const revealedForCategory = feudState.revealedAnswers[currentCategory.id] || [];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <SeaBackground />

      <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="text-white/80 hover:text-white flex items-center gap-2">← Back</Link>
          <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            Admin Control Panel
          </motion.h1>
          <div className="w-20" />
        </div>

        {/* Active Game Selector */}
        <div className="mb-6">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border-2 border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Presentation Display</h2>
                <p className="text-white/60 text-sm">Choose which game is shown on /presentation</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSetActiveGame('shoe')}
                  className={`px-5 py-2 rounded-lg font-bold transition-all ${
                    activeGame === 'shoe'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white/20 text-white/60 hover:bg-white/30'
                  }`}
                >
                  Shoe Game
                </button>
                <button
                  onClick={() => handleSetActiveGame('feud')}
                  className={`px-5 py-2 rounded-lg font-bold transition-all ${
                    activeGame === 'feud'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                      : 'bg-white/20 text-white/60 hover:bg-white/30'
                  }`}
                >
                  Family Feud
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('shoe')}
            className={`px-6 py-3 rounded-t-xl font-bold text-lg transition-all ${
              activeTab === 'shoe'
                ? 'bg-white/25 backdrop-blur-md text-white border-2 border-b-0 border-white/30'
                : 'bg-white/10 text-white/50 hover:bg-white/15 border-2 border-transparent'
            }`}
          >
            Shoe Game
          </button>
          <button
            onClick={() => setActiveTab('feud')}
            className={`px-6 py-3 rounded-t-xl font-bold text-lg transition-all ${
              activeTab === 'feud'
                ? 'bg-white/25 backdrop-blur-md text-white border-2 border-b-0 border-white/30'
                : 'bg-white/10 text-white/50 hover:bg-white/15 border-2 border-transparent'
            }`}
          >
            Family Feud
          </button>
          <button
            onClick={() => setActiveTab('price')}
            className={`px-6 py-3 rounded-t-xl font-bold text-lg transition-all ${
              activeTab === 'price'
                ? 'bg-white/25 backdrop-blur-md text-white border-2 border-b-0 border-white/30'
                : 'bg-white/10 text-white/50 hover:bg-white/15 border-2 border-transparent'
            }`}
          >
            Price is Right
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'shoe' ? (
            <motion.div key="shoe" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ShoeGameTab
                gameState={gameState}
                voteTally={voteTally}
                guestUrl={guestUrl}
                momName={momName}
                dadName={dadName}
                setMomName={setMomName}
                setDadName={setDadName}
                handleSaveNames={handleSaveNames}
                handleToggleQR={handleToggleQR}
                handleSetQuestion={handleSetQuestion}
                handleResetVotes={handleResetVotes}
                handleResetGame={handleResetGame}
                handleAddVote={handleAddVote}
              />
            </motion.div>
          ) : activeTab === 'feud' ? (
            <motion.div key="feud" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <FeudTab
                feudState={feudState}
                currentCategory={currentCategory}
                revealedForCategory={revealedForCategory}
                teamName1={teamName1}
                teamName2={teamName2}
                setTeamName1={setTeamName1}
                setTeamName2={setTeamName2}
                handleSaveTeamNames={handleSaveTeamNames}
                handleSetCategory={handleSetCategory}
                handleRevealAnswer={handleRevealAnswer}
                handleMarkWrong={handleMarkWrong}
                handleSwitchTeam={handleSwitchTeam}
                handleResetStrikes={handleResetStrikes}
                handleToggleStealMode={handleToggleStealMode}
                handleBankRound={handleBankRound}
                handleResetFeud={handleResetFeud}
              />
            </motion.div>
          ) : (
            <motion.div key="price" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <PriceIsRightTab showPrices={showPrices} handleTogglePrices={handleTogglePrices} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Presentation Link — always visible */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-6 bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-xl font-bold text-white mb-4">Presentation Mode</h2>
          <Link href="/presentation" target="_blank">
            <button className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-bold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg">
              Open Presentation View
            </button>
          </Link>
          <p className="mt-3 text-white/60 text-sm text-center">Open this on the big screen for everyone to see!</p>
        </motion.div>
      </div>
    </main>
  );
}

/* ═══════════════════════════════════════════
   Shoe Game Tab (original admin controls)
   ═══════════════════════════════════════════ */

interface ShoeGameTabProps {
  gameState: GameState;
  voteTally: VoteTally;
  guestUrl: string;
  momName: string;
  dadName: string;
  setMomName: (v: string) => void;
  setDadName: (v: string) => void;
  handleSaveNames: () => void;
  handleToggleQR: (show: boolean) => void;
  handleSetQuestion: (index: number) => void;
  handleResetVotes: () => void;
  handleResetGame: () => void;
  handleAddVote: (choice: 'mom' | 'dad') => void;
}

function ShoeGameTab({
  gameState, voteTally, guestUrl, momName, dadName,
  setMomName, setDadName, handleSaveNames, handleToggleQR,
  handleSetQuestion, handleResetVotes, handleResetGame, handleAddVote,
}: ShoeGameTabProps) {
  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Parent Names */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-xl font-bold text-white mb-4">Parent Names</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-white/80 text-sm mb-1">Dad&apos;s Name</label>
              <input type="text" value={dadName} onChange={(e) => setDadName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Dad" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Mom&apos;s Name</label>
              <input type="text" value={momName} onChange={(e) => setMomName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400" placeholder="Mom" />
            </div>
          </div>
          <button onClick={handleSaveNames} className="w-full py-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg text-white font-bold hover:from-green-500 hover:to-emerald-600 transition-all">
            Save Names
          </button>
        </div>

        {/* QR Toggle */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-xl font-bold text-white mb-4">QR Code Display</h2>
          <div className="flex gap-4">
            <button onClick={() => handleToggleQR(true)}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${gameState.showQRCode ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white/20 text-white/60 hover:bg-white/30'}`}>
              Show QR
            </button>
            <button onClick={() => handleToggleQR(false)}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${!gameState.showQRCode ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'bg-white/20 text-white/60 hover:bg-white/30'}`}>
              Show Game
            </button>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-xl font-bold text-white mb-4">Questions</h2>
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <p className="text-sm text-white/60 mb-1">Current Question ({gameState.currentQuestionIndex + 1}/{gameState.questions.length})</p>
            <p className="text-lg text-white font-medium">{currentQuestion}</p>
          </div>
          <div className="flex gap-2 mb-4">
            <button onClick={() => handleSetQuestion(gameState.currentQuestionIndex - 1)} disabled={gameState.currentQuestionIndex === 0}
              className="flex-1 py-3 bg-white/20 rounded-lg text-white font-bold hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Previous
            </button>
            <button onClick={() => handleSetQuestion(gameState.currentQuestionIndex + 1)} disabled={gameState.currentQuestionIndex >= gameState.questions.length - 1}
              className="flex-1 py-3 bg-white/20 rounded-lg text-white font-bold hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Next
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-white/30">
            {gameState.questions.map((q, index) => (
              <button key={index} onClick={() => handleSetQuestion(index)}
                className={`w-full text-left p-3 rounded-lg transition-all ${index === gameState.currentQuestionIndex ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}>
                <span className="font-bold mr-2">{index + 1}.</span>{q}
              </button>
            ))}
          </div>
        </div>

        {/* Reset */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-xl font-bold text-white mb-4">Reset Options</h2>
          <div className="flex gap-4">
            <button onClick={handleResetVotes} className="flex-1 py-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg text-white font-bold hover:from-orange-500 hover:to-red-500 transition-all">Reset Votes</button>
            <button onClick={handleResetGame} className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-700 rounded-lg text-white font-bold hover:from-red-600 hover:to-red-800 transition-all">Reset All</button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* QR Preview */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-xl font-bold text-white mb-4">Guest Join QR</h2>
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl shadow-xl"><QRCodeSVG value={guestUrl} size={180} /></div>
            <p className="mt-4 text-white/80 text-center text-sm break-all">{guestUrl}</p>
          </div>
        </div>

        {/* Live Votes */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-xl font-bold text-white mb-4">Live Votes</h2>
          <VoteSlider tally={voteTally} momName={gameState.momName} dadName={gameState.dadName} momImage="/mom.png" dadImage="/dad.png" />
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm text-white/60 text-center mb-3">Add Manual Votes</p>
            <div className="flex justify-between gap-4">
              <button onClick={() => handleAddVote('dad')} className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2">
                <span>+1</span><span>{gameState.dadName}</span>
              </button>
              <button onClick={() => handleAddVote('mom')} className="flex-1 py-2 px-4 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg text-white font-bold hover:from-pink-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2">
                <span>+1</span><span>{gameState.momName}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Family Feud Tab
   ═══════════════════════════════════════════ */

interface FeudTabProps {
  feudState: FeudState;
  currentCategory: FeudState['categories'][number];
  revealedForCategory: number[];
  teamName1: string;
  teamName2: string;
  setTeamName1: (v: string) => void;
  setTeamName2: (v: string) => void;
  handleSaveTeamNames: () => void;
  handleSetCategory: (index: number) => void;
  handleRevealAnswer: (categoryId: string, answerIndex: number, awardPoints?: boolean) => void;
  handleMarkWrong: () => void;
  handleSwitchTeam: () => void;
  handleResetStrikes: () => void;
  handleToggleStealMode: () => void;
  handleBankRound: () => void;
  handleResetFeud: () => void;
}

function FeudTab({
  feudState, currentCategory, revealedForCategory,
  teamName1, teamName2, setTeamName1, setTeamName2,
  handleSaveTeamNames, handleSetCategory, handleRevealAnswer,
  handleMarkWrong, handleSwitchTeam, handleResetStrikes,
  handleToggleStealMode, handleBankRound, handleResetFeud,
}: FeudTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Team Names */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-xl font-bold text-white mb-4">Team Names</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-white/80 text-sm mb-1">Team 1</label>
              <input type="text" value={teamName1} onChange={(e) => setTeamName1(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Team 1" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Team 2</label>
              <input type="text" value={teamName2} onChange={(e) => setTeamName2(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Team 2" />
            </div>
          </div>
          <button onClick={handleSaveTeamNames} className="w-full py-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg text-white font-bold hover:from-green-500 hover:to-emerald-600 transition-all">
            Save Names
          </button>
        </div>

        {/* Active Team + Strikes */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-xl font-bold text-white mb-4">Active Team</h2>
          <div className="flex gap-4 mb-4">
            <div className={`flex-1 text-center py-3 rounded-lg font-bold text-lg transition-all ${feudState.activeTeam === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ring-2 ring-white' : 'bg-white/10 text-white/50'}`}>
              {feudState.teamNames[0]}
            </div>
            <div className={`flex-1 text-center py-3 rounded-lg font-bold text-lg transition-all ${feudState.activeTeam === 2 ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white ring-2 ring-white' : 'bg-white/10 text-white/50'}`}>
              {feudState.teamNames[1]}
            </div>
          </div>
          <button onClick={handleSwitchTeam} className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-bold hover:from-purple-600 hover:to-pink-600 transition-all">
            Switch Team
          </button>

          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold">Strikes</span>
              <button onClick={handleResetStrikes} className="text-sm text-white/60 hover:text-white transition-all">Clear</button>
            </div>
            <div className="flex gap-3 justify-center">
              {[0, 1, 2].map(i => (
                <span key={i} className={`text-4xl transition-all ${i < feudState.strikes ? 'opacity-100' : 'opacity-20'}`}>
                  ✕
                </span>
              ))}
            </div>
            <button onClick={handleMarkWrong} disabled={feudState.strikes >= 3}
              className="w-full mt-3 py-3 bg-gradient-to-r from-red-500 to-red-700 rounded-lg text-white font-bold hover:from-red-600 hover:to-red-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Mark Wrong
            </button>
          </div>
        </div>

        {/* Category Selector */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-xl font-bold text-white mb-4">Categories</h2>
          <div className="space-y-2">
            {feudState.categories.map((cat, index) => {
              const revealed = feudState.revealedAnswers[cat.id] || [];
              return (
                <button key={cat.id} onClick={() => handleSetCategory(index)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${index === feudState.currentCategoryIndex ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}>
                  <span className="font-bold mr-2">{index + 1}.</span>
                  {cat.title}
                  <span className="ml-2 text-sm opacity-70">({revealed.length}/{cat.answers.length})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-xl font-bold text-white mb-4">Reset</h2>
          <button onClick={handleResetFeud} className="w-full py-3 bg-gradient-to-r from-red-500 to-red-700 rounded-lg text-white font-bold hover:from-red-600 hover:to-red-800 transition-all">
            Reset Family Feud
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Scoreboard */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-xl font-bold text-white mb-4">Scoreboard</h2>

          {/* Round Points */}
          <p className="text-white/60 text-xs uppercase tracking-wide mb-2">This Round</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`text-center p-3 rounded-xl ${feudState.activeTeam === 1 ? 'bg-blue-500/30 ring-2 ring-blue-400' : 'bg-white/10'}`}>
              <p className="text-white/70 text-xs mb-1">{feudState.teamNames[0]}</p>
              <p className="text-3xl font-bold text-white">{feudState.roundPoints[0]}</p>
            </div>
            <div className={`text-center p-3 rounded-xl ${feudState.activeTeam === 2 ? 'bg-orange-500/30 ring-2 ring-orange-400' : 'bg-white/10'}`}>
              <p className="text-white/70 text-xs mb-1">{feudState.teamNames[1]}</p>
              <p className="text-3xl font-bold text-white">{feudState.roundPoints[1]}</p>
            </div>
          </div>

          {/* Steal Mode + Bank Round */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleToggleStealMode}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                feudState.stealMode
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white ring-2 ring-red-300 animate-pulse'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {feudState.stealMode ? 'STEAL MODE ON' : 'Steal Mode'}
            </button>
            <button
              onClick={handleBankRound}
              disabled={feudState.roundPoints[0] === 0 && feudState.roundPoints[1] === 0}
              className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg text-white font-bold text-sm hover:from-emerald-600 hover:to-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Bank Round
            </button>
          </div>

          {/* Total Scores */}
          <div className="border-t border-white/20 pt-4">
            <p className="text-white/60 text-xs uppercase tracking-wide mb-2">Total Score</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-xl bg-white/5">
                <p className="text-white/70 text-xs mb-1">{feudState.teamNames[0]}</p>
                <p className="text-2xl font-bold text-white">{feudState.scores[0]}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <p className="text-white/70 text-xs mb-1">{feudState.teamNames[1]}</p>
                <p className="text-2xl font-bold text-white">{feudState.scores[1]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Board */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-xl font-bold text-white mb-2">Answers</h2>
          <p className="text-white/60 text-sm mb-4">{currentCategory.title}</p>
          <div className="space-y-2">
            {currentCategory.answers.map((answer, index) => {
              const isRevealed = revealedForCategory.includes(index);
              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-white/60 font-bold w-6 text-right">{index + 1}.</span>
                  <div className={`flex-1 flex items-center justify-between rounded-lg px-4 py-2 ${isRevealed ? 'bg-green-500/30 border border-green-400/50' : 'bg-white/10 border border-white/20'}`}>
                    <span className="text-white font-medium">{answer.text}</span>
                    <span className={`font-bold ${isRevealed ? 'text-green-300' : 'text-white/60'}`}>{answer.points} pts</span>
                  </div>
                  {!isRevealed && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleRevealAnswer(currentCategory.id, index, true)}
                        className="px-3 py-2 bg-green-500/30 border border-green-400/30 rounded-lg text-green-300 text-sm font-bold hover:bg-green-500/50 transition-all whitespace-nowrap"
                        title="Reveal and award points to active team"
                      >
                        +Pts
                      </button>
                      <button
                        onClick={() => handleRevealAnswer(currentCategory.id, index, false)}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/60 text-sm font-bold hover:bg-white/20 transition-all whitespace-nowrap"
                        title="Reveal without awarding points"
                      >
                        Show
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Price is Right Tab
   ═══════════════════════════════════════════ */

interface PriceIsRightTabProps {
  showPrices: boolean;
  handleTogglePrices: (show: boolean) => void;
}

function PriceIsRightTab({ showPrices, handleTogglePrices }: PriceIsRightTabProps) {
  return (
    <div className="max-w-lg">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30">
        <h2 className="text-xl font-bold text-white mb-4">Price Display</h2>
        <p className="text-white/60 text-sm mb-4">Toggle whether prices are visible on the Price is Right page.</p>
        <div className="flex gap-4">
          <button
            onClick={() => handleTogglePrices(true)}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${
              showPrices
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                : 'bg-white/20 text-white/60 hover:bg-white/30'
            }`}
          >
            Show Prices
          </button>
          <button
            onClick={() => handleTogglePrices(false)}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${
              !showPrices
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white/20 text-white/60 hover:bg-white/30'
            }`}
          >
            Hide Prices
          </button>
        </div>
      </div>
    </div>
  );
}
