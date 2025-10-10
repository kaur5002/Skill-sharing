"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { http } from '@/lib/http';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

type Course = { id: string; title: string; description: string; isPublished: boolean };

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const load = async () => {
    const r = await http.get('/tutor/courses');
    setCourses(r.data);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!title || !description) return;
    await http.post('/tutor/courses', { title, description });
    setTitle(''); setDescription('');
    await load();
  };

  return (
    <div className="grid gap-4">
      <Card className="p-4 space-y-4">
        <div className="text-lg font-medium">Create Course</div>
        <div className="grid gap-2">
          <Label>Title</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Description</Label>
          <Input value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <Button onClick={add}>Create</Button>
      </Card>

      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Your Courses</div>
        <div className="grid gap-2">
          {courses.map(c => (
            <div key={c.id} className="flex items-center justify-between border rounded-md p-3">
              <div>
                <div className="font-medium">{c.title}</div>
                <div className="text-sm text-muted-foreground">{c.description}</div>
              </div>
              <Link href={`/tutor/dashboard/courses/${c.id}`}> 
                <Button variant="outline" size="sm">Manage</Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
