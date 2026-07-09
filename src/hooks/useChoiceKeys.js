import { useEffect } from 'react';

/**
 * Keyboard: 1-4 select choices when not answered; Enter/→ advances when answered.
 */
export function useChoiceKeys({ choiceCount, onSelect, onNext, enabled = true, answered = false }) {
  useEffect(() => {
    if (!enabled) return undefined;

    function onKey(e) {
      if (e.target.matches('input, textarea, select')) return;

      if (!answered) {
        const n = Number(e.key);
        if (n >= 1 && n <= choiceCount) {
          e.preventDefault();
          onSelect(n - 1);
        }
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        onNext?.();
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choiceCount, onSelect, onNext, enabled, answered]);
}
