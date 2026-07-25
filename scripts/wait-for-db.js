const net = require('net');

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.log('No DATABASE_URL defined, proceeding...');
  process.exit(0);
}

try {
  const parsed = new URL(dbUrl);
  const host = parsed.hostname;
  const port = Number(parsed.port) || 5432;

  console.log(`Checking connection to database at ${host}:${port}...`);

  let attempts = 0;
  const maxAttempts = 30;

  function checkConnection() {
    attempts++;
    const socket = net.createConnection(port, host);
    socket.setTimeout(3000);

    socket.on('connect', () => {
      console.log('✅ Database server is online and ready!');
      socket.end();
      process.exit(0);
    });

    socket.on('error', (err) => {
      socket.destroy();
      if (attempts >= maxAttempts) {
        console.error(`❌ Database server not reachable after ${maxAttempts} attempts:`, err.message);
        process.exit(1);
      }
      console.log(`Database starting up... retry ${attempts}/${maxAttempts}...`);
      setTimeout(checkConnection, 2000);
    });

    socket.on('timeout', () => {
      socket.destroy();
      if (attempts >= maxAttempts) {
        console.error(`❌ Database connection timed out after ${maxAttempts} attempts.`);
        process.exit(1);
      }
      console.log(`Database connection timeout... retry ${attempts}/${maxAttempts}...`);
      setTimeout(checkConnection, 2000);
    });
  }

  checkConnection();
} catch (err) {
  console.warn('Could not parse DATABASE_URL, skipping wait check:', err.message);
  process.exit(0);
}
