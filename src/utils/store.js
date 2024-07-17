// store.js
import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useStore = create(
  subscribeWithSelector((set) => {
    return {
      scenario: "A",
      isClose: true,
      setScenario: (scenario) => set({ scenario }),
      setIsClose: (isClose) => set({ isClose }),
    };
  })
);

export default useStore;
