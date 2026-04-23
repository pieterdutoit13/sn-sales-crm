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

  // Calculate today and helper dates for AI context
  const today = new Date();
  const todayStr = today.toLocaleDateString("en-GB");

  const prompt = `You are a medical device sales CRM extractor for Smith+Nephew Netherlands.

Extract structured data from this sales call note and return ONLY a valid JSON object.

Note: "${transcript}"
Date of call: ${date}
Today's date: ${todayStr}
Sales Rep: ${repName}

Return ONLY this JSON structure with no extra text, no markdown, no code blocks:
{
  "date": "${date}",
  "salesRep": "${repName}",
  "surgeonName": "surgeon or doctor full name, or Unknown",
  "hospital": "hospital or clinic name, or empty string",
  "productLine": "S+N product discussed e.g. JOURNEY II, OXINIUM, ALLEVYN, CORI, or empty string",
  "topicDiscussed": "one clear sentence summary of what was discussed",
  "keyFollowups": [
    {
      "action": "specific follow-up action description",
      "dueDate": "DD/MM/YYYY - calculate from call date based on any time mentioned e.g. 'in 2 weeks' or 'next Monday'. If no time mentioned use 14 days from call date as default"
    }
  ],
  "keywords": [],
  "sentiment": "positive",
  "summary": "2-3 sentence summary of the full interaction"
}

For keywords array, include ONLY items that apply from this exact list:
- New Business Opportunity
- Business at Risk
- Follow-up Required
- Escalation Needed

For sentiment use only: positive, neutral, or negative

IMPORTANT: keyFollowups must always be an array of objects with "action" and "dueDate" fields, never plain strings.`;

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

    // Normalise keyFollowups â€” handle both old string format and new object format
    if (parsed.keyFollowups && Array.isArray(parsed.keyFollowups)) {
      parsed.keyFollowups = parsed.keyFollowups.map(f => {
        if (typeof f === "string") {
          // Old format â€” convert to object with default due date 14 days from now
          const due = new Date(today);
          due.setDate(due.getDate() + 14);
          return { action: f, dueDate: due.toLocaleDateString("en-GB") };
        }
        return f;
      });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Extraction failed: " + err.message });
  }
}
