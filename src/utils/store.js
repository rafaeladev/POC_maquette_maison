// store.js
import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useStore = create(
  subscribeWithSelector((set) => {
    return {
      scenario: "A",
      setScenario: (scenario) => set({ scenario }),
    };
  })
);

export default useStore;
