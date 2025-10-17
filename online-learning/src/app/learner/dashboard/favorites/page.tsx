"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@/lib/http';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function FavoritesPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['learner','favorites'], queryFn: async () => (await http.get('/learner/favorites')).data as any[] });
  const remove = useMutation({
    mutationFn: async (courseId: string) => (await http.delete('/learner/favorites', { data: { courseId } })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learner','favorites'] }),
  });
  return (
    <Card>
      <CardHeader><CardTitle>Favorite Courses</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {data?.map((f) => (
          <div key={f.id} className="flex items-center justify-between">
            <div className="font-medium">{f.course?.title ?? f.courseId}</div>
            <Button size="sm" variant="outline" onClick={() => remove.mutate(f.courseId)}>Remove</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
