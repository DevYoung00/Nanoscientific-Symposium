import create from "zustand";

interface AdminState {
  darkMode: boolean;
  setDarkMode: () => void;
  disableDarkMode: () => void;
  toggleDarkMode: () => void;
  isSponsorPreview: boolean;
  setIsSponsorPreview: (newState: boolean) => void;
  isSponsor2Preview: boolean;
  setIsSponsor2Preview: (newState: boolean) => void;
}

const useAdminStore = create<AdminState>((set) => ({
  darkMode: false,
  setDarkMode: () => set(() => ({ darkMode: true })),
  disableDarkMode: () => set(() => ({ darkMode: false })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  isSponsorPreview: false,
  setIsSponsorPreview: (newState) =>
    set((state) => ({ ...state, isSponsorPreview: newState })),
  isSponsor2Preview: false,
  setIsSponsor2Preview: (newState) =>
    set((state) => ({ ...state, isSponsorPreview: newState })),
}));

export default useAdminStore;
