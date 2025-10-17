"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { http } from '@/lib/http';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

type Material = { id: string; type: string; title: string; url: string };

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.id as string;
  const [materials, setMaterials] = useState<Material[]>([]);
  const [type, setType] = useState('pdf');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const load = async () => {
    const r = await http.get(`/tutor/courses/${courseId}/materials`);
    setMaterials(r.data);
  };
  useEffect(() => { if (courseId) load(); }, [courseId]);

  const add = async () => {
    if (!title || !url) return;
    await http.post(`/tutor/courses/${courseId}/materials`, { type, title, url });
    setTitle(''); setUrl('');
    await load();
  };
  const remove = async (materialId: string) => {
    await http.delete(`/tutor/courses/${courseId}/materials?materialId=${materialId}`);
    await load();
  };

  return (
    <div className="grid gap-4">
      <Card className="p-4 space-y-4">
        <div className="text-lg font-medium">Add Material</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div>
            <Label>Type</Label>
            <Input value={type} onChange={e => setType(e.target.value)} placeholder="pdf | video | slide | image | other" />
          </div>
          <div className="md:col-span-2">
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>URL</Label>
            <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <Button onClick={add}>Add</Button>
      </Card>
      <Card className="p-4 space-y-2">
        <div className="text-lg font-medium">Materials</div>
        <div className="grid gap-2">
          {materials.map(m => (
            <div key={m.id} className="flex items-center justify-between border rounded-md p-3">
              <div>
                <div className="font-medium">[{m.type}] {m.title}</div>
                <a className="text-sm text-blue-600" href={m.url} target="_blank">{m.url}</a>
              </div>
              <Button variant="outline" size="sm" onClick={() => remove(m.id)}>Delete</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
