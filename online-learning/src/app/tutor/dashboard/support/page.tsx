"use client";
import { useEffect, useState } from 'react';
import { http } from '@/lib/http';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

type Ticket = { id: string; subject: string; message: string; status: string; createdAt: string };

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [learnerId, setLearnerId] = useState('');
  const [reason, setReason] = useState('');

  const load = async () => {
    const r = await http.get('/support/tickets');
    setTickets(r.data);
  };
  useEffect(() => { load(); }, []);

  const submitTicket = async () => {
    if (!subject || !message) return;
    await http.post('/support/tickets', { subject, message });
    setSubject(''); setMessage('');
    await load();
  };

  const reportLearner = async () => {
    if (!learnerId || !reason) return;
    await http.post('/tutor/reports/learner', { learnerId, reason });
    setLearnerId(''); setReason('');
  };

  return (
    <div className="grid gap-4">
      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Submit Issue</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="md:col-span-1">
            <Label>Subject</Label>
            <Input value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Message</Label>
            <Input value={message} onChange={e => setMessage(e.target.value)} />
          </div>
        </div>
        <Button onClick={submitTicket}>Submit Ticket</Button>
      </Card>

      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Report Learner</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <Label>Learner ID</Label>
            <Input value={learnerId} onChange={e => setLearnerId(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Reason</Label>
            <Input value={reason} onChange={e => setReason(e.target.value)} />
          </div>
        </div>
        <Button onClick={reportLearner}>Report</Button>
      </Card>

      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Your Tickets</div>
        <div className="grid gap-2">
          {tickets.map(t => (
            <div key={t.id} className="flex items-center justify-between border rounded-md p-3">
              <div>
                <div className="font-medium">{t.subject}</div>
                <div className="text-sm text-muted-foreground">{t.message}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">{t.status}</div>
                <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
