import { z } from "zod";

export const TransportationAnswersSchema = z.object({
  commuteMethod: z.enum(["car_gas", "car_hybrid", "car_ev", "public_transit", "active", "none", "car", "hybrid", "ev", "public"]),
  commuteMiles: z.number().nonnegative(),
  flightsLength: z.enum(["none", "short", "medium", "long", "frequent", "heavily", "sometimes", "rarely"]),
});

export const FoodAnswersSchema = z.object({
  dietType: z.enum(["heavy_meat", "balanced", "low_meat", "vegetarian", "vegan", "Meat-rich", "Balanced", "Vegetarian", "Vegan"]),
  organicLocal: z.enum(["rarely", "sometimes", "mostly", "Never", "Sometimes", "Mostly"]),
  foodWaste: z.enum(["low", "medium", "high", "Low", "Medium", "High"]),
});

export const EnergyAnswersSchema = z.object({
  homeSize: z.enum(["apartment", "townhouse", "house_medium", "house_large", "Apartment", "Townhouse", "Medium Suburban", "Large Mansion"]),
  heatingSource: z.enum(["gas", "electric", "heat_pump", "renewable", "Gas", "Coal", "Electric"]),
  greenElectricity: z.boolean(),
});

export const ShoppingAnswersSchema = z.object({
  purchaseFrequency: z.enum(["minimal", "moderate", "frequent", "excessive", "heavily", "Moderate"]),
  secondHand: z.enum(["never", "sometimes", "often", "always", "Never", "Sometimes", "Often", "Always"]),
});

export const WasteAnswersSchema = z.object({
  recyclingLevel: z.enum(["none", "partial", "complete", "None", "Partial", "Complete"]),
  composting: z.boolean(),
  singleUsePlastics: z.enum(["high", "moderate", "minimal", "heavily", "Moderate", "Minimal"]),
});

export const AssessmentAnswersSchema = z.object({
  transportation: TransportationAnswersSchema,
  food: FoodAnswersSchema,
  energy: EnergyAnswersSchema,
  shopping: ShoppingAnswersSchema,
  waste: WasteAnswersSchema,
});

export const NarrativeReportRequestSchema = z.object({
  identityTitle: z.string().optional(),
  co2Value: z.number().nonnegative().optional(),
  actionsAdoptedCount: z.number().nonnegative().optional(),
  totalPoints: z.number().nonnegative().optional(),
  ecoMood: z.string().optional(),
});

export const CoachChatRequestSchema = z.object({
  history: z.array(z.object({
    role: z.enum(["user", "model"]),
    text: z.string(),
  })).optional(),
  message: z.string().min(1),
  identityTitle: z.string().optional(),
  estimatedTotalCO2: z.number().optional(),
});

export const JournalAnalysisRequestSchema = z.object({
  entry: z.string().min(1),
  identityTitle: z.string().optional(),
});

export const NudgesRequestSchema = z.object({
  identityTitle: z.string().optional(),
  breakdown: z.record(z.string(), z.number()).optional(),
  adoptedIds: z.array(z.string()).optional(),
});
