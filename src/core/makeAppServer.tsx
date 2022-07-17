// 1st-party
import FastifyStreamReactViews, {
  InternalViewKind,
} from "@ethicdevs/fastify-stream-react-views";

// 3rd-party
import Fastify from "fastify";
import React from "react";
import deepMerge from "deepest-merge";
import ssrPrepass from "react-ssr-prepass";

// lib
import type {
  ApiRoute,
  AppRoute,
  AppRouter,
  AppServer,
  AppServerConfig,
  AppServerOptions,
  SSRPrepassComponentType,
} from "../types";

import {
  DEFAULT_APP_SERVER_CONFIG,
  UNSET_CONFIG_TAG,
} from "./DefaultAppServerConfig";

import { isAppRouterApiRoute, isAppRouterAppRoute } from "../helpers";

export default async function makeAppServer(
  host: string,
  port: string | number,
  options: AppServerOptions = DEFAULT_APP_SERVER_CONFIG,
): Promise<AppServer> {
  const defaultConfig: AppServerConfig = deepMerge<AppServerConfig>(
    DEFAULT_APP_SERVER_CONFIG,
    options as never,
  );

  // For cases where options should be passed as refs.
  const config: AppServerConfig = {
    ...defaultConfig,
    specialComponents: {
      ...defaultConfig.specialComponents,
      ...options.specialComponents,
    },
  };

  const { logger, paths, specialComponents } = config;

  if (specialComponents == null) {
    throw new Error(
      'The "specialComponents" config property cannot be null. This is not supported.',
    );
  }

  const pathsValues = Object.values(paths);
  if (pathsValues.some((v) => v === UNSET_CONFIG_TAG)) {
    throw new Error(
      `The "paths.*" config properties cannot be set to "${UNSET_CONFIG_TAG}". This is not supported.`,
    );
  }

  if (config.appVersion === UNSET_CONFIG_TAG) {
    console.warn(
      `The "appVersion" is set to "${UNSET_CONFIG_TAG}" make sure to set it properly for release builds (cache buster key).`,
    );
  }

  const server: AppServer = Fastify({
    logger: logger.enabled,
  }) as unknown as AppServer; // missing 'reactMonolith' defined below

  // Add useful info to the server instance so they can be accessed later on
  server.decorate("reactMonolith", {
    $host: host,
    $port: parseInt(`${port}`, 10),
    $config: config,
  });

  // where the whole magic happens
  server.register(FastifyStreamReactViews, {
    appComponent: specialComponents.AppComponent,
    appName: config.appName,
    commonProps: config.commonProps,
    distFolder: config.paths.distFolder,
    externalDependencies: config.externalDependencies,
    islandsFolder: config.paths.islandsFolder,
    rootFolder: config.paths.rootFolder,
    titleSeparatorChar: config.titleSeparatorChar,
    viewsFolder: config.paths.viewsFolder,
    viewContext: {
      html: {
        dir: config.a11y.localeDirection,
      },
      head: config.baseHeadTags,
    },
    withStyledSSR: config.featureFlags.withStyledSSR,
  });

  server.setErrorHandler((error, _, reply) => {
    return reply.streamReactView(InternalViewKind.INTERNAL_ERROR_VIEW, {
      error,
    });
  });

  server.setNotFoundHandler((_, reply) => {
    return reply.streamReactView(InternalViewKind.NOT_FOUND_ERROR_VIEW);
  });

  // Register routes
  const router = await import(config.paths.routesFile);
  const SSRAppRouter: AppRouter = router.default;

  let apiRoutes: ApiRoute[] = [];
  let appRoutes: AppRoute[] = [];

  await ssrPrepass(<SSRAppRouter />, (element) => {
    const el = element as unknown as SSRPrepassComponentType;
    if (isAppRouterApiRoute(el)) {
      apiRoutes.push({
        method: el.props.method,
        path: el.props.path,
        handler: el.props.handler,
      });
    } else if (isAppRouterAppRoute(el)) {
      appRoutes.push({
        path: el.props.path,
        view: el.props.view,
      });
    }
    return undefined;
  });

  // Register API routes
  apiRoutes.forEach((route) => {
    server.register((fastify, _, done) => {
      const anyFastify = fastify as any;
      const lowerMethod =
        route.method != null ? route.method.toLowerCase() : "all";
      anyFastify[lowerMethod]?.(route.path, {}, route.handler);
      done();
    });
  });

  // Register "app/view" routes
  appRoutes.forEach((route) => {
    server.register((fastify, _, done) => {
      fastify.all(route.path, async (request, reply) => {
        // TODO: Asynchronously call the View's fetchData method?
        return reply.streamReactView(route.view.name, {
          method: request.method,
        });
      });
      done();
    });
  });

  return server;
}
