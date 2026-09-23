import mysql from 'mysql2/promise';

const passwords = ["root", "secret", "", "123456", "password", "Admin@123"];
const databases = ["empcloud", "emp_recruit", "emp_payroll"];

async function testConnection() {
  let workingConn = null;
  let workingPassword = null;

  for (const pwd of passwords) {
    try {
      const conn = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: pwd,
      });
      console.log(`Successfully connected to MySQL with password: "${pwd}"`);
      workingConn = conn;
      workingPassword = pwd;
      break;
    } catch (err) {
      console.log(`Connection failed with password "${pwd}": ${err.message}`);
    }
  }

  if (!workingConn) {
    console.error("Could not connect to MySQL with any standard password.");
    process.exit(1);
  }

  try {
    for (const dbName of databases) {
      await workingConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      console.log(`Database \`${dbName}\` exists or was created successfully.`);
    }
    console.log(`WORKING_MYSQL_PASSWORD=${workingPassword}`);
  } catch (err) {
    console.error(`Database creation failed: ${err.message}`);
  } finally {
    await workingConn.end();
  }
}

testConnection();
