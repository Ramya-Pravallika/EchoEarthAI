import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AssessmentAnswers,
  CarbonReflection,
  UserSessionState,
} from "../types/index";

// Specialized Hooks & Services
import { useAssessment } from "../hooks/useAssessment";
import { useSimulation } from "../hooks/useSimulation";

// Modular UI Components
import AppHeader from "../components/layout/AppHeader";
import { LivingEcosystem } from "../features/ecosystem";
import ConversationalAssessment from "../features/assessment/components/ConversationalAssessment";
import CarbonIdentityCard from "../features/assessment/components/CarbonIdentityCard";
import FootprintBreakdown from "../features/assessment/components/FootprintBreakdown";
import DailyMissions from "../features/assessment/components/DailyMissions";
import CarbonInterventions from "../features/assessment/components/CarbonInterventions";

import { NudgeEngine } from "../features/nudges";
import { ReflectionJournal } from "../features/journal";
import { SustainabilityCoach } from "../features/coach";
import { CommunityChallenges } from "../features/community";
import { FutureSimulatorDetail } from "../features/simulator";
import { EcoAvatar } from "../features/avatar";
import HeroAnimationOverlay from "../features/assessment/components/HeroAnimationOverlay";

import {
  Sparkles,
  TreePine,
  RotateCcw,
  CheckCircle2,
  Sliders,
  ChevronDown,
  Layers,
  Sparkle,
  BookOpen,
  CloudSun,
  Moon,
  Sun,
  TrendingDown,
  Users,
  MessageCircle,
} from "lucide-react";

const INITIAL_STATE: UserSessionState = {
  hasCompletedAssessment: false,
  answers: null,
  reflection: null,
  adoptedInterventions: [],
  completedMissions: [],
  ecosystemPoints: 30,
  historyLog: [],
};

