import { Intervention, DailyMission } from "../../types/index";

export function getDefaultInterventions(): Intervention[] {
  return [
    {
      actionId: "transit_group",
      title: "Active commute swap & flight offset",
      category: "transportation",
      co2Savings: 1.8,
      investmentEffort: "Low",
      costSavings: "High",
      empatheticExplanation: "Swap private gasoline car miles for virtual transit or public loops.",
      steps: ["Route commute options", "Group weekend runs", "Offset flight bookings"],
      isAdopted: false,
    },
    {
      actionId: "meat_limit",
      title: "Meatless Mondays & locally grown produce",
      category: "food",
      co2Savings: 1.2,
      investmentEffort: "Low",
      costSavings: "Medium",
      empatheticExplanation: "Incorporate more plant-based recipes to heal the biome soil levels.",
      steps: ["Plan vegetable-based options twice weekly", "Select seasonal local items"],
      isAdopted: false,
    }
  ];
}

export function getDefaultMissions(): DailyMission[] {
  return [
    {
      id: "mission_ref_1",
      title: "Compost kitchen scraps",
      description: "Sort out food peelings away from trash containers",
      category: "waste",
      impactLevel: "Low",
      isCompleted: false,
      pointsReward: 15,
    },
    {
      id: "mission_ref_2",
      title: "Unplug idle micro appliances",
      description: "Halt parasitic draw on your power sources to decrease system overhead",
      category: "energy",
      impactLevel: "Low",
      isCompleted: false,
      pointsReward: 15,
    }
  ];
}
