const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// আপনার HTML ফাইলগুলো 'public' ফোল্ডারের ভেতর আছে তাই এটি দরকার
app.use(express.static(path.join(__dirname, 'public')));

// গুগল শিট API (Vercel Settings থেকে নিবে)
const SHEETDB_URL = process.env.SHEETDB_URL || "https://sheetdb.io/api/v1/goe1q7f0ma6g5";

// --- ১. রেজিস্ট্রেশন রুট ---
app.post('/auth/register', async (req, res) => {
    const { name, id, pin } = req.body;
    try {
        await axios.post(SHEETDB_URL, {
            data: [{
                "Name": name,
                "Game_ID": id,
                "PIN": pin,
                "Coins": 0
            }]
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Registration Failed" });
    }
});

// --- ২. লগইন রুট ---
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
            res.status(401).json({ success: false, message: "Wrong ID or PIN" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// --- ৩. ইউজার ডাটা রিড (হোমপেজের জন্য) ---
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

// --- ৪. টুর্নামেন্ট জয়েন (টাকা কাটা) ---
app.post('/tournament/join', async (req, res) => {
    const { userId, entryFee } = req.body;
    try {
        const response = await axios.get(`${SHEETDB_URL}/search?Game_ID=${userId}`);
        const user = response.data[0];

        if (user && parseInt(user.Coins) >= parseInt(entryFee)) {
            const newBalance = parseInt(user.Coins) - parseInt(entryFee);
            await axios.put(`${SHEETDB_URL}/Game_ID/${userId}`, {
                data: { "Coins": newBalance }
            });
            res.json({ success: true, newBalance });
        } else {
            res.json({ success: false, message: "Insufficient Coins" });
        }
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// --- ৫. সব শেষে মেইন ফাইল পাঠানো ---
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
                
