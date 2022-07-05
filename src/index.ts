import type { StreamReactViewFunction } from "@ethicdevs/fastify-stream-react-views";

declare module "fastify" {
  export interface FastifyReply {
    // A reply utility function that stream a React Component as the reply
    streamReactView: StreamReactViewFunction;
  }
}

// Re-exports them for convenience over long lib name
export type {
  ReactIsland,
  ReactView,
} from "@ethicdevs/fastify-stream-react-views";

/* Types */
export type {
  ApiRoute,
  AppRoute,
  AppRouterGroup,
  AppRouterGroupType,
  AppRouterRoot,
  AppRouterRoute,
  AppRouterRouteGroup,
  AppRouter,
  AppServer,
  AppServerA11YConfig,
  AppServerConfig,
  AppServerFeatureFlags,
  AppServerLoggerConfig,
  AppServerOptions,
  AppServerPaths,
  AppServerSpecialComponents,
  // helper types
  Env,
  IRoute,
  Required,
  ReqHandler,
  ReqOpts,
  ReqPath,
} from "./types";

/* Constants */
export { DEFAULT_APP_SERVER_CONFIG } from "./core";

/* Components */
export {
  DefaultAppComponent,
  DefaultErrorsBoundary,
  Router,
} from "./components";

/* Functions */
export { makeAppServer, startAppServer, stopAppServerAndExit } from "./core";
