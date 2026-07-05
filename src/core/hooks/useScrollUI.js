import { useEffect, useState } from 'react';

export function useScrollUI() {
  const [state, setState] = useState({ scrolled: false, progress: 0 });
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setState({ scrolled: window.scrollY > 24, progress: max > 0 ? window.scrollY / max : 0 });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return state;
}
