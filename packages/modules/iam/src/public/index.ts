import { DomainError, uuidv7, type Sql } from "@minimart/shared-kernel";

export interface UserRecord {
  readonly userId: string;
  readonly username: string;
}

interface UserRow {
  user_account_id: string;
  username: string;
}

const toUser = (row: UserRow): UserRecord => ({
  userId: row.user_account_id,
  username: row.username,
});

export async function createUser(
  sql: Sql,
  tenantId: string,
  username: string,
  now: Date,
): Promise<UserRecord> {
  const normalized = username.trim();
  if (normalized === "") {
    throw new DomainError("USERNAME_REQUIRED", "Username is required", "VALIDATION");
  }
  if ((await findUser(sql, tenantId, normalized)) !== null) {
    throw new DomainError("USERNAME_TAKEN", "Username already exists", "CONFLICT");
  }
  const userId = uuidv7(now);
  await sql.query(
    `INSERT INTO iam.user_accounts (user_account_id, tenant_id, username, status, created_at)
     VALUES ($1, $2, $3, 'ACTIVE', $4)`,
    [userId, tenantId, normalized, now],
  );
  return { userId, username: normalized };
}

export async function findUser(
  sql: Sql,
  tenantId: string,
  username: string,
): Promise<UserRecord | null> {
  const { rows } = await sql.query<UserRow>(
    `SELECT user_account_id, username FROM iam.user_accounts
     WHERE tenant_id = $1 AND lower(username) = lower($2) AND status = 'ACTIVE'`,
    [tenantId, username],
  );
  const row = rows[0];
  return row === undefined ? null : toUser(row);
}

export async function listUsers(sql: Sql, tenantId: string): Promise<UserRecord[]> {
  const { rows } = await sql.query<UserRow>(
    `SELECT user_account_id, username FROM iam.user_accounts
     WHERE tenant_id = $1 AND status = 'ACTIVE' ORDER BY username`,
    [tenantId],
  );
  return rows.map(toUser);
}
