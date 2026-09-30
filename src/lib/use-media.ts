"use client";

import { useSyncExternalStore } from "react";

/** matchMedia an toàn cho SSR — server luôn trả về `serverValue`. */
export function useMedia(query: string, serverValue = true) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
