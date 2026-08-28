const fs = require('fs');
const path = require('path');
const sql = require('mssql');

// 1. Cargar y parsear archivo .env manualmente para evitar dependencias extra
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return {};
  
  const env = {};
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      // Remover comillas si existen
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  });
  return env;
}

const env = loadEnv();

// Configuración de conexión con fallback a parámetros por consola
const config = {
  user: process.env.DB_USER || env.DB_USER || 'sa',
  password: process.env.DB_PASS || env.DB_PASS,
  server: process.env.DB_HOST || env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || env.DB_NAME,
  port: parseInt(process.env.DB_PORT || env.DB_PORT || '1433', 10),
  options: {
    encrypt: true,
    trustServerCertificate: true // Requerido para conectar a Docker/desarrollo sin certificado SSL firmado
  }
};

// Obtener la consulta SQL de los argumentos
const query = process.argv.slice(2).join(' ');

if (!query) {
  console.log('\nUso del script:');
  console.log('  node scripts/db-query.js "TU CONSULTA SQL AQUÍ"');
  console.log('\nConfiguración actual cargada:');
  console.log(`  Host: ${config.server}:${config.port}`);
  console.log(`  BD: ${config.database}`);
  console.log(`  Usuario: ${config.user}\n`);
  process.exit(0);
}

async function run() {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(query);
    
    if (result.recordset) {
      if (result.recordset.length === 0) {
        console.log('Consulta ejecutada con éxito. 0 filas devueltas.');
      } else {
        console.table(result.recordset);
      }
    } else {
      console.log('Consulta ejecutada con éxito. Filas afectadas:', result.rowsAffected);
    }
    
    await sql.close();
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err.message);
    process.exit(1);
  }
}

run();
