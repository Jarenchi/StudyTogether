import { create } from "zustand";

interface UserStore {
  userId: string;
  setUserId: (userId: string) => void;
}
const useUserStore = create<UserStore>((set) => ({
  userId: "",
  setUserId: (userId: string) => set({ userId }),
}));

export default useUserStore;
