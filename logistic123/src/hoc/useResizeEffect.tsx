import { useEffect } from 'react';

export const useResizeEffect = (onResize, deps = []) => {
  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, onResize]);
};
