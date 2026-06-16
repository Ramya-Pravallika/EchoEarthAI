import { CheckCircle2 } from "lucide-react";
import { CarbonReflection } from "../../../types";

interface DailyMissionsProps {
  reflection: CarbonReflection;
  completedMissions: string[];
  handleToggleMission: (missionId: string, ptsReward: number) => void;
  isTwilightMode: boolean;
}

export default function DailyMissions({
  reflection,
  completedMissions,
  handleToggleMission,
  isTwilightMode,
}: DailyMissionsProps) {
  const cardThemeClass = isTwilightMode ? "geometric-card-dark" : "geometric-card";
  const titleTextClass = isTwilightMode ? "text-stone-100" : "text-stone-900";
  const bodyTextClass = isTwilightMode ? "text-slate-300" : "text-stone-700 font-serif";
  const mutedTextClass = isTwilightMode ? "text-slate-400" : "text-stone-500";

  return (
    <div
      id="daily-missions-container"
      className={`${cardThemeClass} p-6 space-y-4 transition-colors duration-500`}
    >
      <div className="flex justify-between items-center">
        <h4 className={`font-bold tracking-tight text-base flex items-center gap-2 ${titleTextClass}`}>
          <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Micro Daily Missions
        </h4>
        <span
          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
            isTwilightMode ? "bg-slate-800 text-slate-300" : "bg-stone-200 text-stone-700"
          }`}
        >
          Resets daily
        </span>
      </div>

      <p className={`text-xs leading-relaxed ${bodyTextClass}`}>
        Small choices cascade into planetary wave shifts. Check off your microtasks today to reflect back on your forest biome pool.
      </p>

      <div className="space-y-3 pt-1">
        {reflection.dailyMissions.map((mission) => {
          const isDone = completedMissions.includes(mission.id);
          return (
            <div
              key={mission.id}
              id={`mission-card-${mission.id}`}
              onClick={() => handleToggleMission(mission.id, mission.pointsReward)}
              className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-4 ${
                isDone
                  ? isTwilightMode
                    ? "bg-emerald-950/20 border-emerald-800/40 text-slate-400"
                    : "bg-emerald-50/50 text-stone-600 border-emerald-300"
                  : isTwilightMode
                  ? "bg-[#161D26] border-[#232A31] hover:border-slate-500"
                  : "bg-[#FCFAF6] border-[#E4E2DB] hover:border-stone-400"
              }`}
            >
              <div className="pt-0.5">
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    isDone ? "bg-emerald-700 border-emerald-700 text-white" : "border-stone-400"
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-sm font-semibold ${
                      isDone ? "line-through text-stone-400" : titleTextClass
                    }`}
                  >
                    {mission.title}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      isTwilightMode ? "bg-[#232A31] text-slate-400" : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {mission.category}
                  </span>
                </div>
                <p className={`text-xs ${isDone ? "text-stone-400" : bodyTextClass}`}>
                  {mission.description}
                </p>
              </div>

              <div className="ml-auto text-right self-center">
                <span
                  className={`text-xs font-bold font-mono ${
                    isDone ? "text-emerald-700 font-black" : mutedTextClass
                  }`}
                >
                  +{mission.pointsReward}pts
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export { DailyMissions };
