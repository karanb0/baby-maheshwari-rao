'use client';

import { useState, useEffect, useCallback } from 'react';
import { SeaBackground } from '@/components/SeaCreatures';

const ITEMS = [
  {
    title: 'Baby Bathtub',
    description: 'Collapsible Newborn Bathtub',
    src: '/price-is-right/baby-bathtub.png',
    price: '$36.99'
  },
  {
    title: 'Diaper Pail',
    description: 'Ubbi Steel Diaper Pail',
    src: '/price-is-right/diaper-pail.png',
    price: '$67.99'

  },
  {
    title: 'Car Seat',
    description: 'Graco Extend2Fit Car Seat',
    src: '/price-is-right/car-seat.png',
    price: '$174.99'

  },
  {
    title: 'Playpen',
    description: '50x50 Baby Playpen',
    src: '/price-is-right/playpen.png',
    price: '$44.99'
  },
  {
    title: 'Bottle Warmer',
    description: 'Philips Avent Bottle Warmer',
    src: '/price-is-right/bottle-warmer.png',
    price: '$49.95'
  },
  {
    title: 'Baby Sound Machine',
    description: 'Hatch Rest Baby Sound Machine',
    src: '/price-is-right/baby-sound-machine.png',
    price: '$69.99'
  },
  {
    title: 'Baby Monitor',
    description: 'VTech Video Baby Monitor',
    src: '/price-is-right/baby-monitor.png',
    price: '$39.95'
  },
  {
    title: 'Bottle Dishwasher',
    description: 'Momcozy KleanPal Pro Baby Bottle Washer',
    src: '/price-is-right/bottle-dishwasher.png',
    price: '$299.99'
  },
  {
    title: 'Baby Formula',
    description: 'Similac Ready-to-Feed 12-Pack',
    src: '/price-is-right/baby-formula.png',
    price: '$9.88'
  },
  {
    title: 'Smart Bassinet',
    description: 'SNOO Smart Sleeper Baby Bassinet',
    src: '/price-is-right/smart-bassinet.png',
    price: '$1,695.00'
  },
];

export default function PriceIsRightPage() {
  const [showPrices, setShowPrices] = useState(false);

  const fetchShowPrices = useCallback(async () => {
    try {
      const res = await fetch('/api/price-is-right');
      const data = await res.json();
      setShowPrices(data.showPrices);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchShowPrices();
    const interval = setInterval(fetchShowPrices, 2000);
    return () => clearInterval(interval);
  }, [fetchShowPrices]);

  return (
    <main className="relative min-h-screen overflow-x-hidden overflow-y-auto">
      <SeaBackground />
      <div className="relative z-10 flex flex-col items-center min-h-screen py-8 px-4 pb-20">
        <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg mt-4 mb-8 text-center">
          🎯 Price is Right 🎯
        </h1>
        <div className="w-full max-w-lg flex flex-col gap-12">
          {ITEMS.map((item) => (
            <section
              key={item.src}
              className="flex flex-col items-center"
            >
              <h2 className="text-xl md:text-3xl font-bold text-white drop-shadow-md text-center mb-1 px-2">
                {item.title}
              </h2>
              <p className="text-sm md:text-base text-white/90 drop-shadow text-center mb-4 px-2">
                {item.description}
              </p>
              <div className="relative w-full rounded-2xl overflow-hidden bg-white/15 backdrop-blur-sm border-2 border-white/30 shadow-xl aspect-[4/3] max-h-[70vh]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              {showPrices && (
                <div className="mt-3 px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg">
                  <span className="text-white font-bold text-lg md:text-2xl drop-shadow">{item.price}</span>
                </div>
              )}
            </section>
          ))}
          {showPrices && (
            <div className="mt-3 px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg text-center">
              <span className="text-white font-bold text-xl md:text-2xl drop-shadow">Total: $2489.72</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
