import { create } from 'zustand';

export const useBookmarkStore = create<{ ids: string[]; toggle: (id: string) => void }>((set) => ({ ids: [], toggle: (id) => set((state) => ({ ids: state.ids.includes(id) ? state.ids.filter((item) => item !== id) : [...state.ids, id] })) }));
