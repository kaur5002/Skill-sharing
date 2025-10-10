"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@/lib/http';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { useState } from 'react';

export default function HelpPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['tickets'], queryFn: async () => (await http.get('/support/tickets')).data as any[] });
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const submit = useMutation({ mutationFn: async () => (await http.post('/support/tickets', { subject, message })).data, onSuccess: () => { setSubject(''); setMessage(''); qc.invalidateQueries({ queryKey: ['tickets'] }); } });
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader><CardTitle>Support</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
            <Input placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />
            <Button onClick={() => submit.mutate()} disabled={!subject || !message}>Submit</Button>
          </div>
          <div className="text-sm text-muted-foreground">Check our <Link className="underline" href="/support/faqs">FAQs</Link> and <Link className="underline" href="/support/policies">Refund Policy</Link>.</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Your Tickets</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data?.map(t => (
            <div key={t.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t.subject}</div>
                <div className="text-xs text-muted-foreground">{t.status} • {new Date(t.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
