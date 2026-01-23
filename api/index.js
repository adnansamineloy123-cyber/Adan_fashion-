const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const SHEETDB_URL = "https://sheetdb.io/api/v1/3dn8ej3m7h685";

// ১. সিকিউর লগইন সিস্টেম
app.post('/api/login', async (req, res) => {
    const { gameID, pin } = req.body;
    try {
        const response = await axios.get(`${SHEETDB_URL}?sheet=Users`);
        const user = response.data.find(u => u.Game_ID == gameID && u.PIN == pin);
        
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: "Database Connection Failed" });
    }
});

// ২. সিকিউর জয়েন ম্যাচ (কয়েন চুরি ঠেকানোর মূল লজিক)
app.post('/api/join-match', async (req, res) => {
    const { gameID, matchID, fee } = req.body;
    
    try {
        // ক) সার্ভার থেকে ইউজারের আসল কয়েন চেক
        const usersRes = await axios.get(`${SHEETDB_URL}?sheet=Users`);
        const user = usersRes.find(u => u.Game_ID == gameID);
        
        if (!user || parseInt(user.Coins) < parseInt(fee)) {
            return res.status(400).json({ message: "Insufficient Balance!" });
        }

        // খ) নতুন ব্যালেন্স ক্যালকুলেশন (সার্ভারে)
        const newBalance = parseInt(user.Coins) - parseInt(fee);

        // গ) কয়েন আপডেট (PATCH)
        await axios.patch(`${SHEETDB_URL}/Game_ID/${gameID}?sheet=Users`, {
            data: { Coins: newBalance }
        });

        // ঘ) অর্ডার রেকর্ড তৈরি
        await axios.post(`${SHEETDB_URL}?sheet=Orders`, {
            data: {
                User_Name: user.Name,
                Game_ID: gameID,
                Package: matchID,
                Time: new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' }),
                Status: "Pending"
            }
        });

        res.json({ success: true, newBalance });
    } catch (err) {
        res.status(500).json({ error: "Transaction Failed" });
    }
});

module.exports = app;
      
