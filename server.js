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
app.set("trust proxy", 1);

// Log the DATABASE_URL for debugging
console.log("DATABASE_URL:", process.env.DATABASE_URL);

// Create a PostgreSQL pool using the DATABASE_URL with SSL enabled
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000, // Increase timeout to 5 seconds
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("PostgreSQL Connection Error:", err));

// Use connect-pg-simple for session storage, reusing the same pool
app.use(cors({
  origin: "https://progress-tracker-1mb9.onrender.com", // Change to your frontend domain
  credentials: true,
}));

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

app.use((req, res, next) => {
  console.log('Session Debug:', {
    sessionId: req.sessionID,
    hasSession: !!req.session,
    userId: req.session?.userId
  });
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure views directory is set

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  console.log('Session check:', req.session);
  console.log('User ID in session:', req.session.userId);

  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect("/login");
};

// Routes
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
            return res.redirect("/dashboard");
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

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    console.log("Registration attempt for:", username, email);
    // Check if user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE username = $1 OR email = $2", [username, email]);
    if (userCheck.rows.length > 0) {
      console.log("User already exists");
      return res.status(400).json({ error: "Username or email already exists" });
    }
    console.log("Hashing password…");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");
    console.log("Inserting new user into database…");
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
      [username, email, hashedPassword]
    );
    console.log("User inserted successfully, ID:", result.rows[0].id);
    req.session.userId = result.rows[0].id;
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    return next(err);
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

app.get("/dashboard", isAuthenticated, (req, res) => {
  console.log("🔍 Session at /dashboard:", req.session);
  if (!req.session.userId) {
    console.log("❌ User not logged in, redirecting to login");
    return res.redirect("/login");
  }
  console.log("✅ User is logged in, rendering dashboard");
  res.render("dashboard", { user: req.session.userId });
});

// Additional routes for subjects, chapters, components, etc. should also return after sending a response

app.post("/add-subject", isAuthenticated, async (req, res) => {
  const { name, weightage } = req.body;
  console.log("Received data:", { name, weightage, userId: req.session.userId });

  try {
    const result = await pool.query(
      "INSERT INTO subjects (name, weightage, user_id) VALUES ($1, $2, $3) RETURNING *",
      [name, weightage, req.session.userId]
    );
    console.log("Subject added:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding subject:", err);
    res.status(500).json({ error: "Error adding subject" });
  }
});

app.put("/edit-subject/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { name, weightage } = req.body;
  try {
    const result = await pool.query(
      "UPDATE subjects SET name = $1, weightage = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [name, weightage, id, req.session.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating subject:", err);
    res.status(500).json({ error: "Error updating subject" });
  }
});

app.delete("/delete-subject/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM subjects WHERE id = $1 AND user_id = $2", [id, req.session.userId]);
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting subject:", err);
    res.status(500).json({ error: "Error deleting subject" });
  }
});

app.post("/add-chapter", isAuthenticated, async (req, res) => {
  const { subjectId, name, weightage } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO chapters (subject_id, name, weightage, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [subjectId, name, weightage, req.session.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding chapter:", err);
    res.status(500).json({ error: "Error adding chapter" });
  }
});

app.put("/edit-chapter/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { name, weightage } = req.body;
  try {
    const result = await pool.query(
      "UPDATE chapters SET name = $1, weightage = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [name, weightage, id, req.session.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating chapter:", err);
    res.status(500).json({ error: "Error updating chapter" });
  }
});

app.delete("/delete-chapter/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM chapters WHERE id = $1 AND user_id = $2", [id, req.session.userId]);
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting chapter:", err);
    res.status(500).json({ error: "Error deleting chapter" });
  }
});

app.post("/add-component", isAuthenticated, async (req, res) => {
  const { chapterId, name, weightage } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO components (chapter_id, name, weightage, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [chapterId, name, weightage, req.session.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding component:", err);
    res.status(500).json({ error: "Error adding component" });
  }
});

app.put("/edit-component/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { name, weightage } = req.body;
  try {
    const result = await pool.query(
      "UPDATE components SET name = $1, weightage = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [name, weightage, id, req.session.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating component:", err);
    res.status(500).json({ error: "Error updating component" });
  }
});

app.delete("/delete-component/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM components WHERE id = $1 AND user_id = $2", [id, req.session.userId]);
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting component:", err);
    res.status(500).json({ error: "Error deleting component" });
  }
});

app.post("/update-progress", isAuthenticated, async (req, res) => {
  const { componentId, completed } = req.body;
  try {
    await pool.query("UPDATE components SET completed = $1 WHERE id = $2 AND user_id = $3", [
      completed,
      componentId,
      req.session.userId,
    ]);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error updating progress:", err);
    res.status(500).json({ error: "Error updating progress" });
  }
});

app.get("/get-structure", isAuthenticated, async (req, res) => {
  try {
    // Fetch subjects, chapters, and components for the logged-in user
    const subjects = await pool.query("SELECT * FROM subjects WHERE user_id = $1", [req.session.userId]);
    const chapters = await pool.query("SELECT * FROM chapters WHERE user_id = $1", [req.session.userId]);
    const components = await pool.query("SELECT * FROM components WHERE user_id = $1", [req.session.userId]);

    // Build the nested structure
    const structure = subjects.rows.map((subject) => ({
      id: subject.id,
      name: subject.name,
      weightage: subject.weightage,
      chapters: chapters.rows
        .filter((chapter) => chapter.subject_id === subject.id)
        .map((chapter) => ({
          id: chapter.id,
          name: chapter.name,
          weightage: chapter.weightage,
          components: components.rows
            .filter((component) => component.chapter_id === chapter.id)
            .map((component) => ({
              id: component.id,
              name: component.name,
              weightage: component.weightage,
              completed: component.completed || false, // Ensure completed is a boolean
            })),
        })),
    }));

    // Send the structured data as JSON
    res.json({ subjects: structure });
  } catch (err) {
    console.error("Error fetching structure:", err);
    res.status(500).json({ error: "Error fetching structure" });
  }
});

app.get("/progress", isAuthenticated, (req, res) => {
  res.render("progress");
});

// Centralized error handling middleware (must come last)
app.use((err, req, res, next) => {
  console.error("Error handler:", err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).render("error", { error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
