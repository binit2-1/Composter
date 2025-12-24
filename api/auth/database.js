import { Pool } from "pg";

const database = await (async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const forceEagerInıt = async () => {
    await pool.query("select 1");
  };

  await forceEagerInıt();

  return pool;
})();

export default database;
