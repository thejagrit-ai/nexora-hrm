import http from 'http';
import mysql from 'mysql2/promise';

function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function debugSSO() {
  const loginRes = await postJson("http://localhost:3000/api/v1/auth/login", {
    email: "ananya@technova.in",
    password: "Welcome@123"
  });

  const token = loginRes.data.tokens.access_token;
  const parts = token.split('.');
  const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
  console.log("Token payload:", payload);

  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'empcloud'
  });

  const [rows] = await conn.query("SELECT * FROM oauth_access_tokens WHERE jti = ?", [payload.jti]);
  console.log("DB Row for jti:", rows);
  await conn.end();
}

debugSSO();
