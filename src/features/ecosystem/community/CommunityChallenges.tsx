import { useState } from "react";
import { Users, Plus, Award, Trophy, Star, ArrowUpRight, Flame } from "lucide-react";

interface CommunityChallengesProps {
  isTwilightMode: boolean;
  userPoints: number;
}

interface Challenge {
  id: string;
  title: string;
  groupName: string;
  activeCount: number;
  progressPct: number;
  totalGoal: string;
  daysRemaining: number;
  joined: boolean;
}

export default function CommunityChallenges({
  isTwilightMode,
  userPoints,
}: CommunityChallengesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "ch-1",
      title: "No-Meat Week Challenge",
      groupName: "Earth Rangers University",
      activeCount: 142,
      progressPct: 75,
      totalGoal: "500 meals saved",
      daysRemaining: 3,
      joined: true,
    },
    {
      id: "ch-2",
      title: "Active Transit Commute Marathon",
      groupName: "GreenFuture Tech Corp",
      activeCount: 310,
      progressPct: 40,
      totalGoal: "10,000 miles biked/walked",
      daysRemaining: 12,
      joined: false,
    },
    {
      id: "ch-3",
      title: "Ditch Single-Use Water Bottles",
      groupName: "Sustainable Families Club",
      activeCount: 78,
      progressPct: 90,
      totalGoal: "2,000 plastic containers avoided",
      daysRemaining: 1,
      joined: true,
    },
  ]);

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: "Lucas Vance", points: 840, avatar: "🥑", badge: "Solar Master" },
    { rank: 2, name: "Sophia Green", points: 790, avatar: "🚲", badge: "Zero Waste Hero" },
    { rank: 3, name: "Kenji Sato", points: 720, avatar: "🌱", badge: "Compost King" },
    { rank: 4, name: "You", points: userPoints, avatar: "🍃", badge: "Active Observer" },
    { rank: 5, name: "Amara Okeke", points: 410, avatar: "⚡", badge: "Green Tech Enthusiast" },
  ]);

  // Handle joining/leaving a group challenge
  const toggleJoin = (id: string) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          const joined = !ch.joined;
          return {
            ...ch,
            joined,
            activeCount: joined ? ch.activeCount + 1 : ch.activeCount - 1,
            progressPct: joined ? Math.min(100, ch.progressPct + 2) : Math.max(0, ch.progressPct - 2),
          };
        }
        return ch;
      })
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="community-main-layout flex bg-slate">
      {/* Active Team Challenges Section */}
      <div
        id="community-challenges-card"
        className={`lg:col-span-8 p-6 rounded-2xl border transition-all duration-500 space-y-4 ${
          isTwilightMode ? "bg-[#121820] border-[#232A31]" : "bg-[#FCFAF6] border-[#E4E2DB]"
        }`}
      >
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div className="space-y-0.5">
            <span className={`text-[10px] uppercase font-bold tracking-widest block text-emerald-600`}>
              ✦ Co-Op Environmental Missions ✦
            </span>
            <h4 className={`font-bold tracking-tight text-lg flex items-center gap-1.5 ${
              isTwilightMode ? "text-stone-100" : "text-stone-900"
            }`}>
              <Users className="w-5 h-5 text-indigo-500" /> Community Challenges
            </h4>
            <p className={`text-xs ${isTwilightMode ? "text-slate-400" : "text-stone-500"}`}>
              Multiply your physical impact. Participate in collective targets with classmates or friends.
            </p>
          </div>

          <button
            id="btn-create-challenge"
            className="px-3.5 py-2.5 rounded-xl border border-dashed hover:bg-black/5 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-stone-700 hover:text-stone-950"
          >
            <Plus className="w-4 h-4" /> Form Group
          </button>
        </div>

        <div className="space-y-4 pt-1">
          {challenges.map((ch) => (
            <div
              key={ch.id}
              className={`p-4 rounded-xl border space-y-3 transition-colors ${
                isTwilightMode ? "bg-[#161D26] border-[#222E3C]" : "bg-white border-[#E4E2DB]"
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className={`text-[9px] font-bold uppercase ${isTwilightMode ? "text-indigo-400" : "text-indigo-600"}`}>
                    {ch.groupName}
                  </span>
                  <h5 className={`text-sm font-extrabold tracking-tight ${isTwilightMode ? "text-stone-100" : "text-stone-900"}`}>
                    {ch.title}
                  </h5>
                </div>

                <button
                  id={`btn-join-${ch.id}`}
                  onClick={() => toggleJoin(ch.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border cursor-pointer select-none transition-all active:scale-95 ${
                    ch.joined
                      ? "bg-emerald-700 border-emerald-700 text-stone-100 font-extrabold"
                      : isTwilightMode ? "border-slate-800 text-slate-300 hover:bg-slate-900" : "border-[#E4E2DB] text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  {ch.joined ? "Joined pact" : "Join team"}
                </button>
              </div>

              {/* Progress bar info */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={isTwilightMode ? "text-slate-400" : "text-stone-500"}>
                    Active Contributers: <strong>{ch.activeCount} campers</strong>
                  </span>
                  <span className={`font-mono ${isTwilightMode ? "text-amber-300" : "text-stone-900"}`}>
                    {ch.progressPct}% towards {ch.totalGoal}
                  </span>
                </div>

                <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                  isTwilightMode ? "bg-slate-800" : "bg-stone-200"
                }`}>
                  <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${ch.progressPct}%` }} />
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider">
                <span className="text-emerald-600 flex items-center gap-0.5">
                  <Flame className="w-3.5 h-3.5 fill-current" /> Streak Rewards active
                </span>
                <span className={isTwilightMode ? "text-slate-450 text-slate-400" : "text-stone-500"}>
                  {ch.daysRemaining} days remaining till evaluation
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Points Standings Section */}
      <div
        id="community-leaderboard-card"
        className={`lg:col-span-4 p-6 rounded-2xl border transition-all duration-500 space-y-4 flex flex-col ${
          isTwilightMode ? "bg-[#121820] border-[#232A31]" : "bg-[#FCFAF6] border-[#E4E2DB]"
        }`}
      >
        <div id="leaderboard-headline">
          <h4 className={`font-bold tracking-tight text-base flex items-center gap-1.5 ${
            isTwilightMode ? "text-stone-100" : "text-stone-900"
          }`}>
            <Trophy className="w-5 h-5 text-amber-500 animate-spin-slow" /> Vitality League
          </h4>
          <p className={`text-xs ${isTwilightMode ? "text-slate-400" : "text-stone-500"}`}>
            Leaderboard list of sustainable habit practitioners.
          </p>
        </div>

        <div className="flex-1 space-y-2.5">
          {leaderboard.map((user) => {
            const isMe = user.name === "You";
            return (
              <div
                key={user.rank}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                  isMe
                    ? isTwilightMode
                      ? "bg-indigo-600/15 border-indigo-500/40"
                      : "bg-indigo-50/55 border-indigo-200/50"
                    : isTwilightMode ? "bg-[#161D26]/75 border-[#222E3C]/40" : "bg-white border-[#E4E2DB]"
                }`}
              >
                {/* Rank placement layout */}
                <div className="w-6 shrink-0 text-center">
                  {user.rank === 1 ? (
                    <span className="text-lg">🥇</span>
                  ) : user.rank === 2 ? (
                    <span className="text-lg">🥈</span>
                  ) : user.rank === 3 ? (
                    <span className="text-lg">🥉</span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-400">{user.rank}</span>
                  )}
                </div>

                <div className="text-lg leading-none">{user.avatar}</div>

                <div className="space-y-0.5">
                  <span className={`text-xs font-bold leading-tight block ${isMe ? "text-indigo-600 font-extrabold" : isTwilightMode ? "text-stone-100" : "text-stone-900"}`}>
                    {user.name} {isMe && "(You)"}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 block tracking-widest uppercase">
                    {user.badge}
                  </span>
                </div>

                <div className="ml-auto text-right">
                  <span className={`text-xs font-bold font-mono text-emerald-600`}>
                    {isMe ? userPoints : user.points}pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`p-4 rounded-xl border text-[11px] font-sans font-semibold text-slate-450 leading-relaxed text-slate-400 ${
          isTwilightMode ? "bg-[#0A0D14]/70 border-[#1E252D]" : "bg-indigo-50/30 border-indigo-150 border-indigo-100"
        }`}>
          🏆 <strong>Global League Reset</strong> is scheduled for Sunday. The top 3 finalists earn custom profile badges to mirror of late.
        </div>
      </div>
    </div>
  );
}
