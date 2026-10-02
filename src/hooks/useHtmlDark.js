import { useEffect, useState } from 'react';

export function useHtmlDark() {
  const getInitial = () => {
    if (typeof document === 'undefined') return true;
    try {
      const fromHtml = document.documentElement.classList.contains('dark');
      const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return fromHtml || prefers;
    } catch (e) {
      return true;
    }
  };

  const [isDark, setIsDark] = useState(getInitial);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const onMq = (e) => setIsDark(e.matches);
    if (mq && mq.addEventListener) mq.addEventListener('change', onMq);
    else if (mq && mq.addListener) mq.addListener(onMq);

    const observer = new MutationObserver(() => {
      try {
        const now = document.documentElement.classList.contains('dark');
        setIsDark(now);
      } catch (e) {}
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      if (mq && mq.removeEventListener) mq.removeEventListener('change', onMq);
      else if (mq && mq.removeListener) mq.removeListener(onMq);
      observer.disconnect();
    };
  }, []);

  return isDark;
}
