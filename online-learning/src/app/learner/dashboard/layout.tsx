import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Home, Calendar, MessageCircle, Trophy, CreditCard, Video, Users } from 'lucide-react';

const nav = [
  { href: '/learner/dashboard', label: 'Overview', icon: Home },
  { href: '/learner/dashboard/schedule', label: 'Schedule', icon: Calendar },
  { href: '/learner/dashboard/messages', label: 'Messages', icon: MessageCircle },
  { href: '/learner/dashboard/sessions', label: 'Sessions', icon: Video },
  { href: '/learner/dashboard/achievements', label: 'Achievements', icon: Trophy },
  { href: '/learner/dashboard/payments', label: 'Payments', icon: CreditCard },
  { href: '/learner/dashboard/tutors', label: 'Tutors', icon: Users },
];

export default function LearnerDashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-r bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/30">
        <div className="p-4 text-xl font-semibold">Learner Dashboard</div>
        <nav className="px-2 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={cn('flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-sm')}>
                <Icon className="w-4 h-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Welcome back 👋</div>
          <Link href="/firstPage">
            <Button variant="outline" size="sm">Home</Button>
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}
