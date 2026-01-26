'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { VoteTally } from '@/types/game';
import { useState, useEffect, useRef, useMemo } from 'react';

interface PersistedFish {
  id: string;
  color: string;
  xOffset: number;
  yOffset: number;
  floatDelay: number;
  scale: number;
}

const FISH_COLORS = ['#FFB347', '#FF6B9D', '#87CEEB', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F1948A'];

// Generate a deterministic but varied position for each fish in the school
function generateFishPosition(index: number, total: number): { x: number; y: number; scale: number } {
  // Create a school formation - fish spread out more as count increases
  const row = Math.floor(index / 4);
  const col = index % 4;
  const baseX = -20 - (col * 25) - (row * 10);
  const baseY = -60 + (row * 35) + ((col % 2) * 15);
  
  // Add some randomness based on index
  const seed = index * 137.5;
  const randomX = Math.sin(seed) * 15;
  const randomY = Math.cos(seed) * 10;
  
  return {
    x: baseX + randomX,
    y: baseY + randomY,
    scale: 0.7 + (Math.sin(seed * 2) * 0.2),
  };
}

interface VoteSliderProps {
  tally: VoteTally;
  momName: string;
  dadName: string;
  momImage?: string;
  dadImage?: string;
  size?: 'normal' | 'large';
}

export function VoteSlider({ 
  tally, 
  momName, 
  dadName, 
  momImage,
  dadImage,
  size = 'normal' 
}: VoteSliderProps) {
  const isLarge = size === 'large';
  const [momFish, setMomFish] = useState<PersistedFish[]>([]);
  const [dadFish, setDadFish] = useState<PersistedFish[]>([]);
  const prevTallyRef = useRef({ mom: 0, dad: 0 });
  
  // Fixed height for admin (normal) mode
  const fixedHeight = 100;
  
  // For presentation (large) mode
  const maxPresentationHeight = 350;
  const minPresentationHeight = 80;
  
  const momRatio = (tally.mom + 1) / (tally.total + 2);
  const dadRatio = (tally.dad + 1) / (tally.total + 2);
  
  const momPresentationHeight = minPresentationHeight + momRatio * (maxPresentationHeight - minPresentationHeight);
  const dadPresentationHeight = minPresentationHeight + dadRatio * (maxPresentationHeight - minPresentationHeight);
  
  const finalMomHeight = isLarge ? momPresentationHeight : fixedHeight;
  const finalDadHeight = isLarge ? dadPresentationHeight : fixedHeight;

  // Generate fish schools based on vote counts
  useEffect(() => {
    if (!isLarge) return;
    
    // Update mom's fish school
    const newMomCount = tally.mom;
    const currentMomCount = momFish.length;
    
    if (newMomCount > currentMomCount) {
      // Add new fish
      const newFish: PersistedFish[] = [];
      for (let i = currentMomCount; i < newMomCount; i++) {
        const pos = generateFishPosition(i, newMomCount);
        newFish.push({
          id: `mom-${i}-${Date.now()}`,
          color: FISH_COLORS[i % FISH_COLORS.length],
          xOffset: pos.x,
          yOffset: pos.y,
          floatDelay: Math.random() * 2,
          scale: pos.scale,
        });
      }
      setMomFish(prev => [...prev, ...newFish]);
    } else if (newMomCount < currentMomCount) {
      // Remove excess fish (votes were reset)
      setMomFish(prev => prev.slice(0, newMomCount));
    }
    
    // Update dad's fish school
    const newDadCount = tally.dad;
    const currentDadCount = dadFish.length;
    
    if (newDadCount > currentDadCount) {
      const newFish: PersistedFish[] = [];
      for (let i = currentDadCount; i < newDadCount; i++) {
        const pos = generateFishPosition(i, newDadCount);
        newFish.push({
          id: `dad-${i}-${Date.now()}`,
          color: FISH_COLORS[i % FISH_COLORS.length],
          xOffset: pos.x,
          yOffset: pos.y,
          floatDelay: Math.random() * 2,
          scale: pos.scale,
        });
      }
      setDadFish(prev => [...prev, ...newFish]);
    } else if (newDadCount < currentDadCount) {
      setDadFish(prev => prev.slice(0, newDadCount));
    }
    
    prevTallyRef.current = { mom: tally.mom, dad: tally.dad };
  }, [tally.mom, tally.dad, isLarge]);

  // Fish SVG component
  const FishSvg = ({ color, flip = false }: { color: string; flip?: boolean }) => (
    <svg 
      viewBox="0 0 80 50" 
      className="w-10 h-6 md:w-12 md:h-8"
      style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
    >
      <ellipse cx="35" cy="25" rx="25" ry="15" fill={color} />
      <path d="M60,25 L75,10 L75,40 Z" fill={color} />
      <circle cx="22" cy="22" r="5" fill="white" />
      <circle cx="23" cy="23" r="2.5" fill="#333" />
      <path d="M35,10 Q40,5 45,12" fill="none" stroke={color} strokeWidth="4" />
    </svg>
  );

  return (
    <div className={`w-full ${isLarge ? 'max-w-4xl' : 'max-w-xl'} mx-auto px-4 relative`}>
      {/* Parent avatars with vote counts - fixed layout */}
      <div className="flex justify-between items-end mb-4">
        {/* Dad side (left) */}
        <div className="flex flex-col items-center flex-1 relative">
          {/* Dad's fish school - positioned to the left of dad */}
          {isLarge && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: 5 }}>
              <AnimatePresence>
                {dadFish.map((fish, index) => (
                  <motion.div
                    key={fish.id}
                    className="absolute"
                    initial={{ 
                      x: -200,
                      y: fish.yOffset,
                      opacity: 0,
                      scale: 0.3,
                    }}
                    animate={{ 
                      x: fish.xOffset,
                      y: [fish.yOffset - 5, fish.yOffset + 5, fish.yOffset - 5],
                      opacity: 1,
                      scale: fish.scale,
                    }}
                    transition={{ 
                      x: { duration: 0.8, ease: 'easeOut' },
                      y: { duration: 2 + fish.floatDelay, repeat: Infinity, ease: 'easeInOut' },
                      opacity: { duration: 0.5 },
                      scale: { duration: 0.8, ease: 'easeOut' },
                    }}
                  >
                    <FishSvg color={fish.color} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          <motion.div
            className="relative flex items-end justify-center z-10"
            animate={{ height: finalDadHeight }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ height: finalDadHeight }}
          >
            {dadImage ? (
              <img 
                src={dadImage} 
                alt={dadName} 
                className="h-full w-auto object-contain drop-shadow-lg" 
              />
            ) : (
              <div 
                className="h-full aspect-square rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-4 border-white shadow-xl"
              >
                <span className={`${isLarge ? 'text-5xl' : 'text-3xl'}`}>👨</span>
              </div>
            )}
          </motion.div>
          <motion.p 
            className={`mt-2 font-bold ${isLarge ? 'text-2xl md:text-3xl' : 'text-lg'} text-white drop-shadow-lg`}
          >
            {dadName}
          </motion.p>
          <motion.p 
            className={`font-bold ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl'} text-yellow-300 drop-shadow-lg`}
            key={tally.dad}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {tally.dad} votes
          </motion.p>
        </div>

        {/* Center spacer */}
        <div className="flex-shrink-0 w-4" />

        {/* Mom side (right) */}
        <div className="flex flex-col items-center flex-1 relative">
          {/* Mom's fish school - positioned to the right of mom */}
          {isLarge && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: 5 }}>
              <AnimatePresence>
                {momFish.map((fish, index) => (
                  <motion.div
                    key={fish.id}
                    className="absolute"
                    initial={{ 
                      x: 200,
                      y: fish.yOffset,
                      opacity: 0,
                      scale: 0.3,
                    }}
                    animate={{ 
                      x: -fish.xOffset, // Flip x for mom's side
                      y: [fish.yOffset - 5, fish.yOffset + 5, fish.yOffset - 5],
                      opacity: 1,
                      scale: fish.scale,
                    }}
                    transition={{ 
                      x: { duration: 0.8, ease: 'easeOut' },
                      y: { duration: 2 + fish.floatDelay, repeat: Infinity, ease: 'easeInOut' },
                      opacity: { duration: 0.5 },
                      scale: { duration: 0.8, ease: 'easeOut' },
                    }}
                  >
                    <FishSvg color={fish.color} flip={true} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          <motion.div
            className="relative flex items-end justify-center z-10"
            animate={{ height: finalMomHeight }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ height: finalMomHeight }}
          >
            {momImage ? (
              <img 
                src={momImage} 
                alt={momName} 
                className="h-full w-auto object-contain drop-shadow-lg" 
              />
            ) : (
              <div 
                className="h-full aspect-square rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center border-4 border-white shadow-xl"
              >
                <span className={`${isLarge ? 'text-5xl' : 'text-3xl'}`}>👩</span>
              </div>
            )}
          </motion.div>
          <motion.p 
            className={`mt-2 font-bold ${isLarge ? 'text-2xl md:text-3xl' : 'text-lg'} text-white drop-shadow-lg`}
          >
            {momName}
          </motion.p>
          <motion.p 
            className={`font-bold ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl'} text-yellow-300 drop-shadow-lg`}
            key={tally.mom}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {tally.mom} votes
          </motion.p>
        </div>
      </div>

      {/* Slider bar */}
      <div className={`relative ${isLarge ? 'h-10 md:h-12' : 'h-6 md:h-8'} bg-white/30 rounded-full overflow-hidden backdrop-blur-sm border-2 border-white/50`}>
        {/* Dad side (blue, from left) */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500 to-blue-400"
          animate={{ width: `${tally.dadPercentage}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
        
        {/* Mom side (pink, from right) */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-pink-500 to-pink-400"
          animate={{ width: `${tally.momPercentage}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />

        {/* Center indicator */}
        <motion.div
          className={`absolute top-1/2 -translate-y-1/2 ${isLarge ? 'w-8 h-8 md:w-10 md:h-10' : 'w-6 h-6'} bg-white rounded-full shadow-lg border-2 border-yellow-400 flex items-center justify-center z-10`}
          animate={{ left: `${tally.dadPercentage}%`, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <span className={isLarge ? 'text-base md:text-lg' : 'text-sm'}>⚖️</span>
        </motion.div>

        {/* Percentage labels */}
        <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none">
          <motion.span 
            className={`${isLarge ? 'text-base md:text-xl' : 'text-sm'} font-bold text-white drop-shadow-md`}
            animate={{ opacity: tally.dadPercentage > 15 ? 1 : 0 }}
          >
            {Math.round(tally.dadPercentage)}%
          </motion.span>
          <motion.span 
            className={`${isLarge ? 'text-base md:text-xl' : 'text-sm'} font-bold text-white drop-shadow-md`}
            animate={{ opacity: tally.momPercentage > 15 ? 1 : 0 }}
          >
            {Math.round(tally.momPercentage)}%
          </motion.span>
        </div>
      </div>

      {/* Total votes */}
      <motion.p 
        className={`text-center mt-3 ${isLarge ? 'text-lg md:text-xl' : 'text-base'} text-white/80`}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {tally.total} total votes
      </motion.p>
    </div>
  );
}
