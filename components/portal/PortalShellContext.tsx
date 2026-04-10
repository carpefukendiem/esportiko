"use client";

import { createContext, useContext } from "react";

const CollapsedContext = createContext(false);

export function PortalShellCollapsedProvider({
  collapsed,
  children,
}: {
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <CollapsedContext.Provider value={collapsed}>
      {children}
    </CollapsedContext.Provider>
  );
}

export function usePortalShellCollapsed() {
  return useContext(CollapsedContext);
}
