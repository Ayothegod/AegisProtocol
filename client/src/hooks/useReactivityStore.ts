import { create } from "zustand";
import { SDK } from "@somnia-chain/reactivity";
import { createPublicClient, http } from "viem";
import { somniaTestnet } from "@/lib/somnia";
import type { AlertEvent } from "@/types";

interface ReactivityStore {
  alerts: AlertEvent[];
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  addAlert: (alert: AlertEvent) => void;
  clearAlerts: () => void;
}

export const useReactivityStore = create<ReactivityStore>((set, get) => ({
  alerts: [],
  isConnected: false,

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, 100), // keep last 100
    })),

  connect: async () => {
    try {
      const publicClient = createPublicClient({
        chain: somniaTestnet,
        transport: http(import.meta.env.VITE_SOMNIA_RPC_URL),
      });

      const sdk = new SDK({ public: publicClient });

      await sdk.subscribe({
        ethCalls: [],
        onData: (data) => {
          // Parse incoming reactive events and add to alerts
          const alert: AlertEvent = {
            id: crypto.randomUUID(),
            type: "guardian_fired",
            positionId: BigInt(0),
            message: "Guardian event received",
            detail: JSON.stringify(data.result.topics),
            timestamp: Date.now(),
            status: "danger",
          };
          get().addAlert(alert);
        },
        onError: (err) => {
          console.error("Reactivity error:", err);
          set({ isConnected: false });
        },
      });

      set({ isConnected: true });
    } catch (err) {
      console.error("Failed to connect reactivity:", err);
    }
  },

  disconnect: () => {
    set({ isConnected: false });
  },

  clearAlerts: () => set({ alerts: [] }),
}));
