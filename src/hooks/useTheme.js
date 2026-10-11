import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

const REVEAL_DURATION = 1000;
const REVEAL_EASING = 'cubic-bezier(0.55, 0, 0.25, 1)';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
}

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // The new theme grows out of the toggle in the navbar as a circle until it covers the whole page
  const toggleTheme = (event) => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!document.startViewTransition || reduceMotion) {
      setTheme(next);
      return;
    }

    // Use the button's centre rather than the pointer, so keyboard toggles start from the same spot
    const rect = event?.currentTarget?.getBoundingClientRect?.();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const root = document.documentElement;
    // Colour transitions would otherwise still be fading inside the revealed area
    root.classList.add('theme-switching');

    const transition = document.startViewTransition(() => {
      applyTheme(next);
      flushSync(() => setTheme(next));
    });

    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: REVEAL_DURATION, easing: REVEAL_EASING, pseudoElement: '::view-transition-new(root)' }
        );
      })
      .catch(() => {});

    transition.finished.finally(() => root.classList.remove('theme-switching'));
  };

  return { theme, toggleTheme, isDark: theme === 'dark' };
}
