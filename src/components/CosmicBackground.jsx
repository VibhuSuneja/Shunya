import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function CosmicBackground() {
  // Generate random stars with varying sizes, positions, and animation timings
  const stars = useMemo(() => Array.from({ length: 70 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 6 + 4
  })), []);

  return (
    <motion.div 
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 8, ease: "easeInOut" }}
    >
      {/* Deep cosmic gradient that fades in, mapping to the cosmic-indigo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--cosmic-indigo)_0%,_transparent_70%)] opacity-20 mix-blend-screen" />
       
      {/* Bioluminescent nebulae glow */}
      <motion.div 
        className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_70%,_var(--bio-teal)_0%,_transparent_40%)]"
        animate={{
          opacity: [0.05, 0.15, 0.05],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_30%,_var(--bio-teal)_0%,_transparent_40%)]"
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          delay: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

       {/* Starfield */}
       {stars.map((star, i) => (
         <motion.div
           key={i}
           className="absolute rounded-full bg-[var(--parchment)] opacity-50"
           style={{
             left: `${star.x}%`,
             top: `${star.y}%`,
             width: `${star.size}px`,
             height: `${star.size}px`,
             boxShadow: `0 0 ${star.size * 2}px var(--bio-teal)`
           }}
           animate={{
             opacity: [0.1, 0.6, 0.1],
             scale: [0.8, 1.2, 0.8]
           }}
           transition={{
             duration: star.duration,
             repeat: Infinity,
             delay: star.delay,
             ease: "easeInOut"
           }}
         />
       ))}
    </motion.div>
  );
}
