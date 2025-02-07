require('dotenv').config();
const express = require('express');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;
app.set("trust proxy", 1);
// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('PostgreSQL Connection Error:', err));

// Session configuration
app.use(session({
  store: new PgSession({
    pool: pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'test-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Test route
app.get('/', (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`You have visited this page ${req.session.views} times`);
  } else {
    req.session.views = 1;
    res.send('Welcome to this page for the first time!');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Simulate requests
console.log('Simulating requests...');
const simulateRequest = (path) => {
  console.log(`Request to ${path}`);
  let req = { session: {} };
  let res = {
    send: (msg) => console.log(`Response: ${msg}`)
  };
  if (path === '/') {
    if (req.session.views) {
      req.session.views++;
      res.send(`You have visited this page ${req.session.views} times`);
    } else {
      req.session.views = 1;
      res.send('Welcome to this page for the first time!');
    }
  }
};

simulateRequest('/');
simulateRequest('/');
simulateRequest('/');

// Test database query
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err);
  } else {
    console.log('Current time from database:', res.rows[0].now);
  }
  pool.end();
});