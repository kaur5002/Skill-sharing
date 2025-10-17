"use client";
import { useEffect, useMemo, useState } from 'react';
import http from '@/lib/http';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';
import { Calendar as CalendarIcon, List, Plus, X, Pencil, Trash2 } from 'lucide-react';

type SessionItem = {
	id: string;
	title: string;
	startTime: string;
	endTime: string;
	status: 'upcoming' | 'live' | 'completed' | 'cancelled';
	type?: string;
	description?: string;
	meetingUrl?: string;
	meetingPlatform?: string;
	learnerId?: string;
	learnerName?: string;
	courseId?: string;
	courseTitle?: string;
};

export default function TutorSchedulePage() {
	const [view, setView] = useState<'list' | 'calendar'>('list');
	const [items, setItems] = useState<SessionItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState<SessionItem | null>(null);
		const [showLearnersFor, setShowLearnersFor] = useState<string | null>(null);
		const [learners, setLearners] = useState<Array<{ id: string; name: string; email: string }>>([]);
		const [stats, setStats] = useState<{ upcoming: number; live: number; completed: number; cancelled: number; next7days: number } | null>(null);

	const [form, setForm] = useState({
		title: '',
		startTime: '',
		endTime: '',
		courseId: '',
		learnerId: '',
		type: 'live',
		description: '',
		meetingUrl: '',
		meetingPlatform: '',
	});

	const fetchItems = async () => {
		setLoading(true); setError(null);
		try {
			const res = await http.get('/tutor/schedule');
			setItems(res.data as SessionItem[]);
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	};

		const fetchStats = async () => {
			try {
				const res = await http.get('/tutor/schedule/analytics');
				setStats(res.data);
			} catch {}
		};

		useEffect(() => { fetchItems(); fetchStats(); }, []);

	const resetForm = () => {
		setForm({ title: '', startTime: '', endTime: '', courseId: '', learnerId: '', type: 'live', description: '', meetingUrl: '', meetingPlatform: '' });
		setEditing(null);
	};

	const submit = async () => {
		setError(null);
		try {
			const payload: any = {
				title: form.title,
				startTime: form.startTime,
				endTime: form.endTime,
				type: form.type,
				description: form.description || undefined,
				meetingUrl: form.meetingUrl || undefined,
				meetingPlatform: form.meetingPlatform || undefined,
			};
			if (form.courseId) payload.courseId = form.courseId;
			if (form.learnerId) payload.learnerId = form.learnerId;
			if (editing) {
				await http.patch(`/tutor/schedule/${editing.id}`, payload);
			} else {
				await http.post('/tutor/schedule', payload);
			}
			await fetchItems();
			setShowForm(false); resetForm();
		} catch (e: any) {
			setError(e.message);
		}
	};

	const cancelItem = async (id: string) => {
		if (!confirm('Cancel this session?')) return;
		try {
			await http.delete(`/tutor/schedule/${id}`, { data: { reason: 'Cancelled by tutor' } });
			await fetchItems();
		} catch (e: any) {
			setError(e.message);
		}
	};

		const loadLearners = async (id: string) => {
			setError(null);
			try {
				const res = await http.get(`/tutor/schedule/${id}/learners`);
				setLearners(res.data as any[]);
				setShowLearnersFor(id);
			} catch (e: any) {
				setError(e.message);
			}
		};

	const byDate = useMemo(() => {
		const groups: Record<string, SessionItem[]> = {};
		items.forEach((it) => {
			const d = new Date(it.startTime);
			const key = d.toISOString().slice(0, 10);
			groups[key] = groups[key] || [];
			groups[key].push(it);
		});
		return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? -1 : 1));
	}, [items]);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button variant={view === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setView('list')}>
						<List className="w-4 h-4 mr-1" /> List
					</Button>
					<Button variant={view === 'calendar' ? 'default' : 'outline'} size="sm" onClick={() => setView('calendar')}>
						<CalendarIcon className="w-4 h-4 mr-1" /> Calendar
					</Button>
				</div>
				<Button size="sm" onClick={() => { setShowForm(true); setEditing(null); }}>
					<Plus className="w-4 h-4 mr-1" /> Create Schedule
				</Button>
			</div>

			{error && <div className="text-sm text-red-600">{error}</div>}

					{stats && (
						<div className="grid grid-cols-2 md:grid-cols-5 gap-2">
							<Card className="p-3 text-sm"><div className="text-muted-foreground">Upcoming</div><div className="text-xl font-semibold">{stats.upcoming}</div></Card>
							<Card className="p-3 text-sm"><div className="text-muted-foreground">Live</div><div className="text-xl font-semibold">{stats.live}</div></Card>
							<Card className="p-3 text-sm"><div className="text-muted-foreground">Completed</div><div className="text-xl font-semibold">{stats.completed}</div></Card>
							<Card className="p-3 text-sm"><div className="text-muted-foreground">Cancelled</div><div className="text-xl font-semibold">{stats.cancelled}</div></Card>
							<Card className="p-3 text-sm md:col-span-1 col-span-2"><div className="text-muted-foreground">Next 7 days</div><div className="text-xl font-semibold">{stats.next7days}</div></Card>
						</div>
					)}

			{showForm && (
				<Card className="p-4 space-y-3">
					<div className="flex items-center justify-between">
						<div className="font-medium">{editing ? 'Edit Session' : 'Create Session'}</div>
						<button onClick={() => { setShowForm(false); resetForm(); }}>
							<X className="w-4 h-4" />
						</button>
					</div>
					<div className="grid md:grid-cols-2 gap-3">
						<div>
							<Label>Title</Label>
							<Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g., Algebra Live Class" />
						</div>
						<div>
							<Label>Type</Label>
							<Input value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} placeholder="live | review | recorded" />
						</div>
						<div>
							<Label>Start Time</Label>
							<Input type="datetime-local" value={form.startTime} onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))} />
						</div>
						<div>
							<Label>End Time</Label>
							<Input type="datetime-local" value={form.endTime} onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))} />
						</div>
						<div>
							<Label>Course ID (optional)</Label>
							<Input value={form.courseId} onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value, learnerId: '' }))} placeholder="Link to a course" />
						</div>
						<div>
							<Label>Learner ID (optional)</Label>
							<Input value={form.learnerId} onChange={(e) => setForm((f) => ({ ...f, learnerId: e.target.value, courseId: '' }))} placeholder="1:1 session learner" />
						</div>
						<div>
							<Label>Meeting Platform</Label>
							<Input value={form.meetingPlatform} onChange={(e) => setForm((f) => ({ ...f, meetingPlatform: e.target.value }))} placeholder="zoom | meet | teams | other" />
						</div>
						<div>
							<Label>Meeting URL</Label>
							<Input value={form.meetingUrl} onChange={(e) => setForm((f) => ({ ...f, meetingUrl: e.target.value }))} placeholder="https://..." />
						</div>
						<div className="md:col-span-2">
							<Label>Description</Label>
							<Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Details, agenda or notes" />
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button size="sm" onClick={submit}>{editing ? 'Save Changes' : 'Create'}</Button>
						<Button size="sm" variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
					</div>
				</Card>
			)}

			<div>
				{loading ? (
					<div>Loading…</div>
				) : view === 'list' ? (
					<div className="space-y-3">
						{items.map((it) => (
							<Card key={it.id} className="p-4">
								<div className="flex items-start justify-between gap-3">
									<div>
										<div className="font-medium">{it.title} {it.courseTitle ? (<span className="text-muted-foreground">• {it.courseTitle}</span>) : null}</div>
										<div className="text-sm text-muted-foreground">
											{new Date(it.startTime).toLocaleString()} → {new Date(it.endTime).toLocaleString()} • {it.type || 'live'} • {it.status}
										</div>
										{it.learnerName && <div className="text-sm">Learner: {it.learnerName}</div>}
										{it.meetingUrl && (
											<a className="text-sm text-blue-600 underline" href={it.meetingUrl} target="_blank">Join link</a>
										)}
													{showLearnersFor === it.id && (
														<div className="mt-2">
															<div className="text-sm font-medium">Learners ({learners.length})</div>
															<ul className="text-sm list-disc pl-5">
																{learners.map((l) => (
																	<li key={l.id}>{l.name || 'Unnamed'} <span className="text-muted-foreground">({l.email})</span></li>
																))}
																{!learners.length && <li className="text-muted-foreground">No learners</li>}
															</ul>
														</div>
													)}
									</div>
									<div className="flex items-center gap-2">
													<Button size="sm" variant="outline" onClick={() => loadLearners(it.id)}>Learners</Button>
										<Button size="icon" variant="outline" onClick={() => { setShowForm(true); setEditing(it); setForm({ title: it.title, startTime: it.startTime.slice(0,16), endTime: it.endTime.slice(0,16), courseId: it.courseId || '', learnerId: it.learnerId || '', type: it.type || 'live', description: it.description || '', meetingUrl: it.meetingUrl || '', meetingPlatform: it.meetingPlatform || '' }); }}>
											<Pencil className="w-4 h-4" />
										</Button>
										<Button size="icon" variant="destructive" onClick={() => cancelItem(it.id)}>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
							</Card>
						))}
						{!items.length && <div className="text-sm text-muted-foreground">No sessions yet. Create your first schedule.</div>}
					</div>
				) : (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
						{byDate.map(([date, arr]) => (
							<Card key={date} className="p-3">
								<div className="font-medium flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> {date}</div>
								<div className="mt-2 space-y-2">
									{arr.map((it) => (
										<div key={it.id} className="text-sm">
											<div className="font-medium">{it.title}</div>
											<div className="text-muted-foreground">{new Date(it.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} → {new Date(it.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {it.type || 'live'}</div>
										</div>
									))}
								</div>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

