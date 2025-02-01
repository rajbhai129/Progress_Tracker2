require("dotenv").config()
const express = require("express")
const { Pool } = require("pg")
const bodyParser = require("body-parser")
const path = require("path")
const bcrypt = require("bcrypt")
const session = require("express-session")

const app = express()
const port = process.env.PORT || 3000

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views")) // Ensure views directory is set
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set to true if using HTTPS
  }),
)

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next()
  } else {
    res.redirect("/login")
  }
}

// Routes
app.get("/", (req, res) => {
  res.render("landing", { user: req.session.userId });
});



app.get("/login", (req, res) => {
  res.render("login")
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
      const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      if (result.rows.length > 0) {
          const user = result.rows[0];
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
              req.session.userId = user.id;
              res.redirect("/"); // Redirect back to landing page
          } else {
              res.render("login", { error: "Invalid credentials" });
          }
      } else {
          res.render("login", { error: "Invalid credentials" });
      }
  } catch (err) {
      console.error("Error during login:", err);
      res.status(500).render("error", { error: "Error during login" });
  }
});



app.get("/register", (req, res) => {
  res.render("register")
})

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body
  try {
    console.log("Registration attempt for:", username, email)

    // Check if user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE username = $1 OR email = $2", [username, email])
    if (userCheck.rows.length > 0) {
      console.log("User already exists")
      return res.status(400).json({ error: "Username or email already exists" })
    }

    console.log("Hashing password...")
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("Password hashed successfully")

    console.log("Inserting new user into database...")
    const result = await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id", [
      username,
      email,
      hashedPassword,
    ])
    console.log("User inserted successfully, ID:", result.rows[0].id)

    req.session.userId = result.rows[0].id
    res.status(201).json({ message: "User registered successfully" })
  } catch (err) {
    console.error("Error during registration:", err)
    res.status(500).json({ error: "Error during registration: " + err.message })
  }
})

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err)
    }
    res.redirect("/login")
  })
})
app.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    const subjects = await pool.query("SELECT * FROM subjects WHERE user_id = $1", [req.session.userId]);
    res.render("index", { user: req.session.userId, subjects: subjects.rows }); 
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).render("error", { error: "Error fetching subjects" });
  }
});


/*app.get("/", isAuthenticated, async (req, res) => {
  try {
    const subjects = await pool.query("SELECT * FROM subjects WHERE user_id = $1", [req.session.userId])
    res.render("index", { subjects: subjects.rows })
  } catch (err) {
    console.error("Error fetching subjects:", err)
    res.status(500).render("error", { error: "Error fetching subjects" })
  }
}) */

app.post("/add-subject", isAuthenticated, async (req, res) => {
  const { name, weightage } = req.body
  try {
    const result = await pool.query("INSERT INTO subjects (name, weightage, user_id) VALUES ($1, $2, $3) RETURNING *", [
      name,
      weightage,
      req.session.userId,
    ])
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error("Error adding subject:", err)
    res.status(500).json({ error: "Error adding subject" })
  }
})

app.put("/edit-subject/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params
  const { name, weightage } = req.body
  try {
    const result = await pool.query(
      "UPDATE subjects SET name = $1, weightage = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [name, weightage, id, req.session.userId],
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error("Error updating subject:", err)
    res.status(500).json({ error: "Error updating subject" })
  }
})

app.delete("/delete-subject/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query("DELETE FROM subjects WHERE id = $1 AND user_id = $2", [id, req.session.userId])
    res.sendStatus(204)
  } catch (err) {
    console.error("Error deleting subject:", err)
    res.status(500).json({ error: "Error deleting subject" })
  }
})

app.post("/add-chapter", isAuthenticated, async (req, res) => {
  const { subjectId, name, weightage } = req.body
  try {
    const result = await pool.query(
      "INSERT INTO chapters (subject_id, name, weightage, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [subjectId, name, weightage, req.session.userId],
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error("Error adding chapter:", err)
    res.status(500).json({ error: "Error adding chapter" })
  }
})

app.put("/edit-chapter/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params
  const { name, weightage } = req.body
  try {
    const result = await pool.query(
      "UPDATE chapters SET name = $1, weightage = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [name, weightage, id, req.session.userId],
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error("Error updating chapter:", err)
    res.status(500).json({ error: "Error updating chapter" })
  }
})

app.delete("/delete-chapter/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query("DELETE FROM chapters WHERE id = $1 AND user_id = $2", [id, req.session.userId])
    res.sendStatus(204)
  } catch (err) {
    console.error("Error deleting chapter:", err)
    res.status(500).json({ error: "Error deleting chapter" })
  }
})

app.post("/add-component", isAuthenticated, async (req, res) => {
  const { chapterId, name, weightage } = req.body
  try {
    const result = await pool.query(
      "INSERT INTO components (chapter_id, name, weightage, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [chapterId, name, weightage, req.session.userId],
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error("Error adding component:", err)
    res.status(500).json({ error: "Error adding component" })
  }
})

app.put("/edit-component/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params
  const { name, weightage } = req.body
  try {
    const result = await pool.query(
      "UPDATE components SET name = $1, weightage = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [name, weightage, id, req.session.userId],
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error("Error updating component:", err)
    res.status(500).json({ error: "Error updating component" })
  }
})

app.delete("/delete-component/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query("DELETE FROM components WHERE id = $1 AND user_id = $2", [id, req.session.userId])
    res.sendStatus(204)
  } catch (err) {
    console.error("Error deleting component:", err)
    res.status(500).json({ error: "Error deleting component" })
  }
})

app.post("/update-progress", isAuthenticated, async (req, res) => {
  const { componentId, completed } = req.body
  try {
    await pool.query("UPDATE components SET completed = $1 WHERE id = $2 AND user_id = $3", [
      completed,
      componentId,
      req.session.userId,
    ])
    res.sendStatus(200)
  } catch (err) {
    console.error("Error updating progress:", err)
    res.status(500).json({ error: "Error updating progress" })
  }
})

app.get("/get-structure", isAuthenticated, async (req, res) => {
  try {
    const subjects = await pool.query("SELECT * FROM subjects WHERE user_id = $1", [req.session.userId])
    const chapters = await pool.query("SELECT * FROM chapters WHERE user_id = $1", [req.session.userId])
    const components = await pool.query("SELECT * FROM components WHERE user_id = $1", [req.session.userId])

    const structure = subjects.rows.map((subject) => ({
      ...subject,
      chapters: chapters.rows
        .filter((chapter) => chapter.subject_id === subject.id)
        .map((chapter) => ({
          ...chapter,
          components: components.rows
            .filter((component) => component.chapter_id === chapter.id)
            .map((component) => ({
              ...component,
              completed: component.completed || false,
            })),
        })),
    }))

    res.json({ subjects: structure })
  } catch (err) {
    console.error("Error fetching structure:", err)
    res.status(500).json({ error: "Error fetching structure" })
  }
})

app.get("/progress", isAuthenticated, (req, res) => {
  res.render("progress")
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("error", { error: "Something went wrong!" })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
