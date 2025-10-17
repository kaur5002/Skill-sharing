"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import http from '@/lib/http';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

export default function CircleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const { data: posts } = useQuery({ queryKey: ['circle', id, 'posts'], queryFn: async () => (await http.get(`/learner/circles/${id}/posts`)).data as any[] });
  const { data: messages } = useQuery({ queryKey: ['circle', id, 'messages'], queryFn: async () => (await http.get(`/learner/circles/${id}/messages`)).data as any[] });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [text, setText] = useState('');

  const createPost = useMutation({
    mutationFn: async () => (await http.post(`/learner/circles/${id}/posts`, { title, content })).data,
    onSuccess: () => { setTitle(''); setContent(''); qc.invalidateQueries({ queryKey: ['circle', id, 'posts'] }); },
  });
  const sendMessage = useMutation({
    mutationFn: async () => (await http.post(`/learner/circles/${id}/messages`, { text })).data,
    onSuccess: () => { setText(''); qc.invalidateQueries({ queryKey: ['circle', id, 'messages'] }); },
  });

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle>Posts</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <Input placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
            <Button size="sm" onClick={() => createPost.mutate()} disabled={!title || !content}>Post</Button>
          </div>
          {posts?.map(p => (
            <div key={p.id} className="border rounded p-2">
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</div>
              <div className="mt-1">{p.content}</div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Group Chat</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Input placeholder="Message" value={text} onChange={e => setText(e.target.value)} />
            <Button size="sm" onClick={() => sendMessage.mutate()} disabled={!text}>Send</Button>
          </div>
          {messages?.map(m => (
            <div key={m.id} className="flex items-center justify-between">
              <div>{m.text}</div>
              <div className="text-xs text-muted-foreground">{new Date(m.sentAt).toLocaleString()}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
