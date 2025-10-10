"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@/lib/http';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AnalyticsPage() {
  const qc = useQueryClient();
  const { data: progress } = useQuery({ queryKey: ['learner','progress'], queryFn: async () => (await http.get('/learner/progress')).data as { byCourse: Array<{ courseId:string; courseTitle:string; percent:number }>; totalHours: number } });
  const { data: rec } = useQuery({ queryKey: ['learner','recs'], queryFn: async () => (await http.get('/learner/recommendations')).data as { courses: any[]; tutors: any[] } });

  const issueCert = useMutation({
    mutationFn: async (courseId: string) => (await http.post(`/learner/courses/${courseId}/certificate`, {})).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learner','progress'] }),
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Total Learning Time</CardTitle></CardHeader>
        <CardContent>{progress?.totalHours ?? 0} hours</CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Course Progress</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {progress?.byCourse?.map(c => (
            <div key={c.courseId} className="space-y-1">
              <div className="flex items-center justify-between"><div className="font-medium">{c.courseTitle}</div><div>{c.percent}%</div></div>
              <div className="h-2 rounded bg-muted overflow-hidden"><div className="h-2 bg-primary" style={{ width: `${c.percent}%` }} /></div>
              <Button size="sm" disabled={c.percent < 80} onClick={() => issueCert.mutate(c.courseId)}>Get Certificate</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recommended for You</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="font-semibold mb-2">Courses</div>
            <ul className="space-y-1">
              {rec?.courses?.map(c => (<li key={c.id}>{c.title}</li>))}
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Tutors</div>
            <ul className="space-y-1">
              {rec?.tutors?.map((t: any) => (<li key={t.id}>{t.userId}</li>))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
