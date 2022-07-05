import type { ApiRoute, AppRoute } from "../types";

export function isAppRoute(route: AppRoute | ApiRoute): route is AppRoute {
  const anyRoute = route as any;
  return !!(
    anyRoute != null &&
    "view" in anyRoute &&
    typeof anyRoute.view !== "undefined" &&
    anyRoute.view != null
  );
}

export function isApiRoute(route: AppRoute | ApiRoute): route is ApiRoute {
  const anyRoute = route as any;
  return !!(
    anyRoute != null &&
    "handler" in anyRoute &&
    typeof anyRoute.handler !== "undefined" &&
    anyRoute.handler != null
  );
}
