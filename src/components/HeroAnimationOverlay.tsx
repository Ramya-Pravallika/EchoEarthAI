import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Sun, Sunset, Trees, CloudRain, CheckCircle, Navigation, Heart } from "lucide-react";

interface HeroAnimationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isTwilightMode: boolean;
}

const STEPS = [
  {
    id: "gray_world",
    emoji: "🌫️",
    title: "The Industrial Dawn",
    description: "The world starts under the weight of accumulated carbon. Haze hangs over static, dry grasslands.",
    bgColor: "from-stone-800 to-slate-900",
    particle: "💨",
  },
  {
    id: "growing_trees",
    emoji: "🌱",
    title: "Seeds of Change",
    description: "Your very first environmental commitments take physical root. Tiny seedlings burst through the stone.",
    bgColor: "from-stone-700 via-emerald-900 to-slate-900",
    particle: "🌿",
  },
  {
    id: "blue_sky",
    emoji: "☀️",
    title: "Clearing Canopy",
    description: "The thick smog clears, revealing high-altitude blue air and brilliant golden warmth.",
    bgColor: "from-sky-700 via-emerald-800 to-sky-900",
    particle: "✨",
  },
  {
    id: "butterflies",
    emoji: "🦋",
    title: "Return of Joy",
    description: "Graceful, interactive Monarch butterflies dance through the wild garden, riding solar thermal currents.",
    bgColor: "from-sky-600 via-emerald-700 to-teal-900",
    particle: "🌸",
  },
  {
    id: "wildlife",
    emoji: "🦌",
    title: "Thriving Biodiversity",
    description: "Woodland animals return to live safely in the thriving, fresh virtual biome.",
    bgColor: "from-sky-500 via-emerald-600 to-green-950",
    particle: "🥕",
  },
  {
    id: "sunlight",
    emoji: "🌤️",
    title: "The Radiant Garden",
    description: "Perfect golden sunlight streams through dense leaves, bringing ultimate vitality to every crevice.",
    bgColor: "from-amber-600 via-emerald-600 to-green-900",
    particle: "☀️",
  },
];

export default function HeroAnimationOverlay({
  isOpen,
  onClose,
  isTwilightMode,
}: HeroAnimationOverlayProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasCompletedSequence, setHasCompletedSequence] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setHasCompletedSequence(false);
      return;
    }

    // Progression timer
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          setHasCompletedSequence(true);
          clearInterval(interval);
          return prev;
        }
      });
    }, 3800); // 3.8 seconds per stunning scene change for maximum absorption

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = STEPS[currentStepIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center p-4 bg-black/95 overflow-hidden">
        
        {/* Dynamic ambient particle storm */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute text-xl md:text-2xl opacity-60"
              initial={{
                x: Math.random() * 1000 - 500,
                y: 800,
                scale: 0.5 + Math.random(),
              }}
              animate={{
                y: -100,
                rotate: 360,
                x: `calc(100vw * ${Math.random()} - 100px)`,
              }}
              transition={{
                duration: 5 + Math.random() * 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {currentStep?.particle || "✨"}
            </motion.div>
          ))}
        </div>

        {/* Content Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl text-center space-y-8 z-10 p-6 md:p-10"
        >
          {/* Animated colorful environment card */}
          <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-gradient-to-br from-slate-900 to-black flex flex-col items-center justify-center p-6 text-center">
            
            {/* Morphing color overlay background based on current visual stage */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-tr ${currentStep?.bgColor} transition-all duration-1000 opacity-80`}
            />

            {/* Giant morphing emoji visualization */}
            <motion.div
              key={currentStep?.id}
              initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ type: "spring", damping: 12 }}
              className="text-8xl md:text-9xl mb-4 text-center block z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-default select-none"
            >
              {currentStep?.emoji}
            </motion.div>

            {/* Stage indicator label */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 items-center bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 text-[9px] uppercase font-mono tracking-widest text-stone-200">
              <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" />
              Ecosystem Status: {currentStep?.title}
            </div>
          </div>

          {/* Stepper info texts with staggered entrances */}
          <div className="space-y-4 max-w-xl mx-auto">
            <motion.h4
              key={`title-${currentStep?.id}`}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl md:text-3xl font-black text-white tracking-tight"
            >
              {currentStep?.title}
            </motion.h4>

            <motion.p
              key={`desc-${currentStep?.id}`}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-sm md:text-base font-serif text-slate-350 leading-relaxed text-stone-300"
            >
              {currentStep?.description}
            </motion.p>
          </div>

          {/* Core Vision Prophecy Message Overlay */}
          <AnimatePresence>
            {hasCompletedSequence && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-900/60 to-emerald-800/20 border border-emerald-500/30 shadow-xl max-w-xl mx-auto space-y-4"
              >
                <div className="flex justify-center">
                  <span className="text-4xl">🌎</span>
                </div>
                <blockquote className="text-lg md:text-xl font-bold font-serif italic text-emerald-200 tracking-tight leading-normal">
                  &ldquo;Your future is not fixed. Every sustainable decision changes the world around you.&rdquo;
                </blockquote>
                <p className="text-xs text-stone-300 uppercase tracking-widest font-mono font-extrabold max-w-xs mx-auto">
                  ⚡ ECHOEARTH AI BIOME PROPHECY ⚡
                </p>

                <div className="pt-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                    className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-stone-950 font-black tracking-wider text-xs uppercase rounded-full shadow-lg transition-all focus:outline-none cursor-pointer"
                  >
                    Enter My Biome Garden ✦
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress dots at bottom */}
          <div className="flex justify-center gap-1.5 pt-2">
            {STEPS.map((step, idx) => (
              <div
                key={`hero-dot-${step.id}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentStepIndex
                    ? "w-8 bg-amber-400"
                    : idx < currentStepIndex
                    ? "w-2 bg-emerald-500"
                    : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>

          {/* Skip option */}
          {!hasCompletedSequence && (
            <div>
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-white text-xs font-mono tracking-widest uppercase cursor-pointer transition-all"
              >
                Skip prophecy introduction [ESC]
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
