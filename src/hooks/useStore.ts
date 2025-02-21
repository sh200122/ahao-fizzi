// 检查是否准备好

import { create } from "zustand";

interface State {
    ready: boolean;
    isReady: () => void;
}

export const useStore = create<State>((set) => ({
    ready: false,
    isReady: () => set({ ready: true }),
}));