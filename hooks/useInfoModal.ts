import { create } from "zustand";

export interface ModalStoreInterface {
  movieID: string;
  isOpen: boolean;
  openModal: (movieID: string) => void;
  closeModal: () => void;
}

const useInfoModal = create<ModalStoreInterface>((set) => ({
  movieID: "",
  isOpen: false,
  openModal: (movieID: string) => set({ movieID, isOpen: true }),
  closeModal: () => set({ movieID: "", isOpen: false }),
}));

export default useInfoModal;