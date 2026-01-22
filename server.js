const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// আপনার গুগল শিট API (SheetDB)
const SHEETDB_URL = "https://sheetdb.io/api/v1/goe1q7f0ma6g5";

// লগইন রুট
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
            res.status(401).json({ success: false, message: "Invalid ID/PIN" });
        }
    } catch (e) { 
        res.status(500).json({ success: false, message: "Server Error" }); 
    }
});

// রেজিস্ট্রেশন রুট
app.post('/auth/register', async (req, res) => {
    const { name, id, pin } = req.body;
    try {
        await axios.post(SHEETDB_URL, { 
            data: [{"Name": name, "Game_ID": id, "PIN": pin, "Coins": 0}] 
        });
        res.json({ success: true });
    } catch (e) { 
        res.status(500).json({ success: false }); 
    }
});

// ইউজার ডাটা রুট
app.get('/auth/user-data', async (req, res) => {
    try {
        const userId = Buffer.from(req.query.id, 'base64').toString('ascii');
        const response = await axios.get(`${SHEETDB_URL}/search?Game_ID=${userId}`);
        res.json({ 
            success: true, 
            name: response.data[0].Name, 
            coins: response.data[0].Coins 
        });
    } catch (e) { 
        res.json({ success: false }); 
    }
});

// লোকাল হোস্টে টেস্ট করার জন্য (Vercel এটি অটো হ্যান্ডেল করবে)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
