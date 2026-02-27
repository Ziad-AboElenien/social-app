import { useContext } from "react";
import { UIContext } from "../../Context/UI.context";

export function useUI() {
  return useContext(UIContext);
}

