"use client";
import { useEffect, useState } from 'react';
import { http } from '@/lib/http';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [theme, setTheme] = useState('system');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    http.get('/settings/preferences').then(r => {
      setEmailNotifications(!!r.data.emailNotifications);
      setPushNotifications(!!r.data.pushNotifications);
      setTheme(r.data.theme || 'system');
    });
  }, []);

  const savePrefs = async () => {
    await http.put('/settings/preferences', { emailNotifications, pushNotifications, theme });
  };
  const changePassword = async () => {
    if (!currentPassword || !newPassword) return;
    await http.post('/settings/password', { currentPassword, newPassword });
    setCurrentPassword(''); setNewPassword('');
  };

  return (
    <div className="grid gap-4">
      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Preferences</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={emailNotifications} onChange={e => setEmailNotifications(e.target.checked)} />
            Email notifications
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={pushNotifications} onChange={e => setPushNotifications(e.target.checked)} />
            Push notifications
          </label>
          <div>
            <Label>Theme</Label>
            <select className="border rounded-md w-full h-9 px-2" value={theme} onChange={e => setTheme(e.target.value)}>
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
        <Button onClick={savePrefs}>Save Preferences</Button>
      </Card>
      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Change Password</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <Label>Current Password</Label>
            <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          </div>
          <div>
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button onClick={changePassword}>Update</Button>
          </div>
        </div>
      </Card>
      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Policies & FAQs</div>
        <div className="text-sm text-muted-foreground">Access platform policies and FAQs below:</div>
        <div className="flex gap-3">
          <a className="text-blue-600 underline" href="/support/policies">Policies</a>
          <a className="text-blue-600 underline" href="/support/faqs">FAQs</a>
        </div>
      </Card>
    </div>
  );
}
