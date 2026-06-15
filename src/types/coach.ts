export interface CoachChatMessage {
  role: "user" | "model";
  text: string;
}

export interface CoachState {
  history: CoachChatMessage[];
  isThinking: boolean;
}
