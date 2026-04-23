export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Anthropic API key not configured" });

  const { transcript, repName, date } = req.body;
  if (!transcript) return res.status(400).json({ error: "No transcript provided" });

  const prompt = `You are a medical device sales CRM extractor for Smith+Nephew Netherlands.

Extract structured data from this sales call note and return ONLY a valid JSON object.

Note: "${transcript}"
Date: ${date}
Sales Rep: ${repName}

Return ONLY this JSON structure with no extra text, no markdown, no code blocks:
{
  "date": "${date}",
  "salesRep": "${repName}",
  "surgeonName": "surgeon or doctor full name, or Unknown",
  "hospital": "hospital or clinic name, or empty string",
  "productLine": "S+N product discussed e.g. JOURNEY II, OXINIUM, ALLEVYN, or empty string",
  "topicDiscussed": "one clear sentence summary of what was discussed",
  "keyFollowups": ["concrete followup action 1", "concrete followup action 2"],
  "keywords": [],
  "sentiment": "positive",
  "summary": "2-3 sentence summary of the full interaction"
}

For keywords array, include ONLY items that apply from this exact list:
- New Business Opportunity
- Business at Risk
- Follow-up Required
- Escalation Needed

For sentiment use only: positive, neutral, or negative`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || "Claude error" });

    const text = data.content.map(b => b.text || "").join("").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return res.status(500).json({ error: "Could not parse AI response" });
      parsed = JSON.parse(match[0]);
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Extraction failed: " + err.message });
  }
}
