import { useLocation } from "react-router-dom";
import { getReturnPath } from "../lib/authRouting";

/** Current route path + query — use as post-sign-in return target. */
export function useReturnPath(): string {
  const location = useLocation();
  return getReturnPath(location.pathname, location.search);
}
