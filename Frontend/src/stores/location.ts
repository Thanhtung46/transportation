// stores/location.ts
import { create } from 'zustand';

type LocationState = {
  latitude?: number;
  longitude?: number;
  setLocation: (lat: number, lng: number) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  latitude: undefined,
  longitude: undefined,
  setLocation: (lat, lng) => set({ latitude: lat, longitude: lng }),
}));