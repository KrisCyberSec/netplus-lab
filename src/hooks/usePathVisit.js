import { useEffect } from 'react';
import { markPathVisit } from '../lib/progress';

/** Record that the user opened a path step / page (for guided progress). */
export function usePathVisit(...stepIds) {
  useEffect(() => {
    markPathVisit(...stepIds);
  }, [stepIds.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
}
