const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config(); // API লিঙ্ক নিরাপদ রাখার জন্য

const app = express();
app.use(express.json());
app.use(express.static('public')); // আপনার HTML ফাইলগুলো 'public' ফোল্ডারে থাকবে

// --- কনফিগারেশন (গোপন রাখা হবে) ---
const SHEETDB_URL = process.env.SHEETDB_URL || "https://sheetdb.io/api/v1/goe1q7f0ma6g5";

// ১. লগইন লজিক (নিরাপদ যাচাইকরণ)
app.post('/auth/login', async (req, res) => {
    const { id, pin } = req.body;

    try {
        const response = await axios.get(`${SHEETDB_URL}/search?Game_ID=${id}`);
        const user = response.data[0];

        if (user && user.PIN === pin) {
            // সফল লগইন - পাসওয়ার্ড ছাড়া বাকি ডাটা পাঠানো
            res.json({ 
                success: true, 
                token: Buffer.from(id).toString('base64'), // সিম্পল সিকিউরিটি টোকেন
                name: user.Name,
                coins: user.Coins
            });
        } else {
            res.status(401).json({ success: false, message: "INVALID CREDENTIALS" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "SERVER ERROR" });
    }
});

// ২. টুর্নামেন্ট জয়েন লজিক (টাকা-পয়সার নিরাপত্তা এখানেই)
app.post('/tournament/join', async (req, res) => {
    const { userId, entryFee, matchId } = req.body;

    try {
        // ধাপ ১: শিট থেকে ইউজারের লেটেস্ট কয়েন চেক করা (হ্যাক প্রুফ)
        const userFetch = await axios.get(`${SHEETDB_URL}/search?Game_ID=${userId}`);
        const user = userFetch.data[0];

        if (!user) return res.json({ success: false, message: "USER NOT FOUND" });

        const currentCoins = parseInt(user.Coins);
        const fee = parseInt(entryFee);

        // ধাপ ২: ব্যালেন্স চেক
        if (currentCoins >= fee) {
            const newBalance = currentCoins - fee;

            // ধাপ ৩: শিটে ব্যালেন্স আপডেট করা
            await axios.put(`${SHEETDB_URL}/Game_ID/${userId}`, {
                data: { "Coins": newBalance }
            });

            // ধাপ ৪: ট্রানজেকশন রেকর্ড করা (ঐচ্ছিক)
            // আপনি চাইলে matches বা orders শিটেও ডাটা পাঠাতে পারেন

            res.json({ success: true, newBalance: newBalance });
        } else {
            res.json({ success: false, message: "INSUFFICIENT COINS" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "TRANSACTION FAILED" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SYSTEM LIVE ON PORT ${PORT}`));
 app.get('/auth/user-data', async (req, res) => {
    const userId = req.query.id;
    try {
        const response = await axios.get(`${SHEETDB_URL}/search?Game_ID=${userId}`);
        const user = response.data[0];
        res.json({ success: true, name: user.Name, coins: user.Coins });
    } catch (e) {
        res.json({ success: false });
    }
});
            
