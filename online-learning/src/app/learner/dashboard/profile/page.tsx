"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@/lib/http';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState, useEffect } from 'react';

export default function LearnerProfilePage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['learner','profile'],
    queryFn: async () => {
      const res = await http.get('/learner/profile');
      return res.data as { profile: any; settings: any };
    },
  });

  const [bio, setBio] = useState('');
  const [goals, setGoals] = useState('');
  const [interests, setInterests] = useState('');
  const [categories, setCategories] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    if (data?.profile) {
      setBio(data.profile.bio || '');
      setGoals(data.profile.goals || '');
      setInterests((data.profile.interests || []).join(', '));
      setCategories((data.profile.categories || []).join(', '));
      setPhotoUrl(data.profile.photoUrl || '');
    }
    if (data?.settings) {
      setEmailNotifications(!!data.settings.emailNotifications);
      setPushNotifications(!!data.settings.pushNotifications);
      setTheme(data.settings.theme || 'system');
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        bio, goals,
        interests: interests.split(',').map(s => s.trim()).filter(Boolean),
        categories: categories.split(',').map(s => s.trim()).filter(Boolean),
        photoUrl,
        settings: { emailNotifications, pushNotifications, theme },
      };
      const res = await http.put('/learner/profile', payload);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['learner','profile'] }),
  });

  return (
    <div className="grid gap-4 max-w-2xl">
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="Photo URL" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} />
          <Input placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)} />
          <Input placeholder="Goals" value={goals} onChange={e => setGoals(e.target.value)} />
          <Input placeholder="Interests (comma separated)" value={interests} onChange={e => setInterests(e.target.value)} />
          <Input placeholder="Categories (comma separated)" value={categories} onChange={e => setCategories(e.target.value)} />
          <div className="flex items-center gap-2 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={emailNotifications} onChange={e => setEmailNotifications(e.target.checked)} /> Email notifications</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={pushNotifications} onChange={e => setPushNotifications(e.target.checked)} /> Push notifications</label>
            <select className="border rounded px-2 py-1" value={theme} onChange={e => setTheme(e.target.value)}>
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>Save</Button>
        </CardContent>
      </Card>
    </div>
  );
}
