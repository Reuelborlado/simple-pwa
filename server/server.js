const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../")));

// API Routes

// GET all todos
app.get("/api/todos", (req, res) => {
  db.all("SELECT * FROM todos ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(
        rows.map((row) => ({
          id: row.id,
          text: row.text,
          completed: Boolean(row.completed),
          createdAt: new Date(row.created_at).getTime(),
        }))
      );
    }
  });
});

// POST new todo
app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Text is required" });
  }

  db.run(
    "INSERT INTO todos (text, completed) VALUES (?, 0)",
    [text],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({
          id: this.lastID,
          text,
          completed: false,
          createdAt: Date.now(),
        });
      }
    }
  );
});

// PUT update todo (toggle or edit)
app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  if (text !== undefined && completed !== undefined) {
    // Update both text and completed
    db.run(
      "UPDATE todos SET text = ?, completed = ? WHERE id = ?",
      [text, completed ? 1 : 0, id],
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ id, text, completed });
        }
      }
    );
  } else if (text !== undefined) {
    // Update only text
    db.run(
      "UPDATE todos SET text = ? WHERE id = ?",
      [text, id],
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ id, text });
        }
      }
    );
  } else if (completed !== undefined) {
    // Update only completed status
    db.run(
      "UPDATE todos SET completed = ? WHERE id = ?",
      [completed ? 1 : 0, id],
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ id, completed });
        }
      }
    );
  } else {
    res.status(400).json({ error: "No update fields provided" });
  }
});

// DELETE todo
app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM todos WHERE id = ?", [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Todo deleted", id });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});