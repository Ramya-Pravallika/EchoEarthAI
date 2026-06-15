import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AssessmentAnswers } from "../types";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

interface ConversationalAssessmentProps {
  onSubmit: (answers: AssessmentAnswers) => void;
  isLoading: boolean;
  isTwilightMode?: boolean;
}

const INITIAL_ANSWERS: AssessmentAnswers = {
  transportation: {
    commuteMethod: "none",
    commuteMiles: 0,
    flightsLength: "none",
  },
  food: {
    dietType: "balanced",
    organicLocal: "sometimes",
    foodWaste: "medium",
  },
  energy: {
    homeSize: "apartment",
    heatingSource: "electric",
    greenElectricity: false,
  },
  shopping: {
    purchaseFrequency: "moderate",
    secondHand: "sometimes",
  },
  waste: {
    recyclingLevel: "partial",
    composting: false,
    singleUsePlastics: "moderate",
  },
};

export default function ConversationalAssessment({
  onSubmit,
  isLoading,
  isTwilightMode = false,
}: ConversationalAssessmentProps) {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>(INITIAL_ANSWERS);

  const handleNext = () => {
    if (step < 4) {
      setStep((p) => p + 1);
    } else {
      onSubmit(answers);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep((p) => p - 1);
    }
  };

  const updateSubField = (
    category: keyof AssessmentAnswers,
    field: string,
    value: any
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const stepsInfo = [
    { title: "Mobility", description: "How do you navigate of late?" },
    { title: "Nourishment", description: "Your daily food selections and sourcing" },
    { title: "Shelter & Energy", description: "How you warm and power your space" },
    { title: "Consumption", description: "Your shopping habits & textiles" },
    { title: "Waste Management", description: "Daily disposable items and recycling" },
  ];

  // Common styling selectors
  const buttonStyleFor = (category: keyof AssessmentAnswers, field: string, val: any) => {
    const isSelected = (answers[category] as any)[field] === val;
    if (isSelected) {
      return isTwilightMode
        ? "bg-amber-500/10 border-amber-400 text-amber-300 ring-1 ring-amber-400/20 font-bold"
        : "bg-[#EFECE6] border-emerald-800 text-emerald-900 ring-1 ring-emerald-800/20 font-bold";
    }
    return isTwilightMode
      ? "bg-[#161D26] border-[#232A31] text-slate-300 hover:bg-[#1E2733]"
      : "bg-white border-[#E4E2DB] text-stone-800 hover:bg-stone-50";
  }

  const labelClass = isTwilightMode ? "text-slate-300 font-bold" : "text-stone-800 font-semibold";

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div id="step-0-mobility" className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="commuteMethod" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                Primary Commute Vessel
              </label>
              <div id="commuteMethod-group" className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-label="Commute Method">
                {[
                  { id: "none", label: "No Commute / Remote" },
                  { id: "active", label: "Active Transit (Walk/Bike)" },
                  { id: "public_transit", label: "Train, Bus, or Subway" },
                  { id: "car_ev", label: "Electric Vehicle" },
                  { id: "car_hybrid", label: "Hybrid Vehicle" },
                  { id: "car_gas", label: "Gasoline / Diesel Car" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    id={`btn-commute-${opt.id}`}
                    type="button"
                    onClick={() => updateSubField("transportation", "commuteMethod", opt.id)}
                    className={`px-4 py-3 text-left text-sm rounded-xl border transition-all min-h-[50px] focus:outline-none ${buttonStyleFor("transportation", "commuteMethod", opt.id)}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {answers.transportation.commuteMethod !== "none" && (
              <div id="commuteMiles-wrapper" className="space-y-2">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                  <label htmlFor="commuteMiles" className={labelClass}>Weekly Distance Estimate</label>
                  <span className={`${isTwilightMode ? "text-amber-300" : "text-emerald-800"} font-mono font-bold`}>
                    {answers.transportation.commuteMiles} miles
                  </span>
                </div>
                <input
                  id="commuteMiles"
                  type="range"
                  min="0"
                  max="400"
                  step="10"
                  value={answers.transportation.commuteMiles}
                  onChange={(e) =>
                    updateSubField("transportation", "commuteMiles", parseInt(e.target.value))
                  }
                  className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0 mi</span>
                  <span>100 mi</span>
                  <span>200 mi</span>
                  <span>400+ mi</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="flightsLength" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                Aeroplane Travels (Annual Flight Intensity)
              </label>
              <div id="flights-group" className="grid grid-cols-2 sm:grid-cols-5 gap-2" role="group" aria-label="Flight Intensity">
                {[
                  { id: "none", label: "None" },
                  { id: "short", label: "1-2 Short" },
                  { id: "medium", label: "3-5 Med" },
                  { id: "long", label: "1-2 Long" },
                  { id: "frequent", label: "Frequent" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    id={`btn-flights-${opt.id}`}
                    type="button"
                    onClick={() => updateSubField("transportation", "flightsLength", opt.id)}
                    className={`px-2 py-3 text-center text-xs font-bold rounded-xl border transition-all min-h-[46px] focus:outline-none ${buttonStyleFor("transportation", "flightsLength", opt.id)}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div id="step-1-nourishment" className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="dietType" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                Primary Nutritional Diet Style
              </label>
              <div id="diet-group" className="grid grid-cols-1 sm:grid-cols-5 gap-2" role="group" aria-label="Diet type">
                {[
                  { id: "heavy_meat", title: "Heavy Meat", desc: "Frequent beef & pork" },
                  { id: "balanced", title: "Balanced", desc: "Mixed meat/greens" },
                  { id: "low_meat", title: "Low Meat", desc: "Mostly poultry/fish" },
                  { id: "vegetarian", title: "Vegetarian", desc: "No meat, eats dairy" },
                  { id: "vegan", title: "Vegan", desc: "100% plant-based" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    id={`btn-diet-${opt.id}`}
                    type="button"
                    onClick={() => updateSubField("food", "dietType", opt.id)}
                    className={`p-3 text-center rounded-xl border transition-all min-h-[70px] flex flex-col justify-center items-center focus:outline-none ${buttonStyleFor("food", "dietType", opt.id)}`}
                  >
                    <span className="text-sm font-bold block">{opt.title}</span>
                    <span className="text-[9px] opacity-75 block mt-0.5">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <label htmlFor="organicLocal" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                  Organic & Local Food Choice
                </label>
                <div id="organic-group" className="grid grid-cols-3 gap-2" role="group">
                  {[
                    { id: "rarely", label: "Rarely" },
                    { id: "sometimes", label: "Sometimes" },
                    { id: "mostly", label: "Mostly / All" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      id={`btn-org-${opt.id}`}
                      type="button"
                      onClick={() => updateSubField("food", "organicLocal", opt.id)}
                      className={`px-2 py-2.5 text-xs font-bold rounded-xl border transition-all min-h-[44px] focus:outline-none ${buttonStyleFor("food", "organicLocal", opt.id)}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <label htmlFor="foodWaste" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                  Household Food Trash Volume
                </label>
                <div id="waste-group" className="grid grid-cols-3 gap-2" role="group">
                  {[
                    { id: "low", label: "Low Waste" },
                    { id: "medium", label: "Medium Waste" },
                    { id: "high", label: "High Discard" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      id={`btn-waste-${opt.id}`}
                      type="button"
                      onClick={() => updateSubField("food", "foodWaste", opt.id)}
                      className={`px-2 py-2.5 text-xs font-bold rounded-xl border transition-all min-h-[44px] focus:outline-none ${buttonStyleFor("food", "foodWaste", opt.id)}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div id="step-2-shelter" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label htmlFor="homeSize" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                  Home Space Footprint
                </label>
                <div id="homesize-group" className="grid grid-cols-1 gap-2" role="group">
                  {[
                    { id: "apartment", label: "Studio / Apartment" },
                    { id: "townhouse", label: "Townhouse / Duplex" },
                    { id: "house_medium", label: "Medium House" },
                    { id: "house_large", label: "Large Single Family Home" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      id={`btn-home-${opt.id}`}
                      type="button"
                      onClick={() => updateSubField("energy", "homeSize", opt.id)}
                      className={`px-4 py-3 text-left text-sm rounded-xl border transition-all min-h-[44px] focus:outline-none ${buttonStyleFor("energy", "homeSize", opt.id)}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="heatingSource" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                  Heating and Insulation Energy Source
                </label>
                <div id="heat-group" className="grid grid-cols-1 gap-2" role="group">
                  {[
                    { id: "gas", label: "Gas Furnace / Fossil Gas" },
                    { id: "electric", label: "Standard Heaters" },
                    { id: "heat_pump", label: "High Efficiency Heat Pump" },
                    { id: "renewable", label: "Solar / Geothermal" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      id={`btn-heat-${opt.id}`}
                      type="button"
                      onClick={() => updateSubField("energy", "heatingSource", opt.id)}
                      className={`px-4 py-3 text-left text-sm rounded-xl border transition-all min-h-[44px] focus:outline-none ${buttonStyleFor("energy", "heatingSource", opt.id)}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Checkbox for Green Power */}
            <div
              id="green-power-toggle"
              onClick={() => updateSubField("energy", "greenElectricity", !answers.energy.greenElectricity)}
              className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${
                answers.energy.greenElectricity
                  ? isTwilightMode ? "bg-[#1E2530] border-amber-400 text-amber-300" : "bg-emerald-50/70 border-emerald-400 text-slate-800 font-bold"
                  : isTwilightMode ? "bg-[#161D26] border-[#232A31] text-slate-400" : "bg-white border-[#E4E2DB] text-stone-600 hover:border-stone-400"
              }`}
            >
              <div>
                <span className="font-bold text-sm block">100% Green Electricity Option</span>
                <span className="text-xs opacity-85 block">We purchase certificates or utilize solar panels</span>
              </div>
              <div
                className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 ${
                  answers.energy.greenElectricity ? "bg-emerald-600" : "bg-slate-350"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                    answers.energy.greenElectricity ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div id="step-3-consumption" className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="purchaseFrequency" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                New Clothing, Devices & Material Purchases
              </label>
              <div id="retail-group" className="grid grid-cols-1 gap-2" role="group">
                {[
                  { id: "minimal", label: "Minimalist (Only buy essentials / replacement)" },
                  { id: "moderate", label: "Moderate (Occasions & essential goods)" },
                  { id: "frequent", label: "Frequent (Recreational purchases / new seasons)" },
                  { id: "excessive", label: "Excessive / Fast Retail (Regular deliveries)" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    id={`btn-purchase-${opt.id}`}
                    type="button"
                    onClick={() => updateSubField("shopping", "purchaseFrequency", opt.id)}
                    className={`px-4 py-3 text-left text-sm rounded-xl border transition-all min-h-[44px] focus:outline-none ${buttonStyleFor("shopping", "purchaseFrequency", opt.id)}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="secondHand" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                Do you purchase Second-Hand, Resold or Restored goods?
              </label>
              <div id="secondhand-group" className="grid grid-cols-4 gap-2" role="group">
                {[
                  { id: "never", label: "Never" },
                  { id: "sometimes", label: "Sometimes" },
                  { id: "often", label: "Often" },
                  { id: "always", label: "Always" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    id={`btn-sh-${opt.id}`}
                    type="button"
                    onClick={() => updateSubField("shopping", "secondHand", opt.id)}
                    className={`px-2 py-3 text-center text-xs font-bold rounded-xl border transition-all min-h-[44px] focus:outline-none ${buttonStyleFor("shopping", "secondHand", opt.id)}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div id="step-4-waste" className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="recyclingLevel" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                Recycling Thoroughness Level
              </label>
              <div id="recycling-group" className="grid grid-cols-3 gap-2" role="group">
                {[
                  { id: "none", label: "None / Trash all" },
                  { id: "partial", label: "Partial sorting" },
                  { id: "complete", label: "Rigorous sorting" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    id={`btn-rcy-${opt.id}`}
                    type="button"
                    onClick={() => updateSubField("waste", "recyclingLevel", opt.id)}
                    className={`px-3 py-3.5 text-center text-xs font-bold rounded-xl border transition-all min-h-[50px] focus:outline-none ${buttonStyleFor("waste", "recyclingLevel", opt.id)}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="singleUsePlastics" className={`block text-xs uppercase tracking-widest ${labelClass}`}>
                Weekly single-use plastics frequency
              </label>
              <div id="plastics-group" className="grid grid-cols-3 gap-2" role="group">
                {[
                  { id: "minimal", label: "Minimal (Reusable cups)" },
                  { id: "moderate", label: "Moderate (Occasional takeaway)" },
                  { id: "high", label: "High (Bottled fluids daily)" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    id={`btn-plastic-${opt.id}`}
                    type="button"
                    onClick={() => updateSubField("waste", "singleUsePlastics", opt.id)}
                    className={`px-3 py-3.5 text-center text-xs font-bold rounded-xl border transition-all min-h-[50px] focus:outline-none ${buttonStyleFor("waste", "singleUsePlastics", opt.id)}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              id="composting-toggle"
              onClick={() => updateSubField("waste", "composting", !answers.waste.composting)}
              className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${
                answers.waste.composting
                  ? isTwilightMode ? "bg-[#1E2530] border-amber-400 text-amber-300" : "bg-emerald-50/70 border-emerald-400 text-slate-800 font-bold"
                  : isTwilightMode ? "bg-[#161D26] border-[#232A31] text-slate-400" : "bg-white border-[#E4E2DB] text-stone-600 hover:border-stone-400"
              }`}
            >
              <div>
                <span className="font-bold text-sm block">Organic Food Composting</span>
                <span className="text-xs opacity-85 block">We divert organic wastes safely away from landfills</span>
              </div>
              <div
                className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 ${
                  answers.waste.composting ? "bg-emerald-600" : "bg-slate-350"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                    answers.waste.composting ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div
        id="conversational-loading-pane"
        className={`w-full max-w-2xl mx-auto rounded-3xl border px-8 py-14 text-center shadow-lg flex flex-col items-center justify-center space-y-6 transition-all duration-500 ${
          isTwilightMode ? "bg-[#12181F] border-[#232A31]" : "bg-[#FCFAF6] border-[#E4E2DB]"
        }`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="p-4 bg-emerald-700/10 rounded-full text-emerald-600 animate-pulse"
        >
          <Sparkles className="w-10 h-10" />
        </motion.div>

        <div className="space-y-2">
          <h2 className={`text-xl font-bold font-sans ${isTwilightMode ? "text-stone-100" : "text-stone-900"}`}>
            Scribing Your Environmental reflection...
          </h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Our AI engine is evaluating your lifestyle responses to calculate approximate carbon projections and craft a personalized Carbon Identity.
          </p>
        </div>

        <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-600"
            animate={{ x: [-120, 120] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    );
  }

  const currentInfo = stepsInfo[step];

  return (
    <div
      id="conversational-assessment-box"
      className={`w-full max-w-2xl mx-auto rounded-3xl border p-6 md:p-8 shadow-xl relative transition-all duration-500 ${
        isTwilightMode ? "bg-[#0F141C]/90 border-[#232A31] text-stone-100" : "bg-[#FCFAF6]/90 border-[#E4E2DB] text-stone-900"
      }`}
    >
      {/* Step details header */}
      <div id="assessment-steps-header" className="flex items-center justify-between mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#9A9892]">
          Category {step + 1} of 5
        </span>
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={`progress-dot-${i}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-emerald-600" : i < step ? "w-2 bg-emerald-800/45" : "w-1.5 bg-stone-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div id="assessment-content-question" className="space-y-1 mb-8">
        <h2 className={`text-2xl font-black font-sans tracking-tight`}>
          {currentInfo?.title}
        </h2>
        <p className={`text-sm italic font-serif opacity-80`}>
          &ldquo;{currentInfo?.description}&rdquo;
        </p>
      </div>

      <div id="assessment-form-container" className="min-h-[240px] mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav Wizard Controls */}
      <div id="assessment-navigation-controls" className="flex justify-between items-center border-t border-slate-205/35 pt-5">
        <button
          id="btn-prev-step"
          type="button"
          onClick={handlePrev}
          disabled={step === 0}
          className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 text-sm font-bold transition-all min-h-[44px] ${
            step === 0
              ? "opacity-30 cursor-not-allowed"
              : isTwilightMode ? "border-[#232A31] text-slate-300 bg-[#161D26] hover:bg-[#1C2530]" : "border-[#E4E2DB] text-stone-700 bg-white hover:bg-stone-50"
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          id="btn-next-step"
          type="button"
          onClick={handleNext}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 font-bold text-sm text-stone-100 flex items-center gap-2 active:scale-95 shadow-md transition-all cursor-pointer min-h-[44px]"
        >
          {step === 4 ? "Complete reflection" : "Next"} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
