// hooks/useChatMVP.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import api from '../utils/api';

export type ChatMessage = {
  messageId: string;
  senderId: string;
  senderRole: string;
  message: string;
  delivered?: boolean;
  read?: boolean;
  meta?: any;
  createdAt: string;
};

export function useChatMVP(requestId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const esRef = useRef<EventSource | null>(null);
  const seen = useRef(new Set<string>());

  useEffect(() => {
    if (!requestId) return;
    let cancelled = false;
    setLoading(true);
    api.get<{ messages: ChatMessage[] }>(`/api/v1/${requestId}/messages`)
      .then(res => {
        if (cancelled) return;
        const msgs = res.data.messages ?? [];
        msgs.forEach(m => seen.current.add(m.messageId));
        msgs.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setMessages(msgs);
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [requestId]);

  useEffect(() => {
    if (!requestId) return;
    const base = (api.defaults.baseURL ?? '').replace(/\/$/, '');
    const token = localStorage.getItem('nexgad_token');
    const url = token ? `${base}/api/v1/sse/${requestId}?token=${encodeURIComponent(token)}` : `${base}/api/v1/sse/${requestId}`;
    const es = new EventSource(url);
    esRef.current = es;

    const handle = (e: MessageEvent) => {
      try {
        const parsed = JSON.parse(e.data);
        if (parsed?.event && parsed?.data) {
          const { event, data } = parsed;
          if (event === 'history' && Array.isArray(data.messages)) {
            data.messages.forEach((m: ChatMessage) => {
              if (!seen.current.has(m.messageId)) {
                seen.current.add(m.messageId);
                setMessages(prev => [...prev, m].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
              }
            });
          } else if (event === 'message') {
            const m: ChatMessage = data;
            if (!seen.current.has(m.messageId)) {
              seen.current.add(m.messageId);
              setMessages(prev => [...prev, m].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
            }
          } else if (event === 'chat-enabled') {
            console.log('chat-enabled', data);
          }
        } else {
          const m = parsed as ChatMessage;
          if (m?.messageId && !seen.current.has(m.messageId)) {
            seen.current.add(m.messageId);
            setMessages(prev => [...prev, m].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
          }
        }
      } catch (err) {
        console.error('SSE parse error', err);
      }
    };

    es.addEventListener('message', handle);
    es.addEventListener('history', (e) => handle(e as any));
    es.addEventListener('message', handle);

    es.onerror = (err) => console.error('SSE error', err);
    es.onopen = () => console.log('SSE open', requestId);

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [requestId]);

  const sendMessage = useCallback(async (text: string) => {
    if (!requestId) throw new Error('missing requestId');
    // optimistic local id optional omitted for MVP
    const res = await api.post<{ message: ChatMessage }>(`/api/v1/${requestId}/message`, { message: text });
    const saved = res.data.message;
    if (!seen.current.has(saved.messageId)) {
      seen.current.add(saved.messageId);
      setMessages(prev => [...prev, saved].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    }
    return saved;
  }, [requestId]);

  const close = useCallback(() => { esRef.current?.close(); esRef.current = null; }, []);

  return { messages, sendMessage, loading, close };
}
