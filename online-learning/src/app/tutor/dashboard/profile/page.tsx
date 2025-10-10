"use client";
import { useEffect, useState } from 'react';
import { http } from '@/lib/http';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

type SocialLink = { provider: string; url: string };
type Profile = { id: string; bio: string | null; expertise: string[]; socialLinks: SocialLink[] };

export default function TutorProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');
  const [sessionPrice, setSessionPrice] = useState('');
  const [coursePriceDefault, setCoursePriceDefault] = useState('');
  const [subscriptionMonthlyPrice, setSubscriptionMonthlyPrice] = useState('');
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    http.get('/tutor/profile').then(r => {
      setProfile(r.data);
      setBio(r.data?.bio || '');
      setExpertise((r.data?.expertise || []).join(', '));
      setLinks(r.data?.socialLinks || []);
      if (r.data) {
        setSessionPrice(r.data.sessionPrice?.toString?.() || '');
        setCoursePriceDefault(r.data.coursePriceDefault?.toString?.() || '');
        setSubscriptionMonthlyPrice(r.data.subscriptionMonthlyPrice?.toString?.() || '');
      }
    });
  }, []);

  const addLink = () => setLinks(prev => [...prev, { provider: '', url: '' }]);
  const removeLink = (i: number) => setLinks(prev => prev.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        bio,
        expertise: expertise.split(',').map(s => s.trim()).filter(Boolean),
        socialLinks: links.filter(l => l.provider && l.url),
        sessionPrice: sessionPrice ? Number(sessionPrice) : undefined,
        coursePriceDefault: coursePriceDefault ? Number(coursePriceDefault) : undefined,
        subscriptionMonthlyPrice: subscriptionMonthlyPrice ? Number(subscriptionMonthlyPrice) : undefined,
      };
      const res = await http.put('/tutor/profile', payload);
      setProfile(res.data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-4">
      <Card className="p-4 space-y-4">
        <div className="text-lg font-medium">Profile</div>
        <div className="grid gap-2">
          <Label>Bio</Label>
          <Input value={bio} onChange={e => setBio(e.target.value)} placeholder="Short intro" />
        </div>
        <div className="grid gap-2">
          <Label>Expertise (comma separated)</Label>
          <Input value={expertise} onChange={e => setExpertise(e.target.value)} placeholder="e.g. React, Data Structures" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <Label>Price per session ($)</Label>
            <Input value={sessionPrice} onChange={e => setSessionPrice(e.target.value)} placeholder="50" />
          </div>
          <div>
            <Label>Default course price ($)</Label>
            <Input value={coursePriceDefault} onChange={e => setCoursePriceDefault(e.target.value)} placeholder="199" />
          </div>
          <div>
            <Label>Subscription monthly ($)</Label>
            <Input value={subscriptionMonthlyPrice} onChange={e => setSubscriptionMonthlyPrice(e.target.value)} placeholder="29" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Social Links</Label>
            <Button size="sm" onClick={addLink}>Add Link</Button>
          </div>
          <div className="grid gap-2">
            {links.map((l, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input value={l.provider} onChange={e => setLinks(prev => prev.map((p, idx) => idx === i ? { ...p, provider: e.target.value } : p))} placeholder="Provider (e.g., LinkedIn)" />
                <Input className="md:col-span-2" value={l.url} onChange={e => setLinks(prev => prev.map((p, idx) => idx === i ? { ...p, url: e.target.value } : p))} placeholder="https://..." />
                <Button variant="outline" onClick={() => removeLink(i)}>Remove</Button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </Card>
    </div>
  );
}
