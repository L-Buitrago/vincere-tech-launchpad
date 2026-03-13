import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  isLoading: boolean;
  onAnimationComplete: () => void;
}

const SplashScreen = ({ isLoading, onAnimationComplete }: SplashScreenProps) => {
  const [showText, setShowText] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    // Stage 1: Show the V logo
    const timer1 = setTimeout(() => {
      // Stage 2: Animate text completion once video is "ready enough" or after a delay
      setShowText(true);
    }, 1500);

    return () => clearTimeout(timer1);
  }, []);

  useEffect(() => {
    if (!isLoading && showText) {
      // Stage 3: Finish and exit
      const timer2 = setTimeout(() => {
        setIsFinishing(true);
        setTimeout(onAnimationComplete, 1000); // Give time for the fade out
      }, 1000);
      return () => clearTimeout(timer2);
    }
  }, [isLoading, showText, onAnimationComplete]);

  return (
    <AnimatePresence>
      {!isFinishing && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]"
        >
          <div className="relative flex items-center justify-center">
            {/* The V Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, filter: "brightness(0)" }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                filter: "brightness(1)",
                x: showText ? -70 : 0 
              }}
              transition={{ 
                duration: 1.2, 
                ease: [0.22, 1, 0.36, 1],
                x: { duration: 0.8, ease: "easeInOut" }
              }}
              className="z-10"
            >
              <img 
                src="/logo-v.png" 
                alt="V Logo" 
                className="w-24 h-24 md:w-32 md:h-32 object-contain"
                onError={(e) => {
                  // Fallback to text if image not found
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {!document.querySelector('img[src="/logo-v.png"]') && (
                <span className="text-6xl md:text-8xl font-bold text-white font-display">V</span>
              )}
            </motion.div>

            {/* The "incere" text */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  initial={{ opacity: 0, x: -20, clipPath: "inset(0 100% 0 0)" }}
                  animate={{ opacity: 1, x: 50, clipPath: "inset(0 0% 0 0)" }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="absolute left-0 text-white font-display text-4xl md:text-6xl font-bold tracking-tighter"
                >
                  incere
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading Indicator (Subtle) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoading ? 0.3 : 0 }}
              className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <div className="w-48 h-[1px] bg-white/10 overflow-hidden">
                <motion.div 
                   animate={{ x: ["-100%", "100%"] }}
                   transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                   className="w-1/2 h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                />
              </div>
              <span className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Otimizando Experiência</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
