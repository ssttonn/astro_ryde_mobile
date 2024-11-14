import { LocationStore } from "@/types/type";
import { create } from "zustand";

export const useLocationStore = create<LocationStore>((set) => {
  return {
    userAddress: null,
    userLatitude: null,
    userLongitude: null,
    destinationAddress: null,
    destinationLatitude: null,
    destinationLongitude: null,
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
