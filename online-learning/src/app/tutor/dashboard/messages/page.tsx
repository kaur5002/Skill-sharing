"use client";
import { useEffect, useState } from 'react';
import { http } from '@/lib/http';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

type Thread = { partnerId: string; partnerName: string; lastText: string; lastAt: string; unread: boolean };

export default function TutorMessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [toId, setToId] = useState('');
  const [text, setText] = useState('');

  const load = async () => {
    const r = await http.get('/tutor/messages');
    setThreads(r.data);
  };
  useEffect(() => { load(); }, []);

  const send = async () => {
    if (!toId || !text) return;
    await http.post('/tutor/messages', { toId, text });
    setText('');
    await load();
  };

  return (
    <div className="grid gap-4">
      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Inbox</div>
        <div className="grid gap-2">
          {threads.map(t => (
            <div key={t.partnerId} className="flex items-center justify-between border rounded-md p-3">
              <div>
                <div className="font-medium">{t.partnerName}</div>
                <div className="text-sm text-muted-foreground">{t.lastText}</div>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(t.lastAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Send Message</div>
        <div className="grid gap-2">
          <Label>Learner ID</Label>
          <Input value={toId} onChange={e => setToId(e.target.value)} placeholder="Recipient learner ID" />
          <Label>Message</Label>
          <Input value={text} onChange={e => setText(e.target.value)} placeholder="Type your message..." />
          <Button onClick={send}>Send</Button>
        </div>
      </Card>
    </div>
  );
}
