import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  isLoading: boolean;
  onAnimationComplete: () => void;
}

const SplashScreen = ({ isLoading, onAnimationComplete }: SplashScreenProps) => {
  const [stage, setStage] = useState<"initial" | "reveal" | "exit">("initial");

  useEffect(() => {
    // Stage 1: Reveal "VINCERE"
    const timer1 = setTimeout(() => {
      setStage("reveal");
    }, 500);

    return () => clearTimeout(timer1);
  }, []);

  useEffect(() => {
    // Wait for video to be ready AND for the text to have been revealed
    if (!isLoading && stage === "reveal") {
      const timer2 = setTimeout(() => {
        setStage("exit");
        // Final fade out of the entire overlay
        setTimeout(onAnimationComplete, 800);
      }, 1200); // Duration to keep the text visible
      return () => clearTimeout(timer2);
    }
  }, [isLoading, stage, onAnimationComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]">
      <div className="relative overflow-hidden py-4 px-8">
        <AnimatePresence mode="wait">
          {stage !== "exit" && (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 20 }}
              animate={stage === "reveal" ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center justify-center font-display"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-[0.3em] text-white uppercase">
                Vincere
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic underline/loading bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={stage === "reveal" ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent origin-center"
        />
      </div>

      {/* Subtle background glow */}
      <motion.div 
        animate={{ 
          opacity: [0.05, 0.1, 0.05],
          scale: [1, 1.1, 1]
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"
      />
    </div>
  );
};

export default SplashScreen;
