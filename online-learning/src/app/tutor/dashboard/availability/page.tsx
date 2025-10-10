"use client";
import { useEffect, useState } from 'react';
import { http } from '@/lib/http';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

type Slot = { id: string; dayOfWeek: number; startTime: string; endTime: string; timezone: string };

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStart] = useState('09:00');
  const [endTime, setEnd] = useState('10:00');
  const [timezone, setTz] = useState('UTC');

  const load = async () => {
    const r = await http.get('/tutor/availability');
    setSlots(r.data);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    await http.post('/tutor/availability', { dayOfWeek: Number(dayOfWeek), startTime, endTime, timezone });
    await load();
  };
  const remove = async (id: string) => {
    await http.delete(`/tutor/availability?id=${id}`);
    await load();
  };

  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return (
    <div className="grid gap-4">
      <Card className="p-4 space-y-4">
        <div className="text-lg font-medium">Add Slot</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <div>
            <Label>Day</Label>
            <Input type="number" min={0} max={6} value={dayOfWeek} onChange={e => setDayOfWeek(Number(e.target.value))} />
          </div>
          <div>
            <Label>Start</Label>
            <Input value={startTime} onChange={e => setStart(e.target.value)} placeholder="HH:MM" />
          </div>
          <div>
            <Label>End</Label>
            <Input value={endTime} onChange={e => setEnd(e.target.value)} placeholder="HH:MM" />
          </div>
          <div>
            <Label>Timezone</Label>
            <Input value={timezone} onChange={e => setTz(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button onClick={add}>Add</Button>
          </div>
        </div>
      </Card>
      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Your Availability</div>
        <div className="grid gap-2">
          {slots.map(s => (
            <div key={s.id} className="flex items-center justify-between border rounded-md p-3">
              <div>{days[s.dayOfWeek]} {s.startTime} - {s.endTime} ({s.timezone})</div>
              <Button variant="outline" size="sm" onClick={() => remove(s.id)}>Delete</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
