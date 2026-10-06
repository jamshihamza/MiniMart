/**
 * MM-010 TEST-ONLY: two isolated databases, one acting as the Store and one as the Cloud. Each gets
 * the frozen baseline through the MM-004 migration runner and then the harness's test-only tables.
 */
import { runMigrations } from "@minimart/database";

import { createIsolatedDatabase, type IsolatedDatabase } from "./postgres.js";
import { applyCloudTestOnlySchema, applyStoreTestOnlySchema } from "./test-only-schema.js";

/** Application build string inside the baseline migration's declared compatible range. */
const TEST_APPLICATION_BUILD = "0.1.0";

export interface DatabasePair {
  readonly store: IsolatedDatabase;
  readonly cloud: IsolatedDatabase;
  drop(): Promise<void>;
}

export async function createDatabasePair(): Promise<DatabasePair> {
  const store = await createIsolatedDatabase("mm010_store");
  let cloud: IsolatedDatabase | undefined;
  try {
    cloud = await createIsolatedDatabase("mm010_cloud");
    await runMigrations(store.pool, { applicationBuild: TEST_APPLICATION_BUILD });
    await runMigrations(cloud.pool, { applicationBuild: TEST_APPLICATION_BUILD });
    await applyStoreTestOnlySchema(store.pool);
    await applyCloudTestOnlySchema(cloud.pool);
  } catch (error) {
    await cloud?.drop().catch(() => undefined);
    await store.drop().catch(() => undefined);
    throw error;
  }
  const createdCloud = cloud;
  return {
    store,
    cloud: createdCloud,
    async drop() {
      await createdCloud.drop();
      await store.drop();
    },
  };
}

/** One more isolated Cloud-side database (baseline plus the Cloud test-only tables). */
export async function createCloudDatabase(): Promise<IsolatedDatabase> {
  const database = await createIsolatedDatabase("mm010_cloud2");
  try {
    await runMigrations(database.pool, { applicationBuild: TEST_APPLICATION_BUILD });
    await applyCloudTestOnlySchema(database.pool);
  } catch (error) {
    await database.drop().catch(() => undefined);
    throw error;
  }
  return database;
}
