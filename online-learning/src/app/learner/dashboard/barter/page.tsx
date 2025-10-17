"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@/lib/http';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

export default function BarterPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['barter'], queryFn: async () => (await http.get('/learner/barter')).data as any[] });
  const [offerSkill, setOfferSkill] = useState('');
  const [wantSkill, setWantSkill] = useState('');
  const [description, setDescription] = useState('');
  const create = useMutation({ mutationFn: async () => (await http.post('/learner/barter', { offerSkill, wantSkill, description })).data, onSuccess: () => { setOfferSkill(''); setWantSkill(''); setDescription(''); qc.invalidateQueries({ queryKey: ['barter'] }); } });

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader><CardTitle>Create Offer</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="I can teach..." value={offerSkill} onChange={e => setOfferSkill(e.target.value)} />
          <Input placeholder="I want to learn..." value={wantSkill} onChange={e => setWantSkill(e.target.value)} />
          <Input placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
          <Button onClick={() => create.mutate()} disabled={!offerSkill || !wantSkill}>Post Offer</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Open Offers</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data?.map(o => (
            <div key={o.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{o.offerSkill} ⇄ {o.wantSkill}</div>
                <div className="text-xs text-muted-foreground">{o.description}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
