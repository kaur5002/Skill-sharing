"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@/lib/http';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

export default function LearnerReviewsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['learner','reviews'], queryFn: async () => (await http.get('/learner/reviews')).data as any[] });

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [courseId, setCourseId] = useState('');

  const submit = useMutation({
    mutationFn: async () => (await http.post(`/learner/courses/${courseId}/reviews`, { rating, comment })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learner','reviews'] }),
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader><CardTitle>Add or Update Review</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="Course ID" value={courseId} onChange={e => setCourseId(e.target.value)} />
          <Input type="number" min={1} max={5} value={rating} onChange={e => setRating(Number(e.target.value))} />
          <Input placeholder="Comment" value={comment} onChange={e => setComment(e.target.value)} />
          <Button onClick={() => submit.mutate()} disabled={!courseId}>Submit</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Your Reviews</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data?.map(r => (
            <div key={r.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{r.course?.title ?? r.courseId}</div>
                <div className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
              <div>{r.rating}★</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
