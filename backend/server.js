const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/cve", async (req, res) => {
  const product = req.query.product?.toLowerCase();
  if (!product) return res.status(400).json({ error: "Product required" });
  try {
    const response = await axios.get(`https://cve.circl.lu/api/search/${product}`);
    const data = response.data.slice(0, 10).map((item) => ({
      id: item.id,
      description: item.summary,
      severity: item.cvss || "-",
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Errore nella ricerca CVE" });
  }
});

app.post("/api/chatgpt", async (req, res) => {
  const { cveId, description } = req.body;
  if (!cveId || !description) return res.status(400).json({ error: "Missing fields" });
  const prompt = `Spiega in modo semplice la vulnerabilità ${cveId} descritta come: '${description}'. Fornisci best practices e un piano di remediation.`;
  try {
    const gptRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    const reply = gptRes.data.choices[0].message.content;
    res.json({ response: reply });
  } catch (err) {
    res.status(500).json({ error: "Errore con OpenAI API" });
  }
});

app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));
