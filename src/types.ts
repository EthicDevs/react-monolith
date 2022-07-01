// std
import { IncomingMessage, Server, ServerResponse } from "node:http";

// 3rd-party
import type { FastifyInstance, FastifyLoggerInstance } from "fastify";

// lib
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Env = "production" | "development" | "test";

export interface AppServerA11YConfig {
  localeDirection: "ltr" | "rtl";
}

export interface AppServerFeatureFlags {
  withDevServer: boolean;
  withResponseCompression: boolean;
  withStyledSSR: boolean;
}

export interface AppServerLoggerConfig {
  enabled?: boolean;
}

export interface AppServerPaths {
  distFolder: string;
  islandsFolder: string;
  rootFolder: string;
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
