import { EffectCallback, useEffect, useRef } from 'react';

/**
 *
 * @param effect Effect callback for handling logic
 * @param data Data to pass into form
 */
const useEffectFillDataOnce = (effect: EffectCallback, data: any) => {
  // EXPLAINATION: make this hook runs and only run one time when deps is available
  const isRun = useRef(false);

  useEffect(() => {
    if (!isRun.current && data) {
      effect();
      isRun.current = true;
    }
  }, [data, effect]);
};

export default useEffectFillDataOnce;
