// 3rd-party
import React from "react";

// lib
import { AppRouterGroup, RouterElements } from "../types";
import { isAppRoute, isApiRoute } from "../helpers";

const Router: RouterElements = {
  Root: ({ children }) => <div data-routes-root>{children}</div>,
  Group: ({ children, type: routeGroupType }) => (
    <div data-route-group-type={routeGroupType}>{children}</div>
  ),
  Route: (route) => {
    if (isAppRoute(route)) {
      const { path, view: RouteView } = route;
      return (
        <div data-route-type={AppRouterGroup.DEFAULT} data-route-path={path}>
          <RouteView _ssr={true} />
        </div>
      );
    }

    if (isApiRoute(route)) {
      const { path, handler } = route;
      return (
        <div
          data-route-type={AppRouterGroup.API}
          data-route-path={path}
          data-route-handler-name={handler.name}
        />
      );
    }

    return null;
  },
};

export default Router;
