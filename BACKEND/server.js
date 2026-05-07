const path = require("path");
const express = require("express");
const cors = require("cors");

const db = require("./db");
const { getAIResponse } = require("./ai");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= FRONTEND ================= */
app.use(express.static(path.join(__dirname, "../PUBLIC")));

app.get("/", (req, res) => {
    res.redirect("/signup.html");
});

app.get("/chatbot", (req, res) => {
    res.sendFile(path.join(__dirname, "../PUBLIC/chatbot.html"));
});

/* ================= SIGNUP ================= */
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing fields" });
    }

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, password], (err) => {
        if (err) {
            console.error("Signup Error:", err);
            return res.json({ success: false, message: "Signup failed" });
        }

        res.json({ success: true, message: "Signup successful" });
    });
});

/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email=? AND password=?";

    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error("Login Error:", err);
            return res.json({ success: false, message: "Login error" });
        }

        if (result.length === 0) {
            return res.json({ success: false, message: "Invalid login" });
        }

        res.json({ success: true, message: "Login successful" });
    });
});

/* ================= BOOKINGS ================= */
app.post("/bookings", (req, res) => {
    const { pickup, drop_location, date, vehicleType, fare } = req.body;

    if (!pickup || !drop_location || !date || !vehicleType || !fare) {
        return res.json({ success: false, message: "Missing booking data" });
    }

    const sql = `
        INSERT INTO bookings (pickup, drop_location, travel_date, vehicle_type, fare)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [pickup, drop_location, date, vehicleType, fare], (err) => {
        if (err) {
            console.error("Booking Error:", err);
            return res.json({ success: false, message: "Booking failed" });
        }

        res.json({ success: true, message: "Booking successful" });
    });
});

/* ================= CHATBOT ================= */
app.post("/chat", async (req, res) => {
    try {
        const reply = await getAIResponse(req.body.message);
        res.json({ reply });
    } catch (err) {
        console.error("Chatbot Error:", err);
        res.json({ reply: "Sorry, chatbot error occurred." });
    }
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} 🚀`);
});