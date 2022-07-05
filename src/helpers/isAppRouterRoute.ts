import {
  ApiRoute,
  AppRoute,
  AppRouterGroup,
  AppRouterRoute,
  SSRPrepassComponentType,
} from "../types";

import { isApiRoute, isAppRoute } from "./isRouteGuards";

export function isAppRouterApiRoute(
  el: SSRPrepassComponentType,
): el is SSRPrepassComponentType<ApiRoute> &
  AppRouterRoute<AppRouterGroup.API> {
  return !!(
    el.type != null &&
    typeof el.type === "function" &&
    (el.type as Function).name === "Route" &&
    isApiRoute(el.props as never) === true
  );
}

export function isAppRouterAppRoute(
  el: SSRPrepassComponentType,
): el is SSRPrepassComponentType<AppRoute> &
  AppRouterRoute<AppRouterGroup.DEFAULT> {
  return !!(
    el.type != null &&
    typeof el.type === "function" &&
    (el.type as Function).name === "Route" &&
    isAppRoute(el.props as never) === true
  );
}
