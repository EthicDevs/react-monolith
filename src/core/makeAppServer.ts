// 3rd-party
import Fastify from "fastify";
import FastifyStreamReactViews from "@ethicdevs/fastify-stream-react-views";
import deepMerge from "deepest-merge";

// lib
import type { AppServer, AppServerConfig, AppServerOptions } from "../types";

import { DEFAULT_APP_SERVER_CONFIG } from "./DefaultAppServerConfig";

export default async function makeAppServer(
  host: string,
  port: string | number,
  options: AppServerOptions = DEFAULT_APP_SERVER_CONFIG,
): Promise<AppServer> {
  const config: AppServerConfig = deepMerge<AppServerConfig>(
    DEFAULT_APP_SERVER_CONFIG,
    options as never
  );

  const { logger, paths, specialComponents } = config;

  if (specialComponents == null) {
    throw new Error(
      'The "specialComponents" config property cannot be null. This is a bug.'
    );
  }

  const pathsValues = Object.values(paths);
  if (pathsValues.some((v) => v === '<unset>')) {
    throw new Error(
      'The "paths.*" config properties cannot be set to "<unset>". This is a bug.'
    );
  }

  const server: AppServer = Fastify({
    logger: logger.enabled,
  }) as unknown as AppServer; // missing 'reactMonolith' defined below

  // Add useful info to the server instance so they can be accessed later on
  server.decorate('reactMonolith', {
    $host: host,
    $port: parseInt(`${port}`, 10),
    $config: config,
  });

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
        { // config.metas.robots.allowIndexFollow === true
          kind: "meta",
          name: "robots",
          content:
            "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
        },
        { // config.metas.responsive === true
          kind: "meta",
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        { // config.metas.favicon === true || type('string') => .href
          kind: "link",
          rel: "icon",
          type: "image/x-icon",
          href: "/public/favicon.ico",
        },
      ],
    },
    withStyledSSR: config.featureFlags?.withStyledSSR,
  });

  server.setErrorHandler((error, _, reply) => {
    return reply.streamReactView( "internal-error", { error });
    /*return handleRequestWithView<InternalErrorViewProps>(
      "internal-error",
      request,
      reply,
      { error }
    );*/
  });

  server.setNotFoundHandler((_, reply) => {
    return reply.streamReactView('not-found');
    // return handleRequestWithView("not-found", request, reply);
  });

  return server;
}
