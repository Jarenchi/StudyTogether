"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import nookies from "nookies";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import getCurrentWeekDates from "@/utils/getCurrentWeekDate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tracker } from "@tremor/react";

interface Log {
  date: string;
  minutes: number;
  _id: string;
}

interface DashboardData {
  _id: string;
  userId: string;
  targetTime: number;
  logs: Log[];
  __v: number;
}

interface DashboardProps {
  data: DashboardData;
  userId: string;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function getAttendanceData(logs: Log[]) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate();

  return Array.from({ length: lastDay }, (_, i) => {
    const day = i + 1;
    const formattedDate = `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
    const future = new Date(year, month - 1, day) > today;
    const hasLog = logs.some((log) => new Date(log.date).getDate() === day);
    let color: "gray" | "emerald" | "rose";
    if (future) {
      color = "gray";
    } else if (hasLog) {
      color = "emerald";
    } else {
      color = "rose";
    }
    return {
      color,
      tooltip: formattedDate,
    };
  });
}

function getThisWeekData(logs: Log[]) {
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((currentDay + 6) % 7));

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((name, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    date.setHours(0, 0, 0, 0);
    const log = logs.find((l) => {
      const d = new Date(l.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === date.getTime();
    });
    return { name, minutes: log?.minutes ?? 0 };
  });
}

// ── custom tooltip ────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="font-semibold mb-0.5">{label}</p>
      <p className="text-primary">{formatTime(payload[0].value)}</p>
    </div>
  );
};

// ── component ─────────────────────────────────────────────────────────────────

const Dashboard = ({ data, userId }: DashboardProps) => {
  const [targetTime, setTargetTime] = useState(data.targetTime);
  const queryClient = useQueryClient();

  const weekData = getThisWeekData(data.logs);
  const weekTotal = weekData.reduce((sum, d) => sum + d.minutes, 0);
  const totalMinutes = data.logs.reduce((sum, l) => sum + l.minutes, 0);
  const attendance = getAttendanceData(data.logs);
  const attendedDays = attendance.filter((d) => d.color === "emerald").length;
  const attendanceRate = ((attendedDays / attendance.length) * 100).toFixed(1);
  const thisWeekDates = getCurrentWeekDates();
  const today = new Date();
  const monthLabel = today.toLocaleString("default", { month: "long", year: "numeric" });
  const reachedGoal = weekTotal >= targetTime;

  const mutation = useMutation({
    mutationFn: (newTarget: number) =>
      axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/usages/${data._id}/target`,
        { targetTime: newTarget },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      ),
    // Optimistic update: immediately reflect the new target in the UI
    onMutate: async (newTarget) => {
      await queryClient.cancelQueries({ queryKey: ["usages", userId] });
      const previous = queryClient.getQueryData(["usages", userId]);
      queryClient.setQueryData(["usages", userId], (old: any) => ({ ...old, targetTime: newTarget }));
      return { previous };
    },
    onError: (_err, _newTarget, context) => {
      // Rollback on failure
      queryClient.setQueryData(["usages", userId], context?.previous);
      setTargetTime(data.targetTime);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["usages", userId] });
    },
  });

  return (
    <div className="space-y-6 mt-4 animate-fade-in">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Weekly goal */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">本週學習目標</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`flex items-center gap-2 mb-3 text-sm font-medium ${
                reachedGoal ? "text-emerald-600" : "text-rose-500"
              }`}
            >
              {reachedGoal ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {reachedGoal ? "本週目標達成！" : `還差 ${formatTime(targetTime - weekTotal)}`}
            </div>
            <p className="text-3xl font-display font-bold mb-4">{formatTime(weekTotal)}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                aria-label="Decrease target"
                className="p-1.5 rounded-full border hover:bg-muted transition-colors"
                onClick={() => setTargetTime((p) => Math.max(p - 30, 0))}
              >
                <MinusIcon className="h-3.5 w-3.5" />
              </button>
              <div className="text-center">
                <div className="text-2xl font-bold">{targetTime}</div>
                <div className="text-xs text-muted-foreground">mins/week</div>
              </div>
              <button
                type="button"
                aria-label="Increase target"
                className="p-1.5 rounded-full border hover:bg-muted transition-colors"
                onClick={() => setTargetTime((p) => p + 30)}
              >
                <PlusIcon className="h-3.5 w-3.5" />
              </button>
            </div>
            <Button
              className="w-full mt-3"
              size="sm"
              onClick={() => mutation.mutate(targetTime)}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "儲存中..." : "設定目標"}
            </Button>
          </CardContent>
        </Card>

        {/* Total time */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">累積學習時間</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[calc(100%-4rem)]">
            <p className="text-4xl font-display font-bold text-primary">{formatTime(totalMinutes)}</p>
          </CardContent>
        </Card>

        {/* Attendance */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-muted-foreground">出勤紀錄</CardTitle>
              <span className="text-xs text-muted-foreground">{monthLabel}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end text-sm text-muted-foreground mb-2">
              {attendanceRate}% ({attendedDays}/{attendance.length} 天)
            </div>
            <Tracker data={attendance} />
          </CardContent>
        </Card>
      </div>

      {/* Weekly bar chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">本週學習時間 ({thisWeekDates})</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weekData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatTime} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={56} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="minutes" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {weekData.map((entry, i) => (
                  <Cell
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    fill={entry.minutes > 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
