import { useState } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { DatePicker } from "@/components/common/DatePicker";

interface AttendanceOverviewProps {
  totalEmployees: number;
  presentCount: number;
  absentCount?: number;
  lateCount?: number;
  onLeaveCount: number;
  loading?: boolean;
}

export function AttendanceOverview({
  totalEmployees,
  presentCount,
  absentCount = 0,
  lateCount = 0,
  onLeaveCount,
  loading = false,
}: AttendanceOverviewProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const calculatedAbsent = absentCount || Math.max(0, totalEmployees - presentCount - onLeaveCount);
  const presentPct = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0;
  const onLeavePct = totalEmployees > 0 ? Math.round((onLeaveCount / totalEmployees) * 100) : 0;
  const absentPct = totalEmployees > 0 ? Math.round((calculatedAbsent / totalEmployees) * 100) : 0;

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-600" />
            Attendance & Workforce Overview
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time workforce presence status</p>
        </div>

        <div className="flex items-center gap-3">
          <DatePicker
            value={selectedDate}
            onChange={(d) => setSelectedDate(d || new Date().toISOString().slice(0, 10))}
            className="w-36"
          />
          <Link
            to="/attendance"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 flex-shrink-0"
          >
            Attendance Logs <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="h-28 bg-muted animate-pulse rounded-lg" />
      ) : (
        <div className="space-y-4">
          {/* Segmented Distribution Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-foreground">Workforce Presence Rate</span>
              <span className="text-emerald-600 font-bold">{presentPct}% Present</span>
            </div>

            <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex gap-0.5">
              <div
                style={{ width: `${presentPct}%` }}
                className="bg-emerald-500 transition-all duration-300"
                title={`Present: ${presentCount}`}
              />
              <div
                style={{ width: `${onLeavePct}%` }}
                className="bg-purple-500 transition-all duration-300"
                title={`On Leave: ${onLeaveCount}`}
              />
              <div
                style={{ width: `${absentPct}%` }}
                className="bg-rose-400 transition-all duration-300"
                title={`Absent: ${calculatedAbsent}`}
              />
            </div>
          </div>

          {/* Metric Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
                <span className="text-xs font-semibold">Present</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xl font-extrabold text-emerald-800 dark:text-emerald-200 mt-1.5 tabular-nums leading-none">{presentCount}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-800/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-purple-700 dark:text-purple-300">
                <span className="text-xs font-semibold">On Leave</span>
                <span className="h-2 w-2 rounded-full bg-purple-500" />
              </div>
              <p className="text-xl font-extrabold text-purple-800 dark:text-purple-200 mt-1.5 tabular-nums leading-none">{onLeaveCount}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-700 dark:text-amber-300">
                <span className="text-xs font-semibold">Late Arrivals</span>
                <span className="h-2 w-2 rounded-full bg-amber-500" />
              </div>
              <p className="text-xl font-extrabold text-amber-800 dark:text-amber-200 mt-1.5 tabular-nums leading-none">{lateCount}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-800/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-rose-700 dark:text-rose-300">
                <span className="text-xs font-semibold">Absent</span>
                <span className="h-2 w-2 rounded-full bg-rose-500" />
              </div>
              <p className="text-xl font-extrabold text-rose-800 dark:text-rose-200 mt-1.5 tabular-nums leading-none">{calculatedAbsent}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
