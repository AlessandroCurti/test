import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [product, setProduct] = useState("");
  const [cves, setCves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responseMap, setResponseMap] = useState({});

  const searchCVEs = async () => {
    setLoading(true);
    const res = await axios.get(`/api/cve?product=${product}`);
    setCves(res.data);
    setLoading(false);
  };

  const askChatGPT = async (cveId, description) => {
    const res = await axios.post("/api/chatgpt", {
      cveId,
      description,
    });
    setResponseMap((prev) => ({ ...prev, [cveId]: res.data.response }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">CVE Search & Remediation</h1>
      <div className="flex mb-4">
        <input
          type="text"
          className="border p-2 flex-grow mr-2"
          placeholder="Nome prodotto (es. apache, office...)"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />
        <button onClick={searchCVEs} className="bg-blue-500 text-white px-4 py-2 rounded">
          Cerca
        </button>
      </div>

      {loading && <p>Caricamento CVE...</p>}

      {cves.map((cve) => (
        <div key={cve.id} className="border p-4 mb-4 rounded shadow">
          <h2 className="font-semibold text-lg">{cve.id}</h2>
          <p>{cve.description}</p>
          <p className="text-sm text-gray-500">Gravità: {cve.severity}</p>
          <button
            onClick={() => askChatGPT(cve.id, cve.description)}
            className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
          >
            Chiedi a ChatGPT
          </button>
          {responseMap[cve.id] && (
            <div className="mt-2 bg-gray-100 p-2 rounded">
              <pre className="whitespace-pre-wrap">{responseMap[cve.id]}</pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
