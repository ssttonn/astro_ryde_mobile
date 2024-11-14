import { create } from "zustand";

import { DriverStore, MarkerData } from "@/types/type";

export const useDriverStore = create<DriverStore>((set) => {
  return {
    drivers: [] as MarkerData[],
    selectedDriver: null,
    setSelectedDriver: (driverId: number) => {
      set((state) => {
        return {
          ...state,
          selectedDriver: driverId,
        };
      });
    },
    setDrivers: (drivers: MarkerData[]) => {
      set((state) => {
        return {
          ...state,
          drivers: drivers,
        };
      });
    },
    clearSelectedDriver: () => {
      set((state) => {
        return {
          ...state,
          selectedDriver: null,
        };
      });
    },
  };
});
