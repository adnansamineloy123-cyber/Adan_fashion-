const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SHEETDB_URL = "https://sheetdb.io/api/v1/goe1q7f0ma6g5";

// লগইন এপিআই
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
            res.status(401).json({ success: false, message: "ID বা PIN ভুল!" });
        }
    } catch (e) { res.status(500).json({ success: false, message: "সার্ভার এরর!" }); }
});

// হোম পেজের জন্য ইউজার ডাটা এপিআই
app.get('/auth/user-data', async (req, res) => {
    try {
        const token = req.query.id;
        if (!token) return res.status(400).json({ success: false });
        const userId = Buffer.from(token, 'base64').toString('ascii');
        const response = await axios.get(`${SHEETDB_URL}/search?Game_ID=${userId}`);
        if (response.data[0]) {
            res.json({ success: true, name: response.data[0].Name, coins: response.data[0].Coins });
        } else { res.status(404).json({ success: false }); }
    } catch (e) { res.status(500).json({ success: false }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running!`));
module.exports = app;
