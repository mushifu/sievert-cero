import { create } from 'zustand'

export const useCharacterStore = create((set) => ({
  stepIndex: 0,
  data: {},

  nextStep: () =>
    set((state) => ({ stepIndex: state.stepIndex + 1 })),

  setField: (key, value) =>
    set((state) => ({
      data: { ...state.data, [key]: value }
    })),

  prevStep: () =>
    set((state) => ({
      stepIndex:
        Math.max(state.stepIndex - 1, 0)
    })),

  reset: () => set({ stepIndex: 0, data: {} })
}))