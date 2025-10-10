"use client";
import { useQuery } from '@tanstack/react-query';
import http from '@/lib/http';
import { TutorSummarySchema, ScheduleItemSchema } from '@/lib/schemas/dashboard.schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, MessageCircle, Clock, DollarSign, Users } from 'lucide-react';

export default function TutorDashboardPage() {
  const { data: summary } = useQuery({
    queryKey: ['tutor','summary'],
    queryFn: async () => {
      const res = await http.get('/tutor/summary');
      return TutorSummarySchema.parse(res.data);
    },
  });

  const { data: schedule } = useQuery({
    queryKey: ['tutor','schedule'],
    queryFn: async () => {
      const res = await http.get('/tutor/schedule');
      return ScheduleItemSchema.array().parse(res.data.map((s:any)=>({
        id: s.id,
        tutorId: 'me',
        tutorName: s.learnerName,
        title: s.title,
        startTime: s.startTime,
        endTime: s.endTime,
        status: s.status,
        meetingUrl: s.meetingUrl,
      })));
    },
  });

  const { data: students } = useQuery({
    queryKey: ['tutor','students'],
    queryFn: async () => {
      const res = await http.get('/tutor/students');
      return res.data as Array<{id:string; name:string; email:string}>;
    },
  });

  const { data: payments } = useQuery({
    queryKey: ['tutor','payments'],
    queryFn: async () => {
      const res = await http.get('/tutor/payments');
      return res.data as Array<{id:string; amount:number; currency:string; status:string; createdAt:string; learnerName:string}>;
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
            <p className="text-xs text-muted-foreground">With your student</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.unreadMessages ?? 0}</div>
            <p className="text-xs text-muted-foreground">From students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teaching Hours</CardTitle>
            <Clock className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalTeachingHours ?? 0}</div>
            <p className="text-xs text-muted-foreground">Completed sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.totalEarnings?.toFixed?.(2) ?? '0.00'}</div>
            <p className="text-xs text-muted-foreground">All time</p>
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
              <CardTitle>Students</CardTitle>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {students?.slice(0, 6).map((st) => (
              <div key={st.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{st.name}</div>
                  <div className="text-xs text-muted-foreground">{st.email}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Payments</CardTitle>
            <Button variant="outline" size="sm">View all</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {payments?.slice(0, 6).map((p) => (
            <div key={p.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{p.learnerName}</div>
                <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-sm font-medium">{p.currency} {p.amount.toFixed(2)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
