require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// ✅ Trust Proxy for Render (Fixes session issues)
app.set("trust proxy", 1);

// ✅ Debugging Logs
console.log("DATABASE_URL:", process.env.DATABASE_URL);

// ✅ PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("PostgreSQL Connection Error:", err));

// ✅ CORS Configuration (Allow Cookies)
app.use(cors({
  origin: "https://progress-tracker-1mb9.onrender.com", // Change to your frontend domain
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Session Configuration (Fixes Cookie Issues)
app.use(session({
  store: new PgSession({ pool: pool, tableName: "session" }),
  name: "sid",
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // Required for HTTPS (Render forces HTTPS)
    httpOnly: true, // Prevents JavaScript access
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "None" // Required for cross-origin cookies
  }
}));

// ✅ Debugging Session Middleware
app.use((req, res, next) => {
  console.log("Session Debug:", {
    sessionId: req.sessionID,
    hasSession: !!req.session,
    userId: req.session?.userId
  });
  next();
});

// ✅ Set View Engine and Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Middleware to Check if User is Authenticated
const isAuthenticated = (req, res, next) => {
  console.log("Session check:", req.session);
  console.log("User ID in session:", req.session.userId);

  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect("/login");
};

// ✅ Routes
app.get("/", (req, res) => {
  res.render("landing", { user: req.session.userId });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        console.log("✅ Before regenerating session:", req.session);

        req.session.regenerate((err) => {
          if (err) {
            console.error("❌ Session regenerate error:", err);
            return res.render("login", { error: "Session error. Please try again." });
          }

          req.session.userId = user.id;
          req.session.username = user.username;

          req.session.save((err) => {
            if (err) {
              console.error("❌ Session save error:", err);
              return res.render("login", { error: "Login error. Please try again." });
            }
            console.log("✅ Session saved successfully:", req.session);
            return res.redirect("/"); // 🔥 Redirecting to Home instead of Dashboard
          });
        });

        return; // Prevent duplicate responses
      }
    }
    res.render("login", { error: "Invalid credentials" });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.render("login", { error: "An error occurred" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
    }
    res.redirect("/login");
  });
});

app.get("/dashboard", (req, res) => {
  console.log("🔍 Session at /dashboard:", req.session);
  if (!req.session.userId) {
    console.log("❌ User not logged in, redirecting to login");
    return res.redirect("/login");
  }
  console.log("✅ User is logged in, rendering dashboard");
  res.render("dashboard", { user: req.session.userId });
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error handler:", err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).render("error", { error: "Something went wrong!" });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
