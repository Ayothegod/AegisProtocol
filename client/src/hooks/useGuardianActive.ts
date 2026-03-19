import { useReactivityStore } from "./useReactivityStore";

export function useGuardianActive(): boolean {
  return useReactivityStore((state) => state.isConnected);
}
