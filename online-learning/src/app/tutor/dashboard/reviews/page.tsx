"use client";
import { useEffect, useState } from 'react';
import { http } from '@/lib/http';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Review = { id: string; courseId: string; rating: number; comment?: string; reply?: string; createdAt: string; learner: { id: string; name: string }; course: { id: string; title: string } };

export default function ReviewsPage() {
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});
  const [reportMap, setReportMap] = useState<Record<string, string>>({});

  const load = async () => {
    const r = await http.get('/tutor/reviews');
    setAvg(r.data.averageRating);
    setCount(r.data.count);
    setReviews(r.data.reviews);
  };
  useEffect(() => { load(); }, []);

  const sendReply = async (id: string) => {
    const reply = replyMap[id];
    if (!reply) return;
    await http.post('/tutor/reviews', { reviewId: id, reply });
    await load();
  };
  const report = async (id: string) => {
    const reason = reportMap[id];
    if (!reason) return;
    await http.post('/tutor/reviews/report', { reviewId: id, reason });
    setReportMap(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="grid gap-4">
      <Card className="p-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Average rating</div>
          <div className="text-2xl font-semibold">{avg.toFixed(1)} / 5</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Total reviews</div>
          <div className="text-2xl font-semibold">{count}</div>
        </div>
      </Card>
      <Card className="p-4 space-y-3">
        <div className="text-lg font-medium">Reviews</div>
        <div className="grid gap-3">
          {reviews.map(r => (
            <div key={r.id} className="border rounded-md p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.course.title}</div>
                <div className="text-sm">{r.rating}★</div>
              </div>
              <div className="text-sm text-muted-foreground">By {r.learner.name} on {new Date(r.createdAt).toLocaleString()}</div>
              {r.comment && <div className="text-sm">{r.comment}</div>}
              {r.reply && <div className="text-sm">Tutor reply: {r.reply}</div>}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input placeholder="Write a reply..." value={replyMap[r.id] || ''} onChange={e => setReplyMap(prev => ({ ...prev, [r.id]: e.target.value }))} />
                <Button onClick={() => sendReply(r.id)}>Reply</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input placeholder="Report reason..." value={reportMap[r.id] || ''} onChange={e => setReportMap(prev => ({ ...prev, [r.id]: e.target.value }))} />
                <Button variant="outline" onClick={() => report(r.id)}>Report</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
