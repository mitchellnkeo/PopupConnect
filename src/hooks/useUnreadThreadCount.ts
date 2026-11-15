import { useEffect, useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import { INBOX_CHANGED_EVENT } from "../lib/messageThreads";
import { fetchUnreadThreadCount } from "../services/messageService";

export function useUnreadThreadCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const next = await fetchUnreadThreadCount();
        if (!cancelled) setCount(next);
      } catch {
        if (!cancelled) setCount(0);
      }
    }

    void load();
    const onRefresh = () => {
      void load();
    };
    window.addEventListener("focus", onRefresh);
    window.addEventListener(INBOX_CHANGED_EVENT, onRefresh);
    const timer = window.setInterval(onRefresh, 60_000);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", onRefresh);
      window.removeEventListener(INBOX_CHANGED_EVENT, onRefresh);
      window.clearInterval(timer);
    };
  }, [user]);

  return count;
}
