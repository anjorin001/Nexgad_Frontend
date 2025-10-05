import { useCallback, useEffect, useRef, useState } from "react";
import api from "../utils/api";

export type ChatMessage = {
  _id: string;
  senderId: string;
  senderRole: string;
  message: string;
  delivered?: boolean;
  read?: boolean;
  meta?: any;
  createdAt: string;
};

type ConnectionStatus =
  | "connecting"
  | "open"
  | "closed"
  | "error"
  | "chat-disabled";

export function useChatMVP(requestId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState<ConnectionStatus>("closed");
  const [reconnectTrigger, setReconnectTrigger] = useState(0); // bump to force reconnect
  const esRef = useRef<EventSource | null>(null);
  const seen = useRef(new Set<string>());
  const createEsRef = useRef<null | (() => void)>(null);

  const pushMessageIfNew = useCallback((m: ChatMessage) => {
    if (!m?._id) return;
    if (seen.current.has(m._id)) return;
    seen.current.add(m._id);
    setMessages((prev) => {
      const next = [...prev, m];
      next.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      return next;
    });
  }, []);

  // Initial fetch of history
  useEffect(() => {
    if (!requestId) return;
console.log("fetching history ")
    const ac = new AbortController();
    let cancelled = false;

    setLoading(true);
    setMessages([]);
    seen.current.clear();

    api
      .get<{ chatMessages?: ChatMessage[] }>(`/chat/${requestId}/messages`, {
        signal: ac.signal,
      })
      .then((res) => {
        if (cancelled) return;
        const msgs = res.data.chatMessages ?? [];
        console.log("msg" , msgs)
        // mark seen & sort oldest -> newest
        msgs.forEach((m) => {
          if (m?._id) seen.current.add(m._id);
        });
        msgs.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setMessages(msgs);
      })
      .catch((err) => {
        // ignore abort errors
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED")
          return;
        console.error("fetch messages error", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [requestId]);


  // SSE effect (runs only on requestId change)
  useEffect(() => {
    if (!requestId) return;

    // cleanup previous ES
    esRef.current?.close();
    esRef.current = null;

    let isUnmounted = false;
    let manualClosed = false;

    const base = (api.defaults.baseURL ?? "").replace(/\/$/, "");
    const token = localStorage.getItem("nexgad_token");
    const buildUrl = () =>
      token
        ? `${base}/chat/sse/${requestId}?token=${encodeURIComponent(token)}`
        : `${base}/chat/sse/${requestId}`;

    // handler shared by created EventSources
    const makeHandler = (esInstance: EventSource) => {
      const handle = (e: MessageEvent) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed?.event && parsed?.data) {
            const { event, data } = parsed;
            if (event === "history" && Array.isArray(data.chatMessages)) {
              data.chatMessages.forEach((m: ChatMessage) =>
                pushMessageIfNew(m)
              );
            } else if (event === "history" && Array.isArray(data.messages)) {
              data.messages.forEach((m: ChatMessage) => pushMessageIfNew(m));
            } else if (event === "message") {
              pushMessageIfNew(data as ChatMessage);
            }
          } else {
            const m = parsed as ChatMessage;
            if (m?._id) pushMessageIfNew(m);
          }
        } catch (err) {
          console.error("SSE parse error", err);
        }
      };
      return handle;
    };

    // function to create EventSource (stored to ref so reconnect() can use it)
    createEsRef.current = () => {
      // close any previous
      try {
        esRef.current?.close();
      } catch {}
      const url = buildUrl();
      const es = new EventSource(url);
      esRef.current = es;
      setConnection("connecting");

      const handle = makeHandler(es);
      es.addEventListener("message", handle);
      es.addEventListener("history", handle);

      es.onopen = () => {
        setConnection("open");
        console.log("SSE open", requestId);
      };

      es.onerror = (ev) => {
        console.error("SSE error", ev, "readyState=", es.readyState);
        // stop automatic retries — let user call reconnect()
        if (manualClosed || isUnmounted) {
          setConnection("closed");
          return;
        }

        // If server closed because chat disabled, mark that state
        setConnection("chat-disabled" as any); // cast if your ConnectionStatus doesn't include it
        try {
          es.removeEventListener("message", handle);
          es.removeEventListener("history", handle);
        } catch {}
        try {
          es.close();
        } catch {}
        esRef.current = null;
      };
    };

    // attempt initial connection once
    try {
      createEsRef.current?.();
    } catch (err) {
      console.error("initial ES creation failed", err);
      setConnection("error");
    }

    return () => {
      isUnmounted = true;
      manualClosed = true;
      try {
        esRef.current?.close();
      } catch {}
      esRef.current = null;
      setConnection("closed");
      createEsRef.current = null;
    };
  }, [requestId, pushMessageIfNew]);

  const reconnect = useCallback(async () => {
    if (!requestId) return false;

    setConnection("connecting");

    try {
      const res = await api.get<{ chatMessages?: ChatMessage[] }>(
        `/chat/${requestId}/messages`
      );
      const msgs = res.data.chatMessages ?? [];
      msgs.forEach((m) => {
        if (m?._id) seen.current.add(m._id);
      });

      setMessages((prev) => {
        if (prev.length === 0) {
          return msgs
            .slice()
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );
        }
        return prev;
      });

      // now create EventSource
      createEsRef.current?.();
      return true;
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403) {
        setConnection("chat-disabled" as any);
        return false;
      }
      console.error("reconnect probe failed", err);
      setConnection("error");
      return false;
    }
  }, [requestId]);

  // send message (POST) and append server-returned saved message (deduped)
  const sendMessage = useCallback(
    async (text: string) => {
      if (!requestId) throw new Error("missing requestId");

      const res = await api.post<{
        message?: ChatMessage;
        chatMessage?: ChatMessage;
      }>(`/chat/${requestId}/message`, { message: text });
      const saved = (res.data as any).chatMessage ?? (res.data as any).message;
      if (saved && !seen.current.has(saved._id)) {
        seen.current.add(saved._id);
        setMessages((prev) => {
          const next = [...prev, saved];
          next.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          return next;
        });
      }
      return saved as ChatMessage;
    },
    [requestId]
  );

  // close SSE manually
  const close = useCallback(() => {
    esRef.current?.close();
    esRef.current = null;
    setConnection("closed");
  }, []);

  // helper to update a message locally (mark delivered/read or update text)
  const updateMessageLocal = useCallback(
    (_id: string, patch: Partial<ChatMessage>) => {
      setMessages((prev) => {
        const next = prev.map((m) => (m._id === _id ? { ...m, ...patch } : m));
        return next;
      });
    },
    []
  );

  return {
    messages,
    sendMessage,
    loading,
    close,
    reconnect,
    connection,
    updateMessageLocal,
  };
}
