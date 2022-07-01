// lib
import type { AppServer } from "../types";
import stopAppServerAndExit from "./stopAppServerAndExit";

export default async function startAppServer(server: AppServer): Promise<void> {
  try {
    if (server.reactMonolith == null) {
      throw new Error(
        'Cannot start app server before it has been initialized through "makeServer" first.'
      )
    }

    const { $host, $port } = server.reactMonolith;
    await server.listen($port, $host);
  } catch (err) {
    await stopAppServerAndExit(server, err as Error);
  }
}
