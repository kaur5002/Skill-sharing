"use client";
import { useEffect, useState } from 'react';
import { http } from '@/lib/http';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

export default function VerificationPage() {
  const [status, setStatus] = useState<any>(null);
  const [docs, setDocs] = useState<string>('');
  const [note, setNote] = useState('');

  const load = async () => {
    const r = await http.get('/tutor/verification');
    setStatus(r.data);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    const documents = docs.split(',').map(s => s.trim()).filter(Boolean);
    await http.post('/tutor/verification', { documents, note });
    setDocs(''); setNote('');
    await load();
  };

  return (
    <div className="grid gap-4">
      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Verification Status</div>
        <div className="text-sm text-muted-foreground">{status?.status || 'none'}</div>
        {status?.submittedAt && <div className="text-sm">Submitted: {new Date(status.submittedAt).toLocaleString()}</div>}
        {status?.reviewedAt && <div className="text-sm">Reviewed: {new Date(status.reviewedAt).toLocaleString()}</div>}
        {status?.note && <div className="text-sm">Note: {status.note}</div>}
      </Card>
      <Card className="p-4 space-y-4">
        <div className="text-lg font-medium">Submit Verification</div>
        <div className="grid gap-2">
          <Label>Document URLs (comma separated)</Label>
          <Input value={docs} onChange={e => setDocs(e.target.value)} placeholder="https://... , https://..." />
        </div>
        <div className="grid gap-2">
          <Label>Note (optional)</Label>
          <Input value={note} onChange={e => setNote(e.target.value)} />
        </div>
        <Button onClick={submit}>Submit</Button>
      </Card>
    </div>
  );
}
