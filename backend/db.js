import mysql from "mysql2/promise";
import dns from "dns/promises";

let cachedIp = null;

async function resolveHost() {
  if (cachedIp) return cachedIp;
  const { address } = await dns.lookup(process.env.DB_HOST);
  cachedIp = address;
  console.log(`DNS OK: ${process.env.DB_HOST} → ${address}`);
  return address;
}

async function connectWithRetry(maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const host = await resolveHost();
      const conn = await mysql.createConnection({
        host,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false },
        connectTimeout: 15000
      });
      console.log("MySQL CONNECTED!");
      return conn;
    } catch (err) {
      console.log(`Retry ${i + 1}/${maxRetries}:`, err.code || err.message);
      if (i === maxRetries - 1) throw err;
      await new Promise(r => setTimeout(r, 3000 * (i + 1)));
    }
  }
}

// ✅ Export as default for ES module import
export default connectWithRetry();
