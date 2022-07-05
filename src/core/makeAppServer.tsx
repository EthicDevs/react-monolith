// 1st-party
import FastifyStreamReactViews from "@ethicdevs/fastify-stream-react-views";
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
  AppRouterRoot,
  AppServer,
  AppServerConfig,
  AppServerOptions,
  SSRPrepassComponentType,
} from "../types";

import {
  DEFAULT_APP_SERVER_CONFIG,
  UNSET_CONFIG_TAG,
} from "./DefaultAppServerConfig";

import {
  isAppRouterApiRoute,
  isAppRouterAppRoute,
  isAppRouterRoot,
} from "../helpers";

export default async function makeAppServer(
  host: string,
  port: string | number,
  options: AppServerOptions = DEFAULT_APP_SERVER_CONFIG,
): Promise<AppServer> {
  const config: AppServerConfig = deepMerge<AppServerConfig>(
    DEFAULT_APP_SERVER_CONFIG,
    options as never,
  );

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
    titleSeparatorChar: "∙",
    rootFolder: config.paths.rootFolder,
    distFolder: config.paths.distFolder,
    islandsFolder: config.paths.islandsFolder,
    viewsFolder: config.paths.viewsFolder,
    viewContext: {
      html: {
        dir: config.a11y.localeDirection,
      },
      head: [
        // config.metas.charset
        { kind: "meta", charset: "utf-8" },
        {
          // config.metas.robots.allowIndexFollow === true
          kind: "meta",
          name: "robots",
          content:
            "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
        },
        {
          // config.metas.responsive === true
          kind: "meta",
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          // config.metas.favicon === true || type('string') => .href
          kind: "link",
          rel: "icon",
          type: "image/x-icon",
          href: "/public/favicon.ico",
        },
      ],
    },
    withStyledSSR: config.featureFlags.withStyledSSR,
  });

  server.setErrorHandler((error, _, reply) => {
    return reply.streamReactView("internal-error", { error });
    /*return handleRequestWithView<InternalErrorViewProps>(
      "internal-error",
      request,
      reply,
      { error }
    );*/
  });

  server.setNotFoundHandler((_, reply) => {
    return reply.streamReactView("not-found");
    // return handleRequestWithView("not-found", request, reply);
  });

  // Register routes
  const router = await import(config.paths.routesFile);
  const SSRAppRouter: AppRouter = router.default;

  let appRouterRoot: null | (AppRouterRoot & SSRPrepassComponentType) = null;
  let apiRoutes: ApiRoute[] = [];
  let appRoutes: AppRoute[] = [];

  await ssrPrepass(<SSRAppRouter />, (element) => {
    const el = element as unknown as SSRPrepassComponentType;
    if (isAppRouterRoot(el)) {
      appRouterRoot = el as AppRouterRoot & SSRPrepassComponentType;
    } else if (isAppRouterApiRoute(el)) {
      apiRoutes.push({
        method: el.props.method || "GET",
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

  console.log("appRouterRoot:", appRouterRoot);
  console.log("apiRoutes:", apiRoutes);
  console.log("appRoutes:", appRoutes);

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
      fastify.get(route.path, async (_, reply) => {
        // TODO: Asynchronously call the View's fetchData method?
        return reply.streamReactView(route.view.name);
      });
      done();
    });
  });

  return server;
}
