// lib
import type { AppServerConfig } from "../types";

import { DefaultAppComponent, DefaultErrorsBoundary } from "../components";

export const UNSET_CONFIG_TAG = `<unset>`;

export const DEFAULT_APP_SERVER_CONFIG: AppServerConfig = {
  a11y: {
    localeDirection: "ltr",
  },
  appName: "React Monolith",
  appVersion: UNSET_CONFIG_TAG,
  env: "production",
  logger: {
    enabled: true,
  },
  featureFlags: {
    withDevServer: false, // __DEV__ === true,
    withResponseCompression: true, // __DEV__ !== true,
    withStyledSSR: false,
  },
  specialComponents: {
    AppComponent: DefaultAppComponent,
    ErrorsBoundary: DefaultErrorsBoundary as never,
    InternalServerErrorView: () => null,
    NotFoundView: () => null,
  },
  paths: {
    distFolder: UNSET_CONFIG_TAG,
    islandsFolder: UNSET_CONFIG_TAG,
    rootFolder: UNSET_CONFIG_TAG,
    routesFile: UNSET_CONFIG_TAG,
    viewsFolder: UNSET_CONFIG_TAG,
  },
};
