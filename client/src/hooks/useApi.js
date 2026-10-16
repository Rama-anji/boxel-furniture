import { useCallback, useEffect, useRef, useState } from 'react';
import { get } from '../services/api.js';

/**
 * Fetches `path` and re-fetches when it changes. In-flight requests are aborted
 * when the path changes or the component unmounts.
 *
 * `live` (milliseconds) keeps the data fresh: it re-fetches quietly — no loading
 * state, current data stays on screen — on that interval while the tab is visible,
 * and whenever the visitor comes back to the tab.
 */
export function useApi(path, { enabled = true, keepPrevious = true, live = 0 } = {}) {
  const [state, setState] = useState({ data: null, error: null, loading: Boolean(enabled && path) });
  const controller = useRef(null);

  const load = useCallback(async () => {
    if (!enabled || !path) return;
    controller.current?.abort();
    const ac = new AbortController();
    controller.current = ac;
    setState((s) => ({ data: keepPrevious ? s.data : null, error: null, loading: true }));
    try {
      const data = await get(path, { signal: ac.signal });
      if (!ac.signal.aborted) setState({ data, error: null, loading: false });
    } catch (error) {
      if (error.name === 'AbortError') return;
      setState((s) => ({ data: s.data, error, loading: false }));
    }
  }, [path, enabled, keepPrevious]);

  useEffect(() => {
    load();
    return () => controller.current?.abort();
  }, [load]);

  useEffect(() => {
    if (!live || !enabled || !path) return undefined;
    let busy = false;
    const refresh = async () => {
      if (busy || document.visibilityState !== 'visible') return;
      busy = true;
      try {
        const data = await get(path);
        // Only replace the data when it actually changed, so nothing re-renders needlessly.
        setState((s) => (s.loading || JSON.stringify(s.data) === JSON.stringify(data) ? s : { data, error: null, loading: false }));
      } catch {
        // A failed background refresh keeps what is already on screen.
      } finally {
        busy = false;
      }
    };
    const t = setInterval(refresh, live);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      clearInterval(t);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [path, enabled, live]);

  return { ...state, reload: load };
}

export function useDebounced(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
