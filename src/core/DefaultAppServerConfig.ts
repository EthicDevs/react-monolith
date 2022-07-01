// lib
import type { AppServerConfig } from "../types";

import { DefaultAppComponent, DefaultErrorsBoundary } from "../components";

export const DEFAULT_APP_SERVER_CONFIG: AppServerConfig = {
  a11y: {
    localeDirection: 'ltr',
  },
  appName: "React Monolith",
  appVersion: "<unset>",
  env: "production",
  logger: {
    enabled: true,
  },
  featureFlags: {
    withDevServer: false,// __DEV__ === true,
    withResponseCompression: true,// __DEV__ !== true,
    withStyledSSR: false,
  },
  specialComponents: {
    AppComponent: DefaultAppComponent,
    ErrorsBoundary: DefaultErrorsBoundary as never,
    InternalServerErrorView: () => null,
    NotFoundView: () => null,
  },
  paths: {
    distFolder: "<unset>",
    islandsFolder: "<unset>",
    rootFolder: "<unset>",
    viewsFolder: "<unset>",
  },
};
