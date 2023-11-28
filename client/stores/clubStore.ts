import { create } from "zustand";

interface Club {
  id: string;
  name: string;
}

interface ClubStore {
  clubs: Club[];
  setClubs: (clubs: Club[]) => void;
}
const useClubStore = create<ClubStore>((set) => ({
  clubs: [],
  setClubs: (clubs: Club[]) => set({ clubs }),
}));

export default useClubStore;
