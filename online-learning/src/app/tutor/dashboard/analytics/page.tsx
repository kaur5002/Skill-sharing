"use client";
import { useEffect, useState } from 'react';
import { http } from '@/lib/http';
import { Card } from '@/components/ui/Card';

type Trend = { weekStart: string; avg: number; count: number };
type TopCourse = { id: string; title: string; reviewsCount: number; avgRating: number; sessionsCount: number };

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { http.get('/tutor/analytics').then(r => setData(r.data)); }, []);
  return (
    <div className="grid gap-4">
      <Card className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metric label="Sessions (30d)" value={data?.sessionsCount} />
        <Metric label="Learners joined" value={data?.learnersJoined} />
        <Metric label="Earnings net (30d)" value={`$${(data?.earningsNet ?? 0).toFixed(2)}`} />
        <Metric label="Engagement (msgs/feedback)" value={`${data?.engagementRate?.messages ?? 0}/${data?.engagementRate?.feedback ?? 0}`} />
      </Card>
      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Rating trend (weekly)</div>
        <div className="grid gap-1 text-sm">
          {data?.ratingTrend?.map((t: Trend) => (
            <div key={t.weekStart} className="flex items-center justify-between">
              <div>{new Date(t.weekStart).toLocaleDateString()}</div>
              <div>{t.avg.toFixed(1)}★ ({t.count})</div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Top courses</div>
        <div className="grid gap-1 text-sm">
          {data?.topCourses?.map((c: TopCourse) => (
            <div key={c.id} className="flex items-center justify-between">
              <div className="truncate">{c.title}</div>
              <div>{c.avgRating.toFixed(1)}★ · {c.reviewsCount} reviews · {c.sessionsCount} sessions</div>
            </div>
          ))}
        </div>
      </Card>
      {data?.suggestion && (
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Suggestion</div>
          <div>{data.suggestion}</div>
        </Card>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold">{value ?? '-'}</div>
    </div>
  );
}
