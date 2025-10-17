"use client";
import { useEffect, useState } from 'react';
import { http } from '@/lib/http';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

type Summary = { gross: number; net: number; fees: number; pendingAmount: number; payouts: { id: string; amount: number; status: string; method: string; destination?: string; createdAt: string }[] };

export default function EarningsPage() {
  const [sum, setSum] = useState<Summary | null>(null);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [destination, setDestination] = useState('');

  const load = async () => {
    const r = await http.get('/tutor/earnings/summary');
    setSum(r.data);
  };
  useEffect(() => { load(); }, []);

  const requestPayout = async () => {
    if (!amount || !method) return;
    await http.post('/tutor/payouts', { amount: Number(amount), method, destination });
    setAmount(''); setDestination('');
    await load();
  };

  return (
    <div className="grid gap-4">
      <Card className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Gross</div>
          <div className="text-xl font-semibold">${sum?.gross?.toFixed(2) ?? '0.00'}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Fees</div>
          <div className="text-xl font-semibold">-${sum?.fees?.toFixed(2) ?? '0.00'}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Net</div>
          <div className="text-xl font-semibold">${sum?.net?.toFixed(2) ?? '0.00'}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Pending</div>
          <div className="text-xl font-semibold">${sum?.pendingAmount?.toFixed(2) ?? '0.00'}</div>
        </div>
      </Card>

      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Request Payout</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div>
            <Label>Amount</Label>
            <Input value={amount} onChange={e => setAmount(e.target.value)} placeholder="100" />
          </div>
          <div>
            <Label>Method</Label>
            <Input value={method} onChange={e => setMethod(e.target.value)} placeholder="bank | paypal | stripe" />
          </div>
          <div className="md:col-span-2">
            <Label>Destination</Label>
            <Input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Account / email / IBAN" />
          </div>
        </div>
        <Button onClick={requestPayout}>Submit</Button>
      </Card>

      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Payout History</div>
        <div className="grid gap-2">
          {sum?.payouts?.map(p => (
            <div key={p.id} className="flex items-center justify-between border rounded-md p-3">
              <div>
                <div className="font-medium">${p.amount.toFixed(2)} via {p.method}</div>
                <div className="text-sm text-muted-foreground">{p.destination || '-'}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">{p.status}</div>
                <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
