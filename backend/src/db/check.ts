import { checkDatabaseConnection, pool } from '../config/db';

const main = async (): Promise<void> => {
  try {
    const connected = await checkDatabaseConnection();
    if (!connected) process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

main().catch((error: unknown) => {
  console.error('TiDB connection check failed:', error);
  process.exitCode = 1;
});
