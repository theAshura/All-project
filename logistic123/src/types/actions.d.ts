import { Store, Action } from 'redux';
import { PersistorOptions, Persistor } from 'redux-persist/es/types';

declare module 'redux-persist/es/persistStore' {
  export default function persistStore<State, A extends Action>(
    store: Store<State, A>,
    persistorOptions?: PersistorOptions | null,
    callback?: () => any,
  ): Persistor;
}
