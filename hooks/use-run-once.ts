import { useEffect, useRef } from 'react';

export function useRunOnce(fn: () => Promise<void>) {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;   
    ran.current = true;
    fn();
  }, [fn]);
}