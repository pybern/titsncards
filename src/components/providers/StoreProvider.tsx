"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "@/lib/store";

const HydrationContext = createContext(false);

/** True once the persisted zustand store has rehydrated on the client. */
export function useHydrated() {
  return useContext(HydrationContext);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    // Manually rehydrate the persisted store (skipHydration: true).
    // Resolve the returned promise so setState happens asynchronously
    // (outside the synchronous effect body).
    Promise.resolve(useStore.persist.rehydrate()).then(() => {
      if (active) setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <HydrationContext.Provider value={hydrated}>
      {children}
    </HydrationContext.Provider>
  );
}
