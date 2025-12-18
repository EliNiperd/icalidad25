
import msql from 'mssql';

/* global Map */
const pools = new Map();

const dbSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: false,
  },
};


export const usegetPool = async (name) => {
  // console.log(process.env.NEXT_PUBLIC_DB_USER)
  // console.log(dbSettings);

  if (!pools.has(name)) {
    if (!dbSettings) {
      throw new Error('Pool does not exists');
    }
    const pool = new msql.ConnectionPool(dbSettings);

    const close = pool.close.bind(pool);
    pool.close = (...args) => {
      pools.delete(name);
      return close(...args);
    };
    pools.set(name, pool.connect());
  }
  return pools.get(name);
};
/* global Promise */
export const closePools = async () =>
  Promise.all(
    Array.from(pools.values()).map((connect) => {
      return connect.then((pool) => pool.close());
    })
  );

export const connectDB = async () => {
  try {
    const pool = await msql.connect(dbSettings);
    // pool().connected()
    return pool;
  } catch (error) {
    console.log(error);
  }
};

export const typeParameter = async () => {
  const types = msql.TYPES;
  return types;
};

export default usegetPool;