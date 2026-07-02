import postgres from "postgres";

declare global {
  var __carrosselSql__: ReturnType<typeof postgres> | undefined;
}

function getSql() {
  if (!globalThis.__carrosselSql__) {
    globalThis.__carrosselSql__ = postgres(getDatabaseUrl(), {
      ssl: "require"
    });
  }

  return globalThis.__carrosselSql__;
}

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return url;
}

const sqlProxy = (() => {}) as unknown as ReturnType<typeof postgres>;

export const sql = new Proxy(sqlProxy, {
  apply(_target, _thisArg, argArray: Parameters<ReturnType<typeof postgres>>) {
    return getSql()(...argArray);
  },
  get(_target, prop) {
    const client = getSql() as unknown as Record<PropertyKey, unknown>;
    const value = client[prop];

    if (typeof value === "function") {
      return value.bind(client);
    }

    return value;
  }
}) as ReturnType<typeof postgres>;

if (process.env.NODE_ENV !== "production") {
  // Keep the proxy itself stable during development; the underlying client is lazy.
}
