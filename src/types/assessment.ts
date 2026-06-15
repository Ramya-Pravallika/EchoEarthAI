export interface AssessmentAnswers {
  transportation: {
    commuteMethod: "car_gas" | "car_hybrid" | "car_ev" | "public_transit" | "active" | "none";
    commuteMiles: number; // miles per week
    flightsLength: "none" | "short" | "medium" | "long" | "frequent";
  };
  food: {
    dietType: "heavy_meat" | "balanced" | "low_meat" | "vegetarian" | "vegan";
    organicLocal: "rarely" | "sometimes" | "mostly";
    foodWaste: "low" | "medium" | "high";
  };
  energy: {
    homeSize: "apartment" | "townhouse" | "house_medium" | "house_large";
    heatingSource: "gas" | "electric" | "heat_pump" | "renewable";
    greenElectricity: boolean;
  };
  shopping: {
    purchaseFrequency: "minimal" | "moderate" | "frequent" | "excessive";
    secondHand: "never" | "sometimes" | "often" | "always";
  };
  waste: {
    recyclingLevel: "none" | "partial" | "complete";
    composting: boolean;
    singleUsePlastics: "high" | "moderate" | "minimal";
  };
}

export interface CarbonIdentity {
  title: string;
  description: string;
  dominantHabit: string;
  contributorExplanation: string;
}

export interface Intervention {
  actionId: string;
  title: string;
  category: "transportation" | "food" | "energy" | "shopping" | "waste";
  co2Savings: number; // in tons / year
  investmentEffort: "Low" | "Medium" | "High";
  costSavings: "Low" | "Medium" | "High";
  empatheticExplanation: string;
  steps: string[];
  isAdopted: boolean;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  category: "transportation" | "food" | "energy" | "shopping" | "waste";
  impactLevel: "Low" | "Medium" | "High";
  isCompleted: boolean;
  pointsReward: number;
}

export interface CarbonReflection {
  carbonIdentity: CarbonIdentity;
  estimatedTotalCO2: number; // metric tons / year
  breakdown: {
    transportation: number;
    food: number;
    energy: number;
    shopping: number;
    waste: number;
  };
  reasoning: string;
  empatheticAnalysis: string;
  interventions: Intervention[];
  dailyMissions: DailyMission[];
}
