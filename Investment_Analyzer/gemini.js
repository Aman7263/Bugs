import express from 'express';
import fetch from 'node-fetch';
const app = express();
app.use(express.json());

app.post('/gemini-proxy', async (req, res) => {
  const prompt = req.body.prompt;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
    }
  );
  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));