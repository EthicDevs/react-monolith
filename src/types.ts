// std
import { IncomingMessage, Server, ServerResponse } from "node:http";

// 3rd-party
import type {
  FastifyInstance,
  FastifyLoggerInstance,
  HTTPMethods,
  RouteHandlerMethod,
} from "fastify";
import { ComponentType, VFC } from "react";
import { ReactView } from "@ethicdevs/fastify-stream-react-views";

// lib
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Env = "production" | "development" | "test";

export type ReqPath = string;

export type ReqHandler = RouteHandlerMethod;

export type ReqOpts = { [x: string]: unknown };

export type IRoute =
  | [HTTPMethods, ReqPath, ReqHandler]
  | [HTTPMethods, ReqPath, ReqHandler, ReqOpts];

export interface AppServerA11YConfig {
  localeDirection: "ltr" | "rtl";
}

export interface AppServerFeatureFlags {
  withDevServer: boolean;
  withStyledSSR: boolean;
}

export interface AppServerLoggerConfig {
  enabled?: boolean;
}

export interface AppServerPaths {
  distFolder: string;
  islandsFolder: string;
  rootFolder: string;
  routesFile: string;
  viewsFolder: string;
}

export interface AppServerSpecialComponents {
  AppComponent: React.FC<{}>;
  ErrorsBoundary: React.Component<
    {
      children: React.ReactNode;
    },
    {
      hasError: boolean;
      error: null | Error;
    }
  >;
  InternalServerErrorView: React.VFC<{}>;
  NotFoundView: React.VFC<{}>;
}

export interface AppServerOptions {
  a11y?: Partial<AppServerA11YConfig>;
  appName: string;
  appVersion: string;
  env: Env;
  featureFlags?: Partial<AppServerFeatureFlags>;
  logger?: AppServerLoggerConfig;
  paths: AppServerPaths;
  specialComponents?: Partial<AppServerSpecialComponents>;
}

// Same thing as AppServerOptions but with all properties required
export type AppServerConfig = Required<
  Omit<
    AppServerOptions,
    "a11y" | "featureFlags" | "logger" | "specialComponents"
  > & {
    a11y: Required<AppServerA11YConfig>;
    env: Env;
    featureFlags: Required<AppServerFeatureFlags>;
    logger: Required<AppServerLoggerConfig>;
    specialComponents: Required<AppServerSpecialComponents>;
  }
>;

export type AppServer = FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse,
  FastifyLoggerInstance
> & {
  reactMonolith?: {
    $host: string;
    $port: number;
    $config: AppServerConfig;
  };
};

export type AppRouter = () => JSX.Element;

export type AppRouterGroupType = "default" | "api";
export enum AppRouterGroup {
  DEFAULT = "default",
  API = "api",
}

export interface AppRoute {
  type?: AppRouterGroup.DEFAULT;
  exact?: boolean;
  path: string;
  view: ReactView<any>;
}

export interface ApiRoute {
  type?: AppRouterGroup.API;
  method?: HTTPMethods;
  path: string;
  handler: ReqHandler;
}

export type AppRouterRouteGroup<T extends AppRouterGroupType = AppRouterGroup> =
  VFC<{
    children:
      | React.ReactElement<any, AppRouterRoute<T>>
      | Array<React.ReactElement<any, AppRouterRoute<T>>>;
    type: T;
  }>;

export type AppRouterRoute<T extends AppRouterGroupType = AppRouterGroup> = VFC<
  T extends "default" ? AppRoute : ApiRoute
>;

export type AppRouterRoot = VFC<{
  children: [
    React.ReactElement<{ type: "api" }, AppRouterRouteGroup<"api">>,
    React.ReactElement<{ type: "default" }, AppRouterRouteGroup<"default">>,
  ];
}>;

export interface RouterElements {
  Root: AppRouterRoot;
  Group: AppRouterRouteGroup;
  Route: AppRouterRoute;
}

export type SSRPrepassComponentType<P = {}> = ComponentType & {
  type: string;
  key: string;
  props: P;
};
