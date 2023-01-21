/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useBlocker } from "./useBlocker";
interface LastLocation {
  path: string;
  retry: () => void;
}
export function useCallbackPrompt(
  when: boolean
): [boolean, () => void, () => void] {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [lastLocation, setLastLocation] = useState<LastLocation>({
    path: "",
    retry: () => undefined,
  });
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  const cancelNavigation = useCallback(() => {
    setShowPrompt(false);
  }, []);

  // handle blocking when user click on another route prompt will be shown
  const handleBlockedNavigation = useCallback(
    (nextLocation) => {
      // in if condition we are checking next location and current location are equals or not
      if (
        !confirmedNavigation &&
        nextLocation.location.pathname !== location.pathname
      ) {
        setShowPrompt(true);
        setLastLocation({
          path: nextLocation.location.pathname,
          retry: nextLocation.retry,
        });
        return false;
      }
      return true;
    },
    [confirmedNavigation]
  );

  const confirmNavigation = useCallback(() => {
    setShowPrompt(false);
    setConfirmedNavigation(true);
  }, []);

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      navigate(lastLocation.path);
    }
  }, [confirmedNavigation, lastLocation]);

  useBlocker(handleBlockedNavigation, when);

  return [showPrompt, confirmNavigation, cancelNavigation];
}