export default function App() {
  const [session, setSession] = useState<UserSessionState>(INITIAL_STATE);
  const [narrativeLoading, setNarrativeLoading] = useState<boolean>(false);
  const [currentNarrative, setCurrentNarrative] = useState<string>("");

  // Special Visual Themes according to specification
  const [isTwilightMode, setIsTwilightMode] = useState<boolean>(false); 
  const [showHeroAnimation, setShowHeroAnimation] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Accordion utility for steps details
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<"ecosystem" | "avatar" | "coach" | "journal" | "community" | "simulator">("ecosystem");

  // Load state from local storage
  useEffect(() => {
    const saved = localStorage.getItem("echoearth_session") || localStorage.getItem("carbon_mirror_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setSession(parsed);
          if (parsed.hasCompletedAssessment && parsed.reflection) {
            triggerNarrativeReport(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to parse custom session", e);
      }
    }
  }, []);

  const saveSession = (nextState: UserSessionState) => {
    setSession(nextState);
    localStorage.setItem("echoearth_session", JSON.stringify(nextState));
  };

  // Integration of useSimulation
  const simulation = useSimulation(session);

  const triggerNarrativeReport = async (state: UserSessionState) => {
    if (!state.reflection) return;
    setNarrativeLoading(true);
    try {
      const response = await fetch("/api/narrative-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identityTitle: state.reflection.carbonIdentity.title,
          co2Value: simulation.getSimulatedScore(),
          actionsAdoptedCount: state.adoptedInterventions.length,
          totalPoints: state.ecosystemPoints,
          ecoMood: simulation.getTargetEcosystemMood(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentNarrative(data.narrative);
      }
    } catch (error) {
      console.error("Narrative fetch warning", error);
    } finally {
      setNarrativeLoading(false);
    }
  };

  // Integration of useAssessment
  const {
    assessmentLoading,
    errorMessage,
    setErrorMessage,
    handleAssessmentSubmit,
  } = useAssessment({
    session,
    saveSession,
    triggerNarrativeReport,
    setShowHeroAnimation,
  });

  const handleRewardPoints = (pts: number, actionLog: string) => {
    const nextState = {
      ...session,
      ecosystemPoints: session.ecosystemPoints + pts,
      historyLog: [
        {
          date: new Date().toLocaleDateString(),
          action: actionLog,
          co2Impact: 0,
        },
        ...session.historyLog,
      ],
    };
    saveSession(nextState);
  };

  const handleToggleIntervention = (actionId: string, savings: number) => {
    const isAlreadyAdopted = session.adoptedInterventions.includes(actionId);
    let updatedAdopted = [...session.adoptedInterventions];

    if (isAlreadyAdopted) {
      updatedAdopted = updatedAdopted.filter((id) => id !== actionId);
    } else {
      updatedAdopted.push(actionId);
    }

    const pointsDelta = isAlreadyAdopted ? -30 : 60;
    const isAdoptedFlow = !isAlreadyAdopted;

    const nextState: UserSessionState = {
      ...session,
      adoptedInterventions: updatedAdopted,
      ecosystemPoints: Math.max(0, session.ecosystemPoints + pointsDelta),
      historyLog: [
        {
          date: new Date().toLocaleDateString(),
          action: isAdoptedFlow
            ? `Pledged to support: ${actionId}`
            : `Withdrew pledge for: ${actionId}`,
          co2Impact: isAdoptedFlow ? -savings : savings,
        },
        ...session.historyLog,
      ],
    };

    saveSession(nextState);
    triggerNarrativeReport(nextState);
  };

  const handleToggleMission = (missionId: string, ptsReward: number) => {
    const isCompleted = session.completedMissions.includes(missionId);
    let updatedCompleted = [...session.completedMissions];

    if (isCompleted) {
      updatedCompleted = updatedCompleted.filter((id) => id !== missionId);
    } else {
      updatedCompleted.push(missionId);
    }

    const pointsDelta = isCompleted ? -ptsReward : ptsReward;
    const nextState: UserSessionState = {
      ...session,
      completedMissions: updatedCompleted,
      ecosystemPoints: Math.max(0, session.ecosystemPoints + pointsDelta),
    };

    saveSession(nextState);
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    saveSession(INITIAL_STATE);
    setCurrentNarrative("");
    simulation.setIsSimulationMode(false);
    setShowResetConfirm(false);
  };

  // Determine active theme colors based on style selections
  const bgThemeClass = isTwilightMode ? "elegant-dark-bg text-[#E2E8F0]" : "natural-earth-bg text-[#2D2A26]";
  const headerThemeClass = isTwilightMode ? "bg-[#12181F]/95 border-b border-[#232A31]" : "bg-[#FCFAF6]/95 border-b border-[#E4E2DB]";
  const cardThemeClass = isTwilightMode ? "geometric-card-dark" : "geometric-card";
  const titleTextClass = isTwilightMode ? "text-stone-100" : "text-stone-900";
  const bodyTextClass = isTwilightMode ? "text-slate-300" : "text-stone-700 font-serif";
  const mutedTextClass = isTwilightMode ? "text-slate-400" : "text-stone-500";

  return (
    <div
      id="root-theme-box"
      className={`min-h-screen transition-colors duration-500 pb-20 ${bgThemeClass} ${
        largeText ? "text-lg" : "text-sm"
      } ${highContrast ? "contrast-125" : ""}`}
    >
      <AppHeader
        isTwilightMode={isTwilightMode}
        setIsTwilightMode={setIsTwilightMode}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
        largeText={largeText}
        setLargeText={setLargeText}
        hasCompletedAssessment={session.hasCompletedAssessment}
        setShowHeroAnimation={setShowHeroAnimation}
        handleReset={handleReset}
      />

      {/* Main Container Layout */}
      <main id="main-content-stage" className="max-w-7xl mx-auto px-4 mt-8">
        <AnimatePresence mode="wait">
          {!session.hasCompletedAssessment ? (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="py-4 space-y-6"
            >
              {/* Product Hero Lead-In for Natural Design */}
              <div id="product-lead-in" className="text-center max-w-2xl mx-auto mb-10 space-y-4">
                <span className={`text-xs border px-3 py-1.5 rounded-full font-bold uppercase tracking-widest inline-block ${
                  isTwilightMode
                    ? "bg-amber-950/40 border-amber-800/20 text-amber-300"
                    : "bg-emerald-50 border-emerald-100/60 text-emerald-800"
                }`}>
                  ✦ Artificial Intelligence Carbon Reflection ✦
                </span>
                <h2 className={`text-3xl md:text-5xl font-black tracking-tight leading-tight ${titleTextClass}`}>
                  Transforming invisible impact into an ecosystem
                </h2>
                <p className={`text-sm md:text-base leading-relaxed max-w-xl mx-auto ${bodyTextClass}`}>
                  Every decision you make reflects inside the living garden. Answer five intuitive parameters to draft your Carbon Profile and nurture micro daily transition targets.
                </p>
              </div>

              <ConversationalAssessment
                onSubmit={handleAssessmentSubmit}
                isLoading={assessmentLoading}
                isTwilightMode={isTwilightMode}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 w-full"
            >
              {/* Dashboard Symmetrical Navigation Tabs */}
              <div id="dashboard-tabs-container" className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl border transition-all scrollbar-thin scrollbar-thumb-slate-400"
                style={{
                  borderColor: isTwilightMode ? "#232A31" : "#E4E2DB",
                  backgroundColor: isTwilightMode ? "#0F141C" : "#FCFAF6"
                }}
              >
                {[
                  { id: "ecosystem", label: "My Biome Garden", icon: TreePine },
                  { id: "avatar", label: "My AI Companion", icon: Sparkles },
                  { id: "coach", label: "Habit Coach & Nudges", icon: MessageCircle },
                  { id: "journal", label: "Reflection Journal", icon: BookOpen },
                  { id: "community", label: "Co-Op league", icon: Users },
                  { id: "simulator", label: "Foresight Simulator", icon: TrendingDown },
                ].map((tb) => {
                  const Icon = tb.icon;
                  const isActive = activeTab === tb.id;
                  return (
                    <button
                      key={tb.id}
                      id={`tab-btn-${tb.id}`}
                      onClick={() => setActiveTab(tb.id as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer min-h-[44px] ${
                        isActive
                          ? isTwilightMode
                            ? "bg-[#1E2733] text-amber-300 shadow-md border border-[#2B3545]"
                            : "bg-white text-emerald-950 shadow-sm border border-[#E4E2DB]"
                          : isTwilightMode ? "text-slate-400 hover:text-slate-200" : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" /> {tb.label}
                    </button>
                  );
                })}
              </div>

              {/* Symmetrical Conditional Tab Views */}
              {activeTab === "ecosystem" ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Living Ecosystem Visual Canvas & Metric Stats */}
                  <div id="left-column-stats" className="lg:col-span-5 space-y-6">
                
                {/* Visualizer Frame */}
                <div id="ecosystem-view" className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <h3 className={`font-bold tracking-tight flex items-center gap-1.5 text-base ${titleTextClass}`}>
                      <CloudSun className={`w-4.5 h-4.5 ${isTwilightMode ? "text-amber-400" : "text-emerald-800"}`} /> Living Reflection Pool
                    </h3>
                    <div className={`flex p-0.5 rounded-xl text-xs font-semibold ${
                      isTwilightMode ? "bg-[#1A222B]" : "bg-[#EFECE6]"
                    }`}>
                      <button
                        id="btn-view-current"
                        onClick={() => simulation.setIsSimulationMode(false)}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          !simulation.isSimulationMode
                            ? isTwilightMode
                              ? "bg-[#12181F] text-amber-300 shadow-sm"
                              : "bg-[#FCFAF6] text-emerald-900 shadow-sm"
                            : "text-slate-400 hover:text-slate-800"
                        }`}
                      >
                        Current Path
                      </button>
                      <button
                        id="btn-view-simulation"
                        onClick={() => simulation.setIsSimulationMode(true)}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          simulation.isSimulationMode
                            ? isTwilightMode
                              ? "bg-[#12181F] text-amber-300 shadow-sm"
                              : "bg-[#FCFAF6] text-emerald-950 shadow-sm"
                            : "text-slate-400 hover:text-slate-800"
                        }`}
                      >
                        Future Projection
                      </button>
                    </div>
                  </div>

                  <LivingEcosystem
                    score={
                      simulation.isSimulationMode
                        ? simulation.getFuturisticSimulationScore()
                        : simulation.getSimulatedScore()
                    }
                    points={session.ecosystemPoints}
                    adoptedCount={session.adoptedInterventions.length}
                    completedMissionsCount={session.completedMissions.length}
                    isSimulation={simulation.isSimulationMode}
                    reducedMotion={reducedMotion}
                    isTwilightMode={isTwilightMode}
                  />
                </div>

                {/* Score Summary Metrics */}
                <div id="dashboard-score-brief" className={`${cardThemeClass} p-6 space-y-5 transition-colors duration-500`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-wider block ${mutedTextClass}`}>
                        Estimated Annual Carbon Footprint
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className={`text-4xl font-extrabold tracking-tight font-mono ${titleTextClass}`}>
                          {simulation.isSimulationMode
                            ? simulation.getFuturisticSimulationScore().toFixed(1)
                            : simulation.getSimulatedScore().toFixed(1)}
                        </span>
                        <span className={`${mutedTextClass} font-semibold text-sm`}>Metric Tons CO₂e</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-bold uppercase tracking-wider block ${mutedTextClass}`}>
                        Ecosystem Vitality
                      </span>
                      <span className="text-2xl font-black text-emerald-600 font-mono block mt-1">
                        +{session.ecosystemPoints}
                      </span>
                    </div>
                  </div>

                  {/* Comparisons and sustain objectives */}
                  <div id="regional-averages" className="space-y-2.5 pt-4 border-t border-slate-200/40">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className={mutedTextClass}>National Standard Family:</span>
                      <span className={`font-mono ${titleTextClass}`}>16.0 tons / yr</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className={mutedTextClass}>Global Sustainable Cap:</span>
                      <span className="font-mono text-emerald-600">2.0 tons / yr</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className={mutedTextClass}>Pledge Carbon Mitigation:</span>
                      <span className="font-mono text-indigo-500">
                        -{session.reflection?.interventions
                          .filter((i) => session.adoptedInterventions.includes(i.actionId))
                          .reduce((sum, item) => sum + item.co2Savings, 0)
                          .toFixed(1) || "0.0"} tons saved
                      </span>
                    </div>
                  </div>

                  {/* Future Projection interactive slider if active */}
                  {simulation.isSimulationMode && (
                    <div className={`p-4 rounded-xl space-y-3 mt-4 border ${
                      isTwilightMode
                        ? "bg-[#1A222B] border-[#2E3B4E] text-slate-200"
                        : "bg-[#F3EFE9] border-[#E4E2DB] text-stone-800"
                    }`}>
                      <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5" /> Interactive Lifestyle Simulator
                      </h4>
                      <p className="text-xs leading-relaxed font-serif">
                        Slide components to preview how your virtual flora responds when and if your sustainable adaptation target moves.
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span>Target Habit Reform Speed</span>
                          <span className="font-mono text-indigo-500">{simulation.simulationPercent}% Shift</span>
                        </div>
                        <input
                          id="simulationPercent"
                          type="range"
                          min="0"
                          max="100"
                          value={simulation.simulationPercent}
                          onChange={(e) => simulation.setSimulationPercent(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400">
                          <span>Status Quo</span>
                          <span>Sustainable Shift</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sub-distribution breakdowns bars */}
                {session.reflection && (
                  <FootprintBreakdown
                    reflection={session.reflection}
                    isTwilightMode={isTwilightMode}
                  />
                )}
              </div>

              {/* Right Column: Identity, Narrative reflection and Daily Missions */}
              <div id="right-column-actions" className="lg:col-span-7 space-y-6">
                
                {/* Personalized Identity & Description */}
                {session.reflection && (
                  <CarbonIdentityCard
                    reflection={session.reflection}
                    isTwilightMode={isTwilightMode}
                  />
                )}

                {/* Adaptive Daily Missions Checklist styled symmetrically */}
                {session.reflection && (
                  <DailyMissions
                    reflection={session.reflection}
                    completedMissions={session.completedMissions}
                    handleToggleMission={handleToggleMission}
                    isTwilightMode={isTwilightMode}
                  />
                )}

                {/* Narrative report widget */}
                <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-500 space-y-4 ${
                  isTwilightMode ? "bg-[#10151C]/80 border-[#1E252D]" : "bg-[#EFECE6]/40 border-[#DAD6CD]"
                }`}>
                  <div className="flex justify-between items-center">
                    <h4 className={`font-bold tracking-tight text-base flex items-center gap-2 ${titleTextClass}`}>
                      <BookOpen className="w-4.5 h-4.5 text-indigo-500" /> Mirror Reflection Narrative
                    </h4>
                    {narrativeLoading && (
                      <span className="text-xs text-indigo-500 font-semibold animate-pulse">
                        Consulting Mirror...
                      </span>
                    )}
                  </div>

                  {currentNarrative ? (
                    <div className="space-y-4">
                      <p className={`text-sm leading-relaxed ${bodyTextClass} italic`}>
                        &ldquo;{currentNarrative}&rdquo;
                      </p>
                      <span className={`text-[10px] font-bold uppercase tracking-widest block text-right ${mutedTextClass}`}>
                        — Scribed by EchoEarth AI
                      </span>
                    </div>
                  ) : (
                    <div className="h-28 flex items-center justify-center text-center">
                      <p className="text-xs text-slate-400 font-serif">
                        Generating emotional behavioral analysis from intelligence ecosystem...
                      </p>
                    </div>
                  )}
                </div>

                {/* Carbon Pledges & Interventions */}
                {session.reflection && (
                  <CarbonInterventions
                    reflection={session.reflection}
                    adoptedInterventions={session.adoptedInterventions}
                    handleToggleIntervention={handleToggleIntervention}
                    isTwilightMode={isTwilightMode}
                  />
                )}
              </div>
            </div>
              ) : activeTab === "avatar" ? (
            <EcoAvatar
              score={simulation.getSimulatedScore()}
              points={session.ecosystemPoints}
              adoptedCount={session.adoptedInterventions.length}
              completedMissionsCount={session.completedMissions.length}
              isTwilightMode={isTwilightMode}
            />
          ) : activeTab === "coach" ? (
                <div className="space-y-6">
                  <NudgeEngine
                    identityTitle={session.reflection?.carbonIdentity.title || "Explorer"}
                    breakdown={session.reflection?.breakdown || { transportation: 0.1, food: 0.1, energy: 0.1, shopping: 0.1, waste: 0.1 }}
                    adoptedIds={session.adoptedInterventions}
                    isTwilightMode={isTwilightMode}
                  />
                  <SustainabilityCoach
                    identityTitle={session.reflection?.carbonIdentity.title || "Explorer"}
                    estimatedTotalCO2={session.reflection?.estimatedTotalCO2 || 10.0}
                    isTwilightMode={isTwilightMode}
                  />
                </div>
              ) : activeTab === "journal" ? (
                <ReflectionJournal
                  identityTitle={session.reflection?.carbonIdentity.title || "Explorer"}
                  isTwilightMode={isTwilightMode}
                  onRewardPoints={handleRewardPoints}
                />
              ) : activeTab === "community" ? (
                <CommunityChallenges
                  isTwilightMode={isTwilightMode}
                  userPoints={session.ecosystemPoints}
                />
              ) : (
                <FutureSimulatorDetail
                  currentCO2={session.reflection?.estimatedTotalCO2 || 10.0}
                  isTwilightMode={isTwilightMode}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Immersive state notification/reset confirmation overlay */}
      <AnimatePresence>
        {showResetConfirm && (
          <div
            id="reset-confirm-backdrop"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              id="reset-confirm-modal"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-5 ${
                isTwilightMode
                  ? "bg-[#12181F] border-[#232A31] text-stone-100"
                  : "bg-[#FCFAF6] border-[#E4E2DB] text-stone-900"
              }`}
            >
              <div className="space-y-2">
                <span className={`text-[10px] font-extrabold tracking-widest uppercase block ${
                  isTwilightMode ? "text-amber-400" : "text-emerald-800"
                }`}>
                  ⚠️ Irreversible Action
                </span>
                <h3 className="text-xl font-bold tracking-tight">
                  Reset Carbon Mirroring Profile?
                </h3>
                <p className={`text-xs leading-relaxed ${bodyTextClass}`}>
                  This will completely clear your current answers, chosen lifestyle pacts, eco-vitality points, your custom interactive biome reflection pool, and all history logs.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  id="btn-confirm-reset-yes"
                  onClick={confirmReset}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-stone-100 text-xs font-bold transition-all active:scale-95 cursor-pointer min-h-[44px]"
                >
                  Yes, start fresh
                </button>
                <button
                  id="btn-confirm-reset-cancel"
                  onClick={() => setShowResetConfirm(false)}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer min-h-[44px] ${
                    isTwilightMode
                      ? "border-[#232A31] text-slate-350 bg-[#161D26] hover:bg-[#1E2733]"
                      : "border-[#E4E2DB] text-stone-700 bg-white hover:bg-stone-50"
                  }`}
                >
                  Keep current path
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Action/Assessment error toast alert */}
      <AnimatePresence>
        {errorMessage && (
          <div
            id="error-banner-overlay"
            className="fixed bottom-6 right-6 z-[100] max-w-sm w-full p-4 rounded-xl border shadow-xl bg-rose-50 text-rose-800 border-rose-300 flex items-start gap-3"
          >
            <div className="flex-1 space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wide block">
                Error Notice
              </span>
              <p className="text-xs leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button
              id="btn-close-error"
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold font-mono px-2 py-1 text-rose-900 border border-rose-300 rounded hover:bg-rose-100/50 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </AnimatePresence>

      <HeroAnimationOverlay
        isOpen={showHeroAnimation}
        onClose={() => setShowHeroAnimation(false)}
        isTwilightMode={isTwilightMode}
      />
    </div>
  );
}
