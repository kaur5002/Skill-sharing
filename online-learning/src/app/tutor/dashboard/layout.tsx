"use client";
import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, Calendar, MessageCircle, Users, Video, CreditCard, BarChart, UserSquare2, CheckCircle2, BookOpen, Star } from 'lucide-react';

const nav = [
  { href: '/tutor/dashboard', label: 'Overview', icon: Home },
  { href: '/tutor/dashboard/schedule', label: 'Schedule', icon: Calendar },
  { href: '/tutor/dashboard/messages', label: 'Messages', icon: MessageCircle },
  { href: '/tutor/dashboard/students', label: 'Students', icon: Users },
  { href: '/tutor/dashboard/sessions', label: 'Sessions', icon: Video },
  { href: '/tutor/dashboard/payments', label: 'Payments', icon: CreditCard },
  { href: '/tutor/dashboard/analytics', label: 'Analytics', icon: BarChart },
  { href: '/tutor/dashboard/profile', label: 'Profile', icon: UserSquare2 },
  { href: '/tutor/dashboard/availability', label: 'Availability', icon: Calendar },
  { href: '/tutor/dashboard/courses', label: 'Courses', icon: BookOpen },
  { href: '/tutor/dashboard/verification', label: 'Verification', icon: CheckCircle2 },
  { href: '/tutor/dashboard/earnings', label: 'Earnings', icon: CreditCard },
  { href: '/tutor/dashboard/reviews', label: 'Reviews', icon: Star },
];

export default function TutorDashboardLayout({ children }: PropsWithChildren) {
  const logout = () => {
    try {
      localStorage.removeItem('token');
    } catch {}
    window.location.href = '/authPage';
  };
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-r bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/30">
        <div className="p-4 text-xl font-semibold">Tutor Dashboard</div>
        <nav className="px-2 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={'flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-sm'}>
                <Icon className="w-4 h-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold">Welcome, Tutor 👋</div>
          <div className="flex items-center gap-2">
            <Link href="/firstPage">
              <Button variant="outline" size="sm">Home</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
