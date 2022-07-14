import {
  DefaultInternalErrorView,
  DefaultNotFoundErrorView,
} from "@ethicdevs/fastify-stream-react-views";

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
  baseHeadTags: [
    { kind: "meta", charset: "utf-8" },
    {
      kind: "meta",
      name: "robots",
      content:
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
    {
      kind: "meta",
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      kind: "link",
      rel: "icon",
      type: "image/x-icon",
      href: "/public/favicon.ico",
    },
  ],
  commonProps: {},
  env: process.env.NODE_ENV === "production" ? "production" : "development",
  externalDependencies: {},
  featureFlags: {
    withDevServer: false,
    withStyledSSR: false,
  },
  logger: {
    enabled: true,
  },
  paths: {
    distFolder: UNSET_CONFIG_TAG,
    islandsFolder: UNSET_CONFIG_TAG,
    rootFolder: UNSET_CONFIG_TAG,
    routesFile: UNSET_CONFIG_TAG,
    viewsFolder: UNSET_CONFIG_TAG,
  },
  specialComponents: {
    AppComponent: DefaultAppComponent,
    ErrorsBoundary: DefaultErrorsBoundary as never,
    InternalServerErrorView: DefaultInternalErrorView as never,
    NotFoundView: DefaultNotFoundErrorView as never,
  },
  titleSeparatorChar: "∙",
};
