import { create } from "zustand";

import { LocationStore } from "@/types/type";

export const useLocationStore = create<LocationStore>((set) => {
  return {
    userAddress: undefined,
    userLatitude: undefined,
    userLongitude: undefined,
    destinationAddress: undefined,
    destinationLatitude: undefined,
    destinationLongitude: undefined,
    setUserLocation: ({
      latitude,
      longitude,
      address,
    }: {
      latitude: number;
      longitude: number;
      address: string;
    }) => {
      set((state) => {
        return {
          ...state,
          userLatitude: latitude,
          userLongitude: longitude,
          userAddress: address,
        };
      });
    },
    setDestinationLocation: ({
      latitude,
      longitude,
      address,
    }: {
      latitude: number;
      longitude: number;
      address: string;
    }) => {
      set((state) => {
        return {
          ...state,
          destinationAddress: address,
          destinationLatitude: latitude,
          destinationLongitude: longitude,
        };
      });
    },
  };
});
