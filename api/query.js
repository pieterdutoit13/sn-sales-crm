export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Anthropic API key not configured" });

  const { question, entries } = req.body;
  if (!question || !entries) return res.status(400).json({ error: "Missing question or entries" });

  const db = entries.map(e =>
    `Date: ${e.date} | Rep: ${e.salesperson} | Surgeon: ${e.customer_name} | Hospital: ${e.organisation || "N/A"} | Topic: ${e.topic_discussed} | Followups: ${(e.key_followups || []).join("; ")} | Flags: ${(e.keywords || []).join(", ")} | Summary: ${e.summary}`
  ).join("\n---\n");

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
        messages: [{
          role: "user",
          content: `You are a helpful sales CRM assistant for Smith+Nephew Netherlands. Answer the question based ONLY on the data below. Be concise and specific. For recent interactions, list most recent first.\n\nDATA:\n${db}\n\nQUESTION: ${question}`
        }],
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || "Claude error" });
    const answer = data.content.map(b => b.text || "").join("").trim();
    return res.status(200).json({ answer });
  } catch (err) {
    return res.status(500).json({ error: "Query failed: " + err.message });
  }
}
