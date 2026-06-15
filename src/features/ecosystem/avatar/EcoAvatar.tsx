import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Trophy, Award, Shield, Cpu, RefreshCw, Feather, Flame, HelpCircle } from "lucide-react";

interface EcoAvatarProps {
  score: number; // baseline estimated tons CO2
  points: number; // eco-vitality achievements points
  adoptedCount: number; // adopted mitigations
  completedMissionsCount: number; // completed mission index
  isTwilightMode: boolean;
}

type Archetype = "flora" | "phoenix" | "ocean" | "golem";

export default function EcoAvatar({
  score,
  points,
  adoptedCount,
  completedMissionsCount,
  isTwilightMode,
}: EcoAvatarProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype>("flora");
  const [isFeeding, setIsFeeding] = useState(false);
  const [feedLevel, setFeedLevel] = useState(0);
  const [aiStory, setAiStory] = useState<string>("");
  const [generatingStory, setGeneratingStory] = useState(false);

  // Evolve Level based on earned points
  // Level 1: <100 pts (Emergent Sprout/Egg/Drop/Pebble)
  // Level 2: 100-300 pts (Fledgling Sentinel)
  // Level 3: 300+ pts (Ascended Majestic Guardian)
  const avatarLevel = points < 100 ? 1 : points < 300 ? 2 : 3;

  // Visual state tags
  const levelNames = {
    flora: ["Dormant Seedling", "Thornbud Sentinel", "Yggdrasil Arch-Dryad"],
    phoenix: ["Smoldering Ember", "Solar Sparkflame", "Radiant Helios-Phoenix"],
    ocean: ["Dewdrop Sprite", "Tidecrest Serpent", "Leviathan Deepkeeper"],
    golem: ["Cracked Pebble", "Basalt Aegis", "Aether-Stone Mountain Golem"],
  };

  const getEvolvedName = () => {
    return levelNames[selectedArchetype][avatarLevel - 1];
  };

  // Generate dynamic AI story for the avatar
  const generateAvatarStory = async () => {
    setGeneratingStory(true);
    try {
      const res = await fetch("/api/coach-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: [],
          message: `Describe the mystical personality, power level, and traits of my EchoEarth AI companion: a Level ${avatarLevel} "${getEvolvedName()}" (${selectedArchetype} archetype). My carbon score is ${score.toFixed(1)}t CO2/year, I have adopted ${adoptedCount} carbon interventions, and completed ${completedMissionsCount} missions. Keep it inspiring, highly creative, matching the selected elemental path, and under 90 words.`,
          identityTitle: `Guardian of the ${selectedArchetype}`,
          estimatedTotalCO2: score,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiStory(data.reply);
      } else {
        setAiStory("The spirit of your companion hums with latent green energy. Adopt more carbon interventions to unlock its verbal voice!");
      }
    } catch (e) {
      setAiStory("Your companion is meditating on the pristine sky canopy. Keep building your streak to connect!");
    } finally {
      setGeneratingStory(false);
    }
  };

  // Trigger automatic story update on archetype or level change
  useEffect(() => {
    setAiStory("");
  }, [selectedArchetype, avatarLevel]);

  // Feed animation helper
  const handleFeed = () => {
    setIsFeeding(true);
    setFeedLevel((prev) => Math.min(100, prev + 15));
    setTimeout(() => {
      setIsFeeding(false);
    }, 800);
  };

  // Streaks badge helper
  const hasStreakAura = completedMissionsCount >= 2;
  // Pledged item helper
  const hasCrystalStaff = adoptedCount >= 3;
  // Footprint aura
  const airQualityState = score <= 6 ? "lush" : score > 12 ? "hazy" : "normal";

  return (
    <div
      id="eco-avatar-panel"
      className={`p-6 rounded-2xl border transition-all duration-500 space-y-6 ${
        isTwilightMode ? "bg-[#121820] border-[#232A31]" : "bg-[#FCFAF6] border-[#E4E2DB]"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/40 pb-4">
        <div className="space-y-0.5">
          <span className={`text-[10px] uppercase font-bold tracking-widest block text-emerald-600`}>
            ✦ Evolving AI Lifeformer Companion ✦
          </span>
          <h4 className={`font-bold tracking-tight text-lg flex items-center gap-1.5 ${
            isTwilightMode ? "text-stone-100" : "text-stone-900"
          }`}>
            <Feather className="w-5 h-5 text-emerald-500 animate-bounce" /> Personalized AI Avatar
          </h4>
          <p className={`text-xs ${isTwilightMode ? "text-slate-400" : "text-stone-500"}`}>
            Your guardian companion evolves in physical form, magical augments, and narrative depth as you manifest positive habits.
          </p>
        </div>

        {/* Archetype Selector */}
        <div id="archetype-tabs" className="flex gap-1.5 overflow-x-auto p-1 bg-stone-105 rounded-xl border border-stone-200/60 max-w-full">
          {[
            { id: "flora", label: "Moss Dryad", icon: "🌱" },
            { id: "phoenix", label: "Ember Phoenix", icon: "🔥" },
            { id: "ocean", label: "Wave Serpent", icon: "💧" },
            { id: "golem", label: "Terra Golem", icon: "⛰️" },
          ].map((arch) => (
            <button
              key={arch.id}
              id={`arch-btn-${arch.id}`}
              onClick={() => setSelectedArchetype(arch.id as Archetype)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                selectedArchetype === arch.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : isTwilightMode ? "text-slate-400 hover:text-slate-200" : "text-stone-700 hover:bg-stone-50"
              }`}
            >
              <span>{arch.icon}</span>
              <span>{arch.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Avatar SVG Visualizer */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300/30 rounded-2xl relative overflow-hidden bg-gradient-to-b from-stone-100/5 to-transparent">
          
          {/* Background Aura corresponding to airQualityState (footprint tracker) */}
          <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 opacity-20 blur-3xl ${
            airQualityState === "lush"
              ? "bg-gradient-to-tr from-emerald-500 to-green-400"
              : airQualityState === "hazy"
              ? "bg-gradient-to-tr from-rose-500 via-amber-600 to-yellow-600"
              : "bg-gradient-to-tr from-blue-400 to-indigo-500"
          }`} />

          {/* Sparkles Floating particle layers if points levels are higher */}
          {avatarLevel >= 2 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`spark-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-yellow-300"
                  initial={{ x: 50 + i * 40, y: 220, opacity: 0 }}
                  animate={{
                    y: [220, 40, 220],
                    opacity: [0, 0.8, 0],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  style={{ left: `${15 + i * 12}%` }}
                />
              ))}
            </div>
          )}

          {/* Interactive Avatar SVG Canvas */}
          <div className="relative w-64 h-64 flex items-center justify-center z-10 select-none">
            
            {/* Streak Comet Aura looping if streak count active */}
            {hasStreakAura && (
              <motion.div
                className="absolute w-44 h-44 rounded-full border-2 border-dashed border-indigo-500/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute -top-1.5 left-1/2 w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_12px_#fbbf24] flex items-center justify-center text-[8px]">
                  🔥
                </div>
              </motion.div>
            )}

            {/* Glowing ascent ring if Level 3 ascended */}
            {avatarLevel === 3 && (
              <motion.div
                className="absolute w-48 h-48 rounded-full border border-yellow-400/40"
                animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Dynamic Interactive SVG */}
            <svg
              viewBox="0 0 200 200"
              className={`w-full h-full drop-shadow-lg transition-transform duration-300 ${
                isFeeding ? "scale-108 -translate-y-2" : "hover:scale-103"
              }`}
            >
              {/* Ground Pedestal corresponding to chosen archetype */}
              <ellipse
                cx="100"
                cy="175"
                rx="55"
                ry="12"
                className={
                  selectedArchetype === "flora" ? "fill-emerald-800/40" :
                  selectedArchetype === "phoenix" ? "fill-rose-950/30" :
                  selectedArchetype === "ocean" ? "fill-cyan-800/30" :
                  "fill-stone-800/30"
                }
              />

              {/* Archetype SVG rendering */}
              <g id="archetype-body-layer">
                {/* 1. FLORA ARCHETYPE */}
                {selectedArchetype === "flora" && (
                  <g>
                    {/* Level 1: Small Sprout seed */}
                    {avatarLevel === 1 && (
                      <g>
                        {/* Coax Seed */}
                        <circle cx="100" cy="150" r="16" fill="#8B5A2B" />
                        <motion.path
                          d="M 100 134 Q 90 115 102 95 Q 110 115 100 134"
                          fill="#10B981"
                          animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      </g>
                    )}

                    {/* Level 2: Evolved Thornbud Sentinel */}
                    {avatarLevel === 2 && (
                      <g>
                        {/* Stronger wood stem trunk */}
                        <rect x="94" y="115" width="12" height="50" rx="4" fill="#6B4423" />
                        {/* Leaf Wings */}
                        <motion.path
                          d="M 94 135 H 65 Q 60 115 85 125 Z"
                          fill="#059669"
                          animate={{ rotate: [-2, 5, -2] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />
                        <motion.path
                          d="M 106 135 H 135 Q 140 115 115 125 Z"
                          fill="#059669"
                          animate={{ rotate: [2, -5, 2] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />
                        {/* Cute glowing glowing heart flower core */}
                        <circle cx="100" cy="115" r="14" fill="#34D399" className="animate-pulse" />
                        <circle cx="100" cy="115" r="6" fill="#FCD34D" />
                      </g>
                    )}

                    {/* Level 3: Majestic Yggdrasil Arch-Dryad */}
                    {avatarLevel === 3 && (
                      <g>
                        {/* Evolved Tree Dryad humanoid form */}
                        <path d="M 85 170 Q 100 115 115 170" fill="#5C3A21" />
                        {/* Arm roots */}
                        <path d="M 88 135 Q 60 125 50 145" fill="none" stroke="#5C3A21" strokeWidth="6" strokeLinecap="round" />
                        <path d="M 112 135 Q 140 125 150 145" fill="none" stroke="#5C3A21" strokeWidth="6" strokeLinecap="round" />
                        
                        {/* Crown/Cap of Leaves */}
                        <ellipse cx="100" cy="90" rx="36" ry="24" fill="#047857" />
                        <circle cx="85" cy="80" r="18" fill="#059669" />
                        <circle cx="115" cy="80" r="18" fill="#10B981" />
                        <circle cx="100" cy="105" r="14" fill="#10B981" />

                        {/* Heart Core */}
                        <motion.circle
                          cx="100"
                          cy="130"
                          r="10"
                          fill="#34D399"
                          animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </g>
                    )}
                  </g>
                )}

                {/* 2. PHOENIX ARCHETYPE */}
                {selectedArchetype === "phoenix" && (
                  <g>
                    {/* Level 1: Fire Egg */}
                    {avatarLevel === 1 && (
                      <g>
                        <path d="M 82 160 C 82 120, 118 120, 118 160 S 100 180, 100 180 Z" fill="#DC2626" />
                        {/* Orange scales */}
                        <path d="M 94 150 Q 100 140 106 150" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
                        <path d="M 90 162 Q 100 152 110 162" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
                      </g>
                    )}

                    {/* Level 2: Fledgling Sparkflame Bird */}
                    {avatarLevel === 2 && (
                      <g>
                        {/* Flame wings */}
                        <motion.path
                          d="M 85 130 Q 55 90 70 145 Z"
                          fill="#EA580C"
                          animate={{ skewY: [-5, 5, -5] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.path
                          d="M 115 130 Q 145 90 130 145 Z"
                          fill="#EA580C"
                          animate={{ skewY: [5, -5, 5] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Body */}
                        <circle cx="100" cy="135" r="15" fill="#DC2626" />
                        {/* Tail flare */}
                        <path d="M 95 150 Q 100 178 105 150 Z" fill="#F59E0B" />
                        {/* Glowing orange chest */}
                        <circle cx="100" cy="135" r="6" fill="#FCD34D" />
                      </g>
                    )}

                    {/* Level 3: Majestic Radiant Helios-Phoenix */}
                    {avatarLevel === 3 && (
                      <g>
                        {/* Golden Crest */}
                        <path d="M 100 60 Q 95 38 105 32 Z" fill="#FBBF24" />
                        {/* Evolved Flame Wings */}
                        <motion.path
                          d="M 80 120 Q 30 60 55 140 Z"
                          fill="#EA580C"
                          animate={{ scaleX: [1, 1.05, 1], rotate: [-2, 3, -2] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.path
                          d="M 120 120 Q 170 60 145 140 Z"
                          fill="#EA580C"
                          animate={{ scaleX: [1, 1.05, 1], rotate: [2, -3, 2] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                        {/* Outer bird crown shield */}
                        <path d="M 85 120 Q 100 70 115 120 Q 100 170 85 120 Z" fill="#B91C1C" />
                        {/* Glowing Fire crest core */}
                        <circle cx="100" cy="115" r="14" fill="#FBBF24" />
                        <circle cx="100" cy="115" r="8" fill="#FFFBEB" />
                        {/* Feathery tail flows */}
                        <path d="M 90 155 Q 85 188 92 185 Q 100 155 90 155" fill="#EF4444" />
                        <path d="M 110 155 Q 115 188 108 185 Q 100 155 110 155" fill="#EF4444" />
                      </g>
                    )}
                  </g>
                )}

                {/* 3. OCEAN ARCHETYPE */}
                {selectedArchetype === "ocean" && (
                  <g>
                    {/* Level 1: Clean Water Dewdrop */}
                    {avatarLevel === 1 && (
                      <g>
                        <path d="M 100 120 Q 75 160 100 178 Q 125 160 100 120 Z" fill="#0EA5E9" />
                        <ellipse cx="94" cy="150" rx="2.5" ry="5" fill="white" opacity="0.4" />
                      </g>
                    )}

                    {/* Level 2: Coral Tidecrest Serpent */}
                    {avatarLevel === 2 && (
                      <g>
                        {/* Snake river line */}
                        <path d="M 80 160 Q 100 120 120 160 Q 140 140 150 160" fill="none" stroke="#0284C7" strokeWidth="12" strokeLinecap="round" />
                        {/* Serpent head */}
                        <circle cx="80" cy="140" r="12" fill="#02afef" />
                        <polygon points="76,134 84,134 80,125" fill="#FEF08A" />
                      </g>
                    )}

                    {/* Level 3: Majestic Leviathan Deepkeeper */}
                    {avatarLevel === 3 && (
                      <g>
                        {/* Glowing crown wave */}
                        <path d="M 60 150 Q 100 100 140 150 C 120 175, 80 175, 60 150" fill="#0369A1" />
                        <motion.path
                          d="M 50 135 Q 20 120 40 160"
                          fill="none"
                          stroke="#0EA5E9"
                          strokeWidth="6"
                          strokeLinecap="round"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.path
                          d="M 150 135 Q 180 120 160 160"
                          fill="none"
                          stroke="#0EA5E9"
                          strokeWidth="6"
                          strokeLinecap="round"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        {/* Central crystal block */}
                        <polygon points="100,65 112,85 100,105 88,85" fill="#38BDF8" className="animate-pulse" />
                        {/* Giant bubble */}
                        <circle cx="100" cy="135" r="24" fill="#0EA5E9" opacity="0.3" stroke="#38BDF8" strokeWidth="2" />
                        <circle cx="100" cy="135" r="8" fill="#E0F2FE" />
                      </g>
                    )}
                  </g>
                )}

                {/* 4. GOLEM ARCHETYPE */}
                {selectedArchetype === "golem" && (
                  <g>
                    {/* Level 1: Sleeping Pebble */}
                    {avatarLevel === 1 && (
                      <g>
                        <ellipse cx="100" cy="155" rx="20" ry="14" fill="#78716C" />
                        {/* moss layer */}
                        <path d="M 85 150 Q 100 140 115 150" fill="none" stroke="#22C55E" strokeWidth="3" />
                      </g>
                    )}

                    {/* Level 2: Basalt Rock Guardian */}
                    {avatarLevel === 2 && (
                      <g>
                        {/* Arms */}
                        <polygon points="70,120 75,160 85,140" fill="#57534E" />
                        <polygon points="130,120 125,160 115,140" fill="#57534E" />
                        {/* Stone block body */}
                        <rect x="80" y="110" width="40" height="45" rx="5" fill="#78716C" />
                        {/* Moss beard */}
                        <path d="M 80 120 Q 100 135 120 120" fill="#15803D" />
                        {/* Glowing computer-eye lines */}
                        <circle cx="92" cy="118" r="2.5" fill="#22D3EE" />
                        <circle cx="108" cy="118" r="2.5" fill="#22D3EE" />
                      </g>
                    )}

                    {/* Level 3: Aether-Stone Mountain Golem */}
                    {avatarLevel === 3 && (
                      <g>
                        {/* Evolved floating stone platforms */}
                        <motion.rect
                          x="55"
                          y="110"
                          width="20"
                          height="35"
                          rx="4"
                          fill="#44403C"
                          animate={{ y: [-2, 2, -2] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        <motion.rect
                          x="125"
                          y="110"
                          width="20"
                          height="35"
                          rx="4"
                          fill="#44403C"
                          animate={{ y: [2, -2, 2] }}
                          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                        />

                        {/* Huge Boulder Torso */}
                        <rect x="70" y="90" width="60" height="65" rx="8" fill="#57534E" />
                        
                        {/* Floating ancient crown runes */}
                        <polygon points="100,50 106,62 94,62" fill="#A855F7" className="animate-bounce" />
                        <path d="M 80 85 H 120" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

                        {/* Emerald-crusted shoulder mounts */}
                        <circle cx="78" cy="98" r="6" fill="#10B981" />
                        <circle cx="122" cy="98" r="6" fill="#10B981" />

                        {/* Glowing core */}
                        <motion.circle
                          cx="100"
                          cy="125"
                          r="12"
                          fill="#A855F7"
                          animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2.2, repeat: Infinity }}
                        />
                      </g>
                    )}
                  </g>
                )}
              </g>

              {/* Auxiliary Accessory Augment: Carrying Crystal Staff (if adopted >= 3) */}
              {hasCrystalStaff && (
                <g id="crystal-staff-augment">
                  {/* Long staff line */}
                  <line x1="150" y1="80" x2="150" y2="175" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
                  {/* Glowing core crystal at top */}
                  <polygon points="150,55 158,68 150,80 142,68" fill="#FCD34D" className="animate-pulse" />
                  <circle cx="150" cy="68" r="10" fill="#F59E0B" opacity="0.3" />
                </g>
              )}
            </svg>
          </div>

          {/* Evolution status indicator badge layout */}
          <div className="mt-4 text-center space-y-1 z-10">
            <h5 className={`font-bold tracking-tight text-sm ${isTwilightMode ? "text-stone-100" : "text-stone-900"}`}>
              {getEvolvedName()}
            </h5>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-505 text-indigo-500">
              Ascended Level {avatarLevel} Lifeform
            </p>
          </div>
        </div>

        {/* Right Column: Interaction, Stats & Personality Stories Generator */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          {/* Evolver Status Bars */}
          <div className={`p-4 rounded-xl space-y-3.5 border ${
            isTwilightMode ? "bg-[#161D26] border-[#222E3C]" : "bg-white border-[#E4E2DB]"
          }`}>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-405 text-slate-400 block pb-1 border-b border-stone-200/40">
              Ecosystem Bond & Achievements Status
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 block font-semibold">Eco Achievements Points</span>
                <span className="text-xl font-mono font-bold text-emerald-600">{points} pts</span>
                {points < 300 ? (
                  <span className="text-[10px] text-slate-400 block">
                    Need <strong>{points < 100 ? 100 - points : 300 - points}</strong> more pts to evolve!
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-500 font-bold block">
                    ★ Fully Evolved Sovereign form!
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 block font-semibold">Active Streak Count</span>
                <span className="text-xl font-mono font-bold text-rose-500 flex items-center gap-1">
                  <Flame className="w-5 h-5 fill-current" /> {completedMissionsCount} Missions
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {completedMissionsCount >= 2 ? "🔥 Active Streak Comet unlocked!" : "Complete 2 missions to unlock Streak comet."}
                </span>
              </div>
            </div>

            {/* Dynamic visual slider indicator */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400">Next Form Progression</span>
                <span className="text-indigo-500 font-mono">
                  {points >= 300 ? "100%" : `${Math.round((points / 300) * 100)}%`}
                </span>
              </div>

              <div className={`w-full h-2.5 rounded-full overflow-hidden p-0.5 ${
                isTwilightMode ? "bg-slate-900" : "bg-stone-200"
              }`}>
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                  style={{ width: `${points >= 300 ? 100 : (points / 300) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive feed/meditate controllers */}
          <div className="flex gap-3">
            <button
              id="btn-feed-companion"
              onClick={handleFeed}
              disabled={isFeeding}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all text-center leading-none"
            >
              🍉 Feed Vitality Nutrient
            </button>

            <button
              id="btn-trigger-story"
              onClick={generateAvatarStory}
              disabled={generatingStory}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all text-center"
            >
              {generatingStory ? (
                <>Manifesting... <RefreshCw className="w-3.5 h-3.5 animate-spin" /></>
              ) : (
                <>AI Identify Persona <Sparkles className="w-3.5 h-3.5 text-yellow-300" /></>
              )}
            </button>
          </div>

          {/* AI Narratives Story Panel */}
          <AnimatePresence mode="popLayout">
            {aiStory ? (
              <motion.div
                id="avatar-story-narrator-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-xl border space-y-2 relative overflow-hidden ${
                  isTwilightMode ? "bg-[#182330] border-indigo-500/20" : "bg-indigo-50/50 border-indigo-200"
                }`}
              >
                <div className="flex justify-between items-center pb-1.5 border-b border-indigo-100/30">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-current" /> Mystical Companion Record
                  </span>
                  <span className="text-[9px] font-mono bg-white/40 px-1.5 py-0.5 rounded leading-none">
                    Evolved Intel
                  </span>
                </div>
                <p className={`text-xs md:text-sm font-serif leading-relaxed italic ${isTwilightMode ? "text-slate-250 text-slate-300" : "text-[#2F2A28]"}`}>
                  &ldquo;{aiStory}&rdquo;
                </p>
              </motion.div>
            ) : (
              <div className={`p-4 rounded-xl border text-center text-xs text-slate-450 italic py-6 ${
                isTwilightMode ? "bg-[#0E131E] border-[#1E252D] text-slate-400" : "bg-stone-50 border-stone-250 text-stone-500"
              }`}>
                ✦ Click &ldquo;AI Identify Persona&rdquo; above to prompt CarbonMirror AI to decrypt your companion's high-fidelity behavioral profile record! ✦
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
