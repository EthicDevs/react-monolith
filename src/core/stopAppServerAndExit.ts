// lib
import type { AppServer } from "../types";

export default async function stopAppServerAndExit(
  server?: null | AppServer,
  err?: Error
) {
  if (server != null) {
    server.close();
    if (err != null) {
      server.log.error(err);
    }
  } else {
    if (err != null) {
      console.error(err);
    }
  }
  process.exit(
    err != null
      ? "code" in err
        ? (err as Error & { code: number })?.code
        : 1
      : 0
  );
}
