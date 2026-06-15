import { useState } from "react";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  completed: boolean;
  co2Saved: number;
}

export function useCommunity() {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "c1",
      title: "Meatless Mondays",
      description: "Pledge to eat plant-based every Monday this month.",
      participants: 1243,
      completed: false,
      co2Saved: 15,
    },
    {
      id: "c2",
      title: "Phantom Load Snuffer",
      description: "Unplug standby devices before going to sleep.",
      participants: 843,
      completed: true,
      co2Saved: 5,
    },
  ]);

  const joinChallenge = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, participants: c.participants + 1 } : c))
    );
  };

  return { challenges, joinChallenge };
}
export default useCommunity;
