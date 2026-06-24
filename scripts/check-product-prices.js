const { Client } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL non impostata');
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query('SELECT id, price FROM "Product" ORDER BY id');
    console.log(result.rows);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
