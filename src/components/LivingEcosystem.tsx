import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CloudSun, CloudRain, Sun, Moon, Wind, ShieldAlert, Sparkles } from "lucide-react";

interface LivingEcosystemProps {
  score: number; // estimated annual CO2 metric tons
  points: number; // eco-vitality reward points
  adoptedCount: number; // count of adopted actions
  completedMissionsCount: number; // count of completed missions
  isSimulation?: boolean; // is this showing a futuristic projection?
  reducedMotion?: boolean;
  isTwilightMode?: boolean; // Elegant Dark mode simulation
}

interface InteractionRipple {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

export default function LivingEcosystem({
  score,
  points,
  adoptedCount,
  completedMissionsCount,
  isSimulation = false,
  reducedMotion = false,
  isTwilightMode = false,
}: LivingEcosystemProps) {
  const isHealthy = score <= 6;
  const isCritical = score > 12;

  // Real-time custom simulation overrides for user play
  const [activeWeatherMode, setActiveWeatherMode] = useState<"auto" | "breeze" | "cleansing_rain" | "industrial_smog" | "aurora">("auto");
  const [ripples, setRipples] = useState<InteractionRipple[]>([]);
  const rippleCounter = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine current active weather configuration based on auto setting or manual selection
  const weather = activeWeatherMode === "auto"
    ? isHealthy
      ? "breeze"
      : isCritical
      ? "industrial_smog"
      : isTwilightMode
      ? "aurora"
      : "cleansing_rain"
    : activeWeatherMode;

  // Sky Gradients correspond to weather states
  const getSkyGradient = () => {
    switch (weather) {
      case "breeze":
        return "from-[#B3E5FC] via-[#E1F5FE] to-[#E8F5E9]"; // Vivid healthy morning
      case "cleansing_rain":
        return "from-[#78909C] via-[#B0BEC5] to-[#CFD8DC]"; // Serene rainy teal gray
      case "industrial_smog":
        return "from-[#FFE0B2] via-[#FFB74D] to-[#E65100]/50"; // Burning industrial gray orange haze
      case "aurora":
      default:
        return "from-[#080E1A] via-[#111A2E] to-[#1E2E4A]"; // Mystical cosmic star canopy
    }
  };

  const getEcosystemTitle = () => {
    if (weather === "breeze") return "Lush Bloom Garden";
    if (weather === "cleansing_rain") return "Cleansing Shower Forest";
    if (weather === "industrial_smog") return "Dimmed Industrial Slum";
    return "Eternal Mystic Aurora Biome";
  };

  // Animals & Flora indicators
  const treeCount = Math.max(1, Math.min(8, Math.floor(adoptedCount * 1.5) + (isHealthy ? 3 : 1)));
  const flowerCount = Math.max(1, Math.min(10, Math.floor(points / 20) + completedMissionsCount * 2));
  
  // Show bunny or bird if score is healthy or points are high
  const showBunny = isHealthy || (points > 120 && score <= 10);
  const showBird = points > 60 && score <= 11;

  // Click handler to produce dynamic leaves or droplets ripples
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Pick random reactive emoji based on current weather
    const emojis = weather === "breeze" ? ["🍃", "🌸", "🦋", "✨"]
      : weather === "cleansing_rain" ? ["💧", "🌧️", "🌈", "🌱"]
      : weather === "industrial_smog" ? ["🌾", "💨", "🛡️", "⚠️"]
      : ["⭐", "✦", "🌌", "🌙"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newRipple: InteractionRipple = {
      id: rippleCounter.current++,
      x,
      y,
      emoji: randomEmoji,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Cleanup ripple after 1.2s
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1200);
  };

  return (
    <div
      ref={containerRef}
      id="living-ecosystem-main"
      className={`relative rounded-2xl overflow-hidden border p-1 transition-all duration-500 shadow-xl select-none ${
        isTwilightMode ? "border-[#232A31] bg-[#0F141C]" : "border-[#E4E2DB] bg-[#FCFAF6]"
      }`}
    >
      {/* Sky Canvas viewport */}
      <div
        id="interactive-canvas-box"
        onClick={handleCanvasClick}
        className={`relative w-full h-[320px] md:h-[380px] rounded-t-xl bg-gradient-to-b ${getSkyGradient()} overflow-hidden cursor-crosshair transition-all duration-1000`}
      >
        
        {/* Dynamic celestial glow (Sun / Crimson Sun / Glowing Moon) */}
        <motion.div
          id="celestial-body"
          className={`absolute top-8 right-12 rounded-full blur-[0.5px] ${
            weather === "aurora"
              ? "w-11 h-11 bg-[#ECEFF1] shadow-[0_0_30px_rgba(255,255,255,0.8),inset_-3px_-3px_0px_#CFD8DC]"
              : weather === "industrial_smog"
              ? "w-14 h-14 bg-red-600 shadow-[0_0_35px_rgba(220,38,38,0.7)]"
              : "w-16 h-16 bg-[#FFF9C4]/90 shadow-[0_0_25px_rgba(251,191,36,0.6)]"
          }`}
          animate={
            reducedMotion
              ? {}
              : {
                  scale: [1, 1.05, 1],
                  y: [0, -3, 0],
                }
          }
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dynamic Aurora Waves in Twilight Mode */}
        {weather === "aurora" && !reducedMotion && (
          <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none">
            <motion.path
              d="M 0,80 Q 80,40 180,90 T 400,60"
              fill="none"
              stroke="url(#auroraGradient1)"
              strokeWidth="35"
              strokeLinecap="round"
              animate={{
                d: [
                  "M 0,80 Q 80,40 180,90 T 400,60",
                  "M 0,60 Q 120,95 240,50 T 400,90",
                  "M 0,80 Q 80,40 180,90 T 400,60"
                ]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="auroraGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Rain particles overlay for Rain Weather */}
        {weather === "cleansing_rain" && !reducedMotion && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={`rain-${i}`}
                className="absolute bg-blue-400/60"
                style={{
                  width: "1.5px",
                  height: "15px",
                  left: `${i * 4}%`,
                  top: `-20px`,
                }}
                animate={{
                  y: ["0px", "410px"],
                  x: ["0px", "-40px"],
                }}
                transition={{
                  duration: 1 + (i % 3) * 0.3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: (i % 5) * 0.15,
                }}
              />
            ))}
          </div>
        )}

        {/* Floating Toxic Smog clouds overlay if Industrial Smog setting is active */}
        {weather === "industrial_smog" && !reducedMotion && (
          <div className="absolute inset-0 pointer-events-none z-10 bg-black/10">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`smog-${i}`}
                className="absolute bg-[#5D4037]/20 rounded-full blur-xl"
                style={{
                  width: "180px",
                  height: "80px",
                  left: `${-50 + i * 110}px`,
                  top: `${40 + (i % 2) * 35}px`,
                }}
                animate={{
                  x: [-30, 30, -30],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        {/* Vector SVG Scenery container */}
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full select-none pointer-events-none"
          preserveAspectRatio="none"
        >
          {/* Distant mountains layout */}
          <path
            d="M-50 210 L80 142 L190 220 L280 152 L450 210 L450 300 L-50 300 Z"
            className={`${
              weather === "aurora"
                ? "fill-[#0E131E]/80"
                : weather === "industrial_smog"
                ? "fill-[#4E342E]"
                : weather === "cleansing_rain"
                ? "fill-[#455A64]/40"
                : "fill-[#2E7D32]/25"
            } transition-colors duration-1000`}
          />
          <path
            d="M-20 225 L120 172 L240 230 L350 162 L420 225 L420 300 L-20 300 Z"
            className={`${
              weather === "aurora"
                ? "fill-[#0A0D14]/90"
                : weather === "industrial_smog"
                ? "fill-[#3E2723]"
                : weather === "cleansing_rain"
                ? "fill-[#37474F]/35"
                : "fill-[#1B5E20]/20"
            } transition-colors duration-1000`}
          />

          {/* Drifting Ambient Clouds */}
          <motion.g
            animate={reducedMotion ? {} : { x: [-30, 380, -30] }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          >
            <path
              d="M20 50 Q28 42 38 48 Q46 38 58 45 Q64 35 74 42 Q82 45 80 55 Z"
              className={weather === "industrial_smog" ? "fill-brown-900/60" : "fill-white/70"}
              opacity={weather === "cleansing_rain" ? 0.4 : 0.8}
            />
          </motion.g>

          <motion.g
            animate={reducedMotion ? {} : { x: [350, -80, 350] }}
            transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
          >
            <path
              d="M50 82 Q56 75 64 79 Q72 70 82 77 Q88 68 96 74 Q106 78 102 87 Z"
              className={weather === "industrial_smog" ? "fill-[#78909C]/80" : "fill-white/60"}
              opacity={0.5}
            />
          </motion.g>

          {/* Glowing fireflies / Sparkles particles */}
          {((weather === "breeze" && isHealthy) || weather === "aurora") && !reducedMotion && (
            <g>
              {[...Array(10)].map((_, idx) => (
                <motion.circle
                  key={`glow-${idx}`}
                  cx={40 + idx * 32 + (idx % 2) * 12}
                  cy={110 + (idx % 3) * 25}
                  r="1.7"
                  fill="#A7F3D0"
                  animate={{
                    y: [0, -14, 0],
                    x: [0, 8, 0],
                    opacity: [0.2, 0.9, 0.2],
                  }}
                  transition={{
                    duration: 3 + (idx % 3) * 1.5,
                    repeat: Infinity,
                    delay: idx * 0.2,
                  }}
                />
              ))}
            </g>
          )}

          {/* Rolling Hills (Ground landscape) */}
          <path
            d="M-40 260 Q120 220 280 250 T440 240 L440 320 L-40 320 Z"
            className={`${
              weather === "aurora" ? "fill-[#0F221B]" :
              weather === "industrial_smog" ? "fill-[#5D4037]" :
              weather === "cleansing_rain" ? "fill-[#2E7D32]/85" :
              "fill-emerald-800"
            } transition-colors duration-1000`}
          />
          <path
            d="M-20 275 Q150 250 320 270 T440 260 L440 320 L-20 320 Z"
            className={`${
              weather === "aurora" ? "fill-[#0B1A14]" :
              weather === "industrial_smog" ? "fill-[#4E342E]" :
              weather === "cleansing_rain" ? "fill-[#1F5E20]/90" :
              "fill-emerald-600"
            } transition-colors duration-1000`}
          />

          {/* Trees Rendering and swaying based on weather winds */}
          {[...Array(treeCount)].map((_, index) => {
            const xPos = 40 + index * 52 + (index % 2) * 12;
            const sizeMultiplier = 0.8 + (index % 3) * 0.12;
            
            // Tree colors based on weather conditions
            const leavesColor = weather === "aurora" ? "fill-teal-800"
              : weather === "industrial_smog" ? "fill-amber-900"
              : "fill-emerald-600";
            const trunkColor = weather === "industrial_smog" ? "fill-[#3E2723]" : "fill-[#5C3A21]";

            // Wind speeds sways
            const maxSway = weather === "cleansing_rain" ? 3 : weather === "breeze" ? 1.5 : 0.5;

            return (
              <g key={`tree-${index}`} className="transition-all duration-700">
                <rect x={xPos + 12} y={235} width={5} height={32} className={trunkColor} />
                <motion.g
                  animate={
                    reducedMotion
                      ? {}
                      : {
                          rotate: [-maxSway, maxSway, -maxSway],
                        }
                  }
                  style={{ originX: `${(xPos + 14.5) / 4}%`, originY: "80%" }}
                  transition={{
                    duration: 3 + (index % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <polygon
                    points={`${xPos + 14.5},${165 * sizeMultiplier} ${xPos + 28},${215 * sizeMultiplier} ${xPos},${215 * sizeMultiplier}`}
                    className={leavesColor}
                  />
                  <polygon
                    points={`${xPos + 14.5},${180 * sizeMultiplier} ${xPos + 25},${225 * sizeMultiplier} ${xPos + 3},${225 * sizeMultiplier}`}
                    className={leavesColor}
                    opacity={0.85}
                  />
                </motion.g>
              </g>
            );
          })}

          {/* Flowers base blooming dynamically */}
          {[...Array(flowerCount)].map((_, index) => {
            const xPos2 = 15 + index * 42 + (index % 3) * 6;
            const yPos2 = 265 + (index % 2) * 10;
            const flowerColors = weather === "aurora"
              ? ["fill-amber-300", "fill-rose-300", "fill-cyan-300", "fill-violet-300"]
              : weather === "industrial_smog"
              ? ["fill-amber-700", "fill-orange-800", "fill-stone-600"]
              : ["fill-amber-400", "fill-rose-500", "fill-indigo-500", "fill-emerald-400"];
            const petalColor = flowerColors[index % flowerColors.length];

            return (
              <g key={`flower-${index}`} className="transition-opacity duration-500">
                <line
                  x1={xPos2}
                  y1={yPos2}
                  x2={xPos2}
                  y2={yPos2 + 10}
                  stroke={weather === "industrial_smog" ? "#78716C" : "#10B981"}
                  strokeWidth="1.2"
                />
                <motion.g
                  transform={`translate(${xPos2}, ${yPos2})`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 120, delay: index * 0.05 }}
                >
                  <circle cx="0" cy="-2.5" r="2" className={petalColor} />
                  <circle cx="-2.5" cy="0" r="2" className={petalColor} />
                  <circle cx="2.5" cy="0" r="2" className={petalColor} />
                  <circle cx="0" cy="2.5" r="2" className={petalColor} />
                  <circle cx="0" cy="0" r="1" className="fill-yellow-250 fill-white" />
                </motion.g>
              </g>
            );
          })}

          {/* Floating Birds representing pure atmospheric health */}
          {showBird && !reducedMotion && (
            <motion.g
              animate={{
                x: [-10, 310, -10],
                y: [70, 100, 70],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path
                d="M 12 10 Q 15 5 18 10 Q 21 5 24 10"
                fill="none"
                stroke={weather === "industrial_smog" ? "#78716C" : "#1F2937"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </motion.g>
          )}
        </svg>

        {/* Dynamic Wildlife: Hop-along Evolving Bunny Rabbit inside the Canvas! */}
        {showBunny && (
          <motion.div
            id="wildlife-bunny"
            className="absolute bottom-16 select-none pointer-events-none text-2xl z-20"
            animate={{
              x: ["10px", "320px", "10px"],
              y: ["0px", "-25px", "0px", "-25px", "0px"],
            }}
            transition={{
              x: { duration: 25, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            🐇
          </motion.div>
        )}

        {/* Dynamic Interactive Ripple Spark Sprays on active coordinate clicks */}
        <AnimatePresence>
          {ripples.map((rip) => (
            <motion.div
              key={rip.id}
              className="absolute text-xl pointer-events-none z-30 select-none font-bold text-center"
              style={{ left: rip.x - 12, top: rip.y - 12 }}
              initial={{ scale: 0, opacity: 1, y: 0 }}
              animate={{ scale: 1.8, opacity: 0, y: -45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              {rip.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Shifting Weather Preset Controllers overlay */}
        <div id="weather-controllers" className="absolute top-3 right-3 flex items-center gap-1.5 p-1 bg-white/70 backdrop-blur-md rounded-xl border border-white/40">
          <span className="text-[9px] font-bold text-slate-800 uppercase px-1.5 hidden md:inline">
            Weather simulation:
          </span>
          {[
            { id: "auto", label: "Auto Match", icon: CloudSun },
            { id: "breeze", label: "Breeze", icon: Sun },
            { id: "cleansing_rain", label: "Rain", icon: CloudRain },
            { id: "industrial_smog", label: "Smog", icon: ShieldAlert },
            { id: "aurora", label: "Aurora", icon: Sparkles },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = activeWeatherMode === mode.id;
            return (
              <button
                key={mode.id}
                id={`btn-weather-${mode.id}`}
                onClick={(e) => {
                  e.stopPropagation(); // prevent canvas click
                  setActiveWeatherMode(mode.id as any);
                }}
                className={`p-1.5 rounded-lg transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-800 hover:bg-black/5"
                }`}
                title={mode.label}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>

        {/* Status indicator bar overlay */}
        <div
          id="ecosystem-stats-pills"
          className={`absolute bottom-3 left-3 right-3 flex justify-between items-center px-4 py-2.5 rounded-xl border text-xs transition-all ${
            isTwilightMode
              ? "bg-[#090D14]/90 border-[#1E252D] text-slate-200"
              : "bg-white/80 border-white/40 text-slate-700 backdrop-blur-md"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">Biome state:</span>
            <span
              className={`font-extrabold uppercase tracking-widest ${
                isHealthy
                  ? "text-emerald-700"
                  : isCritical
                  ? "text-rose-600"
                  : "text-amber-600"
              }`}
            >
              {getEcosystemTitle()}
            </span>
          </div>

          <div className="flex gap-3 font-mono font-bold">
            <span>
              CO₂: <strong>{score.toFixed(1)}t</strong>/yr
            </span>
            <span>
              Vitality: <strong className="text-emerald-600">+{points}</strong>
            </span>
          </div>
        </div>

        {isSimulation && (
          <div
            id="simulation-view-indicator"
            className="absolute top-12 left-3 bg-[#3F51B5] text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white block" />
            Foresight Preview
          </div>
        )}
      </div>

      {/* Caption footer label */}
      <div
        id="ecosystem-caption-box"
        className={`p-3 text-center text-xs italic rounded-b-xl border-t transition-colors duration-500 ${
          isTwilightMode ? "bg-[#121824]/60 text-slate-400 border-[#1E252D]" : "bg-[#F3EFE9] text-stone-500 border-stone-200"
        }`}
      >
        &ldquo;Tap coordinates inside the canopy garden to fertilize plants. Keep nurturing to attract bouncing rabbits!&rdquo;
      </div>
    </div>
  );
}
