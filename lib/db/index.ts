import { drizzle } from 'drizzle-orm/neon-http';
import { withReplicas } from 'drizzle-orm/pg-core';
import * as schema from '@/lib/db/schema';
import { serverEnv } from '@/env/server';
import { upstashCache } from 'drizzle-orm/cache/upstash';
import { neon } from '@neondatabase/serverless';

const sql = neon(serverEnv.DATABASE_URL);
const sqlread1 = neon(serverEnv.DATABASE_URL); // Fallback to main DB if read replicas not configured
const sqlread2 = neon(serverEnv.DATABASE_URL); // Fallback to main DB if read replicas not configured

export const maindb = drizzle(sql, {
  schema,
  ...(serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN
    ? {
        cache: upstashCache({
          url: serverEnv.UPSTASH_REDIS_REST_URL,
          token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
          global: true,
          config: { ex: 600 },
        }),
      }
    : {}),
});

const dbread1 = drizzle(sqlread1, {
  schema,
  ...(serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN
    ? {
        cache: upstashCache({
          url: serverEnv.UPSTASH_REDIS_REST_URL,
          token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
          global: true,
          config: { ex: 600 },
        }),
      }
    : {}),
});

const dbread2 = drizzle(sqlread2, {
  schema,
  ...(serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN
    ? {
        cache: upstashCache({
          url: serverEnv.UPSTASH_REDIS_REST_URL,
          token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
          global: true,
          config: { ex: 600 },
        }),
      }
    : {}),
});

export const db = withReplicas(maindb, [dbread1, dbread2]);
