// lib
import type { AppRouterRoot, SSRPrepassComponentType } from "../types";

export function isAppRouterRoot(
  el: SSRPrepassComponentType,
): el is SSRPrepassComponentType & AppRouterRoot {
  return !!(
    el.type != null &&
    typeof el.type === "function" &&
    (el.type as Function).name === "Root" &&
    el.key === ".0"
  );
}
