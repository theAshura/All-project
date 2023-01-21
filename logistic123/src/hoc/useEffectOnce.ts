import { EffectCallback, useEffect } from 'react';

const useEffectOnce = (effect: EffectCallback) => {
  // EXPLAINATION: make this hook runs only when DidMount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
};

export default useEffectOnce;
