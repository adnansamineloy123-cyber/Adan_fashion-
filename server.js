const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// public ফোল্ডারের ফাইলগুলো (HTML/CSS) ব্রাউজারে দেখানোর জন্য
app.use(express.static(path.join(__dirname, 'public')));

// গুগল শিট API লিঙ্ক (Vercel Environment Variable থেকে নিবে)
const SHEETDB_URL = process.env.SHEETDB_URL || "https://sheetdb.io/api/v1/goe1q7f0ma6g5";

// --- ১. লগইন লজিক ---
app.post('/auth/login', async (req, res) => {
    const { id, pin } = req.body;
    try {
        const response = await axios.get(`${SHEETDB_URL}/search?Game_ID=${id}`);
        const user = response.data[0];

        if (user && user.PIN.toString() === pin.toString()) {
            res.json({ 
                success: true, 
                token: Buffer.from(id).toString('base64'), 
                name: user.Name,
                coins: user.Coins
            });
        } else {
            res.status(401).json({ success: false, message: "ভুল আইডি বা পিন!" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "সার্ভার এরর" });
    }
});

// --- ২. হোমপেজের প্রোফাইল ডাটা লোড ---
app.get('/auth/user-data', async (req, res) => {
    try {
        const userId = Buffer.from(req.query.id, 'base64').toString('ascii');
        const response = await axios.get(`${SHEETDB_URL}/search?Game_ID=${userId}`);
        const user = response.data[0];
        if (user) {
            res.json({ success: true, name: user.Name, coins: user.Coins });
        } else {
            res.status(404).json({ success: false });
        }
    } catch (e) {
        res.status(500).json({ success: false });
    }
});

// --- ৩. টুর্নামেন্ট জয়েনিং (নিরাপদ ট্রানজেকশন) ---
app.post('/tournament/join', async (req, res) => {
    const { userId, entryFee } = req.body;
    try {
        const response = await axios.get(`${SHEETDB_URL}/search?Game_ID=${userId}`);
        const user = response.data[0];

        if (user && parseInt(user.Coins) >= parseInt(entryFee)) {
            const newBalance = parseInt(user.Coins) - parseInt(entryFee);
            
            // শিটে কয়েন আপডেট করা
            await axios.put(`${SHEETDB_URL}/Game_ID/${userId}`, {
                data: { "Coins": newBalance }
            });
            res.json({ success: true, newBalance });
        } else {
            res.json({ success: false, message: "পর্যাপ্ত কয়েন নেই!" });
        }
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// --- ৪. ডিফল্ট রুট (সবশেষে থাকবে) ---
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Vercel এর জন্য এক্সপোর্ট
module.exports = app;
