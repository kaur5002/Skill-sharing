"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@/lib/http';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

export default function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['settings'], queryFn: async () => (await http.get('/settings/preferences')).data as any });
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [theme, setTheme] = useState('system');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const savePrefs = useMutation({ mutationFn: async () => (await http.put('/settings/preferences', { emailNotifications, pushNotifications, theme })).data, onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }) });
  const changePwd = useMutation({ mutationFn: async () => (await http.post('/settings/password', { currentPassword, newPassword })).data });

  return (
    <div className="grid gap-4 max-w-2xl">
      <Card>
        <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <label className="flex items-center gap-2"><input type="checkbox" checked={emailNotifications} onChange={e => setEmailNotifications(e.target.checked)} /> Email notifications</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={pushNotifications} onChange={e => setPushNotifications(e.target.checked)} /> Push notifications</label>
          <select className="border rounded px-2 py-1" value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <Button onClick={() => savePrefs.mutate()}>Save</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Password</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Input type="password" placeholder="Current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          <Input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          <Button onClick={() => changePwd.mutate()} disabled={!currentPassword || !newPassword}>Change Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
