"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@/lib/http';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SavedTutorsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['learner','savedTutors'], queryFn: async () => (await http.get('/learner/saved-tutors')).data as any[] });
  const remove = useMutation({
    mutationFn: async (tutorId: string) => (await http.delete('/learner/saved-tutors', { data: { tutorId } })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learner','savedTutors'] }),
  });
  return (
    <Card>
      <CardHeader><CardTitle>Saved Tutors</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {data?.map((s) => (
          <div key={s.id} className="flex items-center justify-between">
            <div className="font-medium">{s.tutor?.name ?? s.tutorId}</div>
            <Button size="sm" variant="outline" onClick={() => remove.mutate(s.tutorId)}>Remove</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
