const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

let db;

/* =========================
   MySQL connection with retry
========================= */
function connectWithRetry() {
  console.log("⏳ Trying to connect to MySQL...");

  const connection = mysql.createConnection({
    host: "mysql",          // اسم السيرفس في docker-compose
    user: "appuser",
    password: "app123",
    database: "restaurant_db"
  });

  connection.connect(err => {
    if (err) {
      console.error("❌ DB connection failed, retrying in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log("✅ Connected to MySQL");
      db = connection;
    }
  });
}

connectWithRetry();

/* =========================
   Routes
========================= */

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Restaurant App</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #eefaf0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .card {
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        text-align: center;
      }
      input {
        padding: 10px;
        width: 200px;
        margin-bottom: 15px;
        border-radius: 5px;
        border: 1px solid #ccc;
      }
      button {
        padding: 10px 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      button:hover {
        background: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>🔥 Restaurant Recommendation System 🔥</h2>
      <form action="/recommend">
        <input name="meal" placeholder="Enter favorite meal" />
        <br/>
        <button type="submit">Recommend</button>
      </form>
      <p style="margin-top:15px;">🚀 Updated via Jenkins + Docker</p>
    </div>
  </body>
  </html>
  `);
});

// التوصية
app.get("/recommend", (req, res) => {
  const meal = req.query.meal;

  if (!db) {
    return res.send("❌ Database not connected yet, try again in a few seconds");
  }

  db.query(
    "SELECT name FROM restaurants WHERE meal = ?",
    [meal],
    (err, results) => {

      if (err) {
        console.error(err);
        return res.send("❌ Database error");
      }

      let message;
      let color;

      if (!results || results.length === 0) {
        message = "❌ No restaurant found for this meal";
        color = "#dc3545";
      } else {
        message = `🍽️ Recommended Restaurant: <strong>${results[0].name}</strong>`;
        color = "#28a745";
      }

      res.send(`
      <html>
      <head>
        <title>Result</title>
        <style>
          body {
            font-family: Arial;
            background: #f4f6f8;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .result-card {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            text-align: center;
          }
          .message {
            color: ${color};
            font-size: 20px;
            margin-bottom: 20px;
          }
          a {
            text-decoration: none;
            color: white;
            background: #007bff;
            padding: 10px 20px;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="result-card">
          <div class="message">${message}</div>
          <a href="/">⬅ Back</a>
        </div>
      </body>
      </html>
      `);
    }
  );
});

/* =========================
   Start server
========================= */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
