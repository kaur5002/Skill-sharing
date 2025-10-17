"use client";
import { useQuery } from '@tanstack/react-query';
import http from '@/lib/http';
import { DashboardSummarySchema, ScheduleItemSchema, AchievementSchema, SessionSchema } from '@/lib/schemas/dashboard.schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, MessageCircle, Trophy, Video, ArrowRight } from 'lucide-react';

export default function LearnerDashboardPage() {
  const { data: summary } = useQuery({
    queryKey: ['dashboard','summary'],
    queryFn: async () => {
      const res = await http.get('/dashboard/summary');
      return DashboardSummarySchema.parse(res.data);
    },
  });

  const { data: schedule } = useQuery({
    queryKey: ['dashboard','schedule'],
    queryFn: async () => {
      const res = await http.get('/dashboard/schedule');
      return ScheduleItemSchema.array().parse(res.data);
    },
  });

  const { data: achievements } = useQuery({
    queryKey: ['dashboard','achievements'],
    queryFn: async () => {
      const res = await http.get('/dashboard/achievements');
      return AchievementSchema.array().parse(res.data);
    },
  });

  const { data: sessions } = useQuery({
    queryKey: ['dashboard','sessions'],
    queryFn: async () => {
      const res = await http.get('/dashboard/sessions');
      return SessionSchema.array().parse(res.data);
    },
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Session</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.nextSessionAt ? new Date(summary.nextSessionAt).toLocaleString() : '—'}</div>
            <p className="text-xs text-muted-foreground">Be ready!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.unreadMessages ?? 0}</div>
            <p className="text-xs text-muted-foreground">From your tutors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Video className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalHours ?? 0}</div>
            <p className="text-xs text-muted-foreground">Learning time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.achievementsCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">Keep it up</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Schedule</CardTitle>
              <Button variant="outline" size="sm">View all</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {schedule?.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{s.title}</div>
                  <div className="text-xs text-muted-foreground">with {s.tutorName} • {new Date(s.startTime).toLocaleString()}</div>
                </div>
                {s.meetingUrl && (
                  <Button size="sm" onClick={() => window.open(s.meetingUrl!, '_blank')}>Join</Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Achievements</CardTitle>
              <Button variant="outline" size="sm">View all</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements?.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">Unlocked {new Date(a.unlockedAt).toLocaleDateString()}</div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sessions</CardTitle>
            <Button variant="outline" size="sm">Browse</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions?.map((s) => (
            <div key={s.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{s.title}</div>
                <div className="text-xs text-muted-foreground">{new Date(s.startTime).toLocaleString()}</div>
              </div>
              {s.meetingUrl && (
                <Button size="sm" onClick={() => window.open(s.meetingUrl!, '_blank')}>Join</Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
