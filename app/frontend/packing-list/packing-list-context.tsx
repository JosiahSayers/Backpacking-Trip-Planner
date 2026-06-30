import { createContext, useContext } from "react";

const PackingListContext = createContext<{ editable: boolean }>({
  editable: false,
});

export const PackingListProvider = PackingListContext.Provider;

export function usePackingList() {
  return useContext(PackingListContext);
}
