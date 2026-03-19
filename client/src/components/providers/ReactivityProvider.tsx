import { useReactivityStore } from "#/hooks/useReactivityStore";
import { createContext, useEffect, useRef } from "react";

const ReactivityContext = createContext<null>(null);

export function ReactivityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { connect, disconnect } = useReactivityStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    connect();
    return () => disconnect();
  }, []);

  return (
    <ReactivityContext.Provider value={null}>
      {children}
    </ReactivityContext.Provider>
  );
}
