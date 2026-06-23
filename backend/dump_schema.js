const pool = require('./config/db');

async function dumpSchema() {
  try {
    const tablesRes = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    
    for (let row of tablesRes.rows) {
      const colRes = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${row.table_name}'`);
      console.log(`Table: ${row.table_name}`);
      console.log(colRes.rows.map(c => `  - ${c.column_name} (${c.data_type})`).join('\n'));
      console.log('---');
    }
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    pool.end();
  }
}
dumpSchema();
