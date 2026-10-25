export interface MigrationQueryResult<T = Record<string, unknown>> {
  rows: T[];
  rowCount: number;
}

export interface MigrationClient {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<MigrationQueryResult<T>>;
}

export const ensureIndex = async (
  client: MigrationClient,
  tableName: string,
  indexName: string,
  columns: string
): Promise<void> => {
  const existing = await client.query<{ index_name: string }>(
    `SELECT index_name FROM information_schema.statistics
     WHERE table_schema = DATABASE()
       AND table_name = '${tableName}'
       AND index_name = '${indexName}'
     LIMIT 1`
  );

  if (existing.rowCount === 0) {
    await client.query(`CREATE INDEX ${indexName} ON ${tableName}(${columns})`);
  }
};

export const ensureTable = async (client: MigrationClient, statement: string): Promise<void> => {
  await client.query(statement);
};
