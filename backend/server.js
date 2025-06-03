const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Route: Cerca CVE da prodotto usando NVD API
app.get("/api/cve", async (req, res) => {
  const product = req.query.product?.toLowerCase();
  if (!product) return res.status(400).json({ error: "Product required" });
  try {
    const response = await axios.get(
      `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${product}&resultsPerPage=10`
    );

    const data = response.data.vulnerabilities.map((item) => {
      const cve = item.cve;
      return {
        id: cve.id,
        description: cve.descriptions[0]?.value || "Nessuna descrizione",
        severity:
          cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity ||
          cve.metrics?.cvssMetricV2?.[0]?.baseSeverity ||
          "-",
      };
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Errore nella ricerca CVE" });
  }
});

// Route: Chiedi a ChatGPT
app.post("/api/chatgpt", async (req, res) => {
  const { cveId, description } = req.body;
  if (!cveId || !description)
    return res.status(400).json({ error: "Missing fields" });

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

app.listen(PORT, () =>
  console.log(`Server avviato sulla porta ${PORT}`)
);
