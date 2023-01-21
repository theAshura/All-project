import * as React from "react";
import { UNSAFE_NavigationContext } from "react-router-dom";
import type { History, Blocker, Transition } from "history";

export function useBlocker(blocker: Blocker, when = true): void {
  const navigator = React.useContext(UNSAFE_NavigationContext)
    .navigator as History;

  React.useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx: Transition) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((tx.location.state as any)?.force) {
        autoUnblockingTx.retry();
      }
    });

    return unblock;
  }, [navigator, blocker, when]);
}
