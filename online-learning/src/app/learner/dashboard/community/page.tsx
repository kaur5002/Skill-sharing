"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@/lib/http';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function CommunityPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['circles'], queryFn: async () => (await http.get('/learner/circles')).data as any[] });
  const join = useMutation({ mutationFn: async (id: string) => (await http.post(`/learner/circles/${id}/join`, {})).data, onSuccess: () => qc.invalidateQueries({ queryKey: ['circles'] }) });

  return (
    <Card>
      <CardHeader><CardTitle>Skill Circles</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {data?.map(c => (
          <div key={c.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{c.title}</div>
              <div className="text-xs text-muted-foreground">Topic: {c.topic} • Members: {c._count?.members ?? 0}</div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/learner/dashboard/community/${c.id}`}><Button size="sm" variant="outline">View</Button></Link>
              <Button size="sm" onClick={() => join.mutate(c.id)}>Join</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
