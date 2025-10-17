"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@/lib/http';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function LearnerCoursesPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['learner','courses'],
    queryFn: async () => (await http.get('/learner/courses')).data as { enrolled: any[]; completed: any[]; pending: any[] },
  });

  const markProgress = useMutation({
    mutationFn: async ({ courseId, lessonId }: { courseId: string; lessonId: string; }) => (await http.post('/learner/courses', { action: 'progress', courseId, lessonId, completed: true })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learner','courses'] }),
  });

  return (
    <div className="space-y-6">
      {(['enrolled','completed','pending'] as const).map((k) => (
        <Card key={k}>
          <CardHeader><CardTitle>{k[0].toUpperCase()+k.slice(1)} Courses</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data?.[k]?.map((e: any) => (
              <div key={e.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{e.course.title}</div>
                  <div className="text-xs text-muted-foreground">By {e.course.tutor.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => http.post('/learner/courses', { action: 'enroll', courseId: e.courseId }).then(() => qc.invalidateQueries({ queryKey: ['learner','courses'] }))}>Enroll</Button>
                  <Button size="sm" variant="outline" onClick={() => markProgress.mutate({ courseId: e.courseId, lessonId: 'lesson-1' })}>Mark lesson 1 done</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
