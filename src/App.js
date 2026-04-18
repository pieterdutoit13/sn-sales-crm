import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import logo from "./logo.png";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "";
const ADMIN_EMAIL  = process.env.REACT_APP_ADMIN_EMAIL || "";
const supabase     = SUPABASE_URL ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const KEYWORDS = [
  "New Business Opportunity",
  "Business at Risk",
  "Follow-up Required",
  "Escalation Needed",
];

// â”€â”€ Smith+Nephew Brand Colours â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const C = {
  orange:      "#F4821F",
  orangeLight: "#FEF0E3",
  orangeDark:  "#C96A10",
  navy:        "#1A2856",
  navyLight:   "#EEF0F6",
  bg:          "#F5F6F8",
  white:       "#FFFFFF",
  border:      "#E2E5EB",
  borderDark:  "#CBD0DA",
  text:        "#1A1A2E",
  textMid:     "#4A5068",
  textMuted:   "#8A90A8",
  green:       "#0D9E6E",
  greenLight:  "#E6F7F2",
  red:         "#D93025",
  redLight:    "#FDECEA",
  yellow:      "#E07B00",
  yellowLight: "#FEF5E7",
  purple:      "#6B3FA0",
  purpleLight: "#F2ECFA",
  card:        "#FFFFFF",
  shadow:      "0 1px 4px rgba(0,0,0,0.08)",
  shadowMd:    "0 4px 16px rgba(0,0,0,0.10)",
};

const KW = {
  "New Business Opportunity": { bg: C.greenLight,  border: C.green,  text: C.green  },
  "Business at Risk":         { bg: C.redLight,    border: C.red,    text: C.red    },
  "Follow-up Required":       { bg: C.yellowLight, border: C.yellow, text: C.yellow },
  "Escalation Needed":        { bg: C.purpleLight, border: C.purple, text: C.purple },
};

// â”€â”€ Shared styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const inputSt = {
  width: "100%", background: C.white, border: `1.5px solid ${C.border}`,
  borderRadius: 8, padding: "11px 14px", color: C.text, fontSize: 14,
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  transition: "border-color 0.2s",
};
const labelSt = {
  fontSize: 11, color: C.textMuted, letterSpacing: "0.07em",
  textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600,
};
const microSt = {
  fontSize: 10, color: C.textMuted, textTransform: "uppercase",
  letterSpacing: "0.07em", marginBottom: 4, fontWeight: 600,
};
const cardSt = {
  background: C.card, border: `1px solid ${C.border}`,
  borderRadius: 12, padding: 18, boxShadow: C.shadow,
};
const btnOrange = (dis) => ({
  background: dis ? C.border : C.orange,
  color: dis ? C.textMuted : C.white,
  border: "none", borderRadius: 8, padding: "12px 0", width: "100%",
  fontWeight: 700, fontSize: 14, cursor: dis ? "not-allowed" : "pointer",
  fontFamily: "inherit", transition: "all 0.2s",
  boxShadow: dis ? "none" : "0 2px 8px rgba(244,130,31,0.3)",
});

function Badge({ label }) {
  const c = KW[label] || { bg: C.orangeLight, border: C.orange, text: C.orange };
  return (
    <span style={{
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      borderRadius: 4, padding: "3px 9px", fontSize: 11, fontWeight: 700,
      whiteSpace: "nowrap", display: "inline-block", letterSpacing: "0.02em",
    }}>{label}</span>
  );
}

function Header({ user, isAdmin, onSignOut }) {
  return (
    <div style={{
      width: "100%", background: C.white, borderBottom: `1px solid ${C.border}`,
      boxShadow: C.shadow, position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 640, margin: "0 auto", padding: "12px 20px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <img src={logo} alt="Smith+Nephew" style={{ height: 36, objectFit: "contain" }} />
        <div style={{ width: 1, height: 28, background: C.border, margin: "0 4px" }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>Sales CRM</div>
          <div style={{ fontSize: 10, color: C.textMuted }}>Netherlands</div>
        </div>
        {user && (
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{user.email?.split("@")[0]}</div>
              {isAdmin && <div style={{ fontSize: 10, color: C.orange, fontWeight: 700 }}>Manager</div>}
            </div>
            <button onClick={onSignOut} style={{
              background: C.bg, border: `1px solid ${C.border}`, color: C.textMid,
              borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
            }}>Sign out</button>
          </div>
        )}
      </div>
    </div>
  );
}

// â”€â”€ LOGIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function LoginScreen({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [mode, setMode]         = useState("login");

  async function handle() {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    if (!supabase) { setError("App not configured yet â€” see setup instructions."); return; }
    setLoading(true); setError("");
    const { data, error: err } = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (err) setError(err.message);
    else if (data?.user) onLogin(data.user);
    else if (mode === "signup") setError("Check your email to confirm your account, then sign in.");
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 380, background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 36, boxShadow: C.shadowMd }}>
        {/* Logo block */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <img src={logo} alt="Smith+Nephew" style={{ height: 52, objectFit: "contain" }} />
          <div style={{ width: 40, height: 2, background: C.orange, borderRadius: 2 }} />
          <div style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>Sales CRM â€” Netherlands</div>
          <div style={{ fontSize: 12, color: C.textMuted }}>{mode === "login" ? "Sign in to your account" : "Create your account"}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelSt}>Email address</label>
            <input style={inputSt} type="email" placeholder="name@smithnephew.com" value={email}
              onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} />
          </div>
          <div>
            <label style={labelSt}>Password</label>
            <input style={inputSt} type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" value={password}
              onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} />
          </div>

          {error && (
            <div style={{ color: C.red, fontSize: 13, background: C.redLight, padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.red}22` }}>{error}</div>
          )}

          <button onClick={handle} disabled={loading} style={btnOrange(loading)}>
            {loading ? "Signing in..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <div style={{ textAlign: "center", fontSize: 13, color: C.textMuted }}>
            {mode === "login"
              ? <><span>No account? </span><span onClick={() => { setMode("signup"); setError(""); }} style={{ color: C.orange, cursor: "pointer", fontWeight: 600 }}>Sign up</span></>
              : <><span>Have an account? </span><span onClick={() => { setMode("login"); setError(""); }} style={{ color: C.orange, cursor: "pointer", fontWeight: 600 }}>Sign in</span></>}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 24, fontSize: 11, color: C.textMuted }}>Â© Smith+Nephew Â· Confidential</div>
    </div>
  );
}

// â”€â”€ RECORD TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function RecordTab({ user, onSave }) {
  const [transcript, setTranscript] = useState("");
  const [processing, setProcessing] = useState(false);
  const [extracted, setExtracted]   = useState(null);
  const [step, setStep]             = useState("idle");
  const repName = user?.email?.split("@")[0] || "Unknown";

  async function extract() {
    if (!transcript.trim()) { alert("Please enter your call notes first."); return; }
    setProcessing(true); setStep("processing");
    try {
      const res = await fetch("/api/claude", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `You are a medical device sales CRM extractor for Smith+Nephew Netherlands.

Extract structured data from this sales call note.

Note: "${transcript}"
Date: ${new Date().toLocaleDateString("en-GB")}
Sales Rep: ${repName}

Return ONLY valid JSON:
{
  "date": "DD/MM/YYYY",
  "salesRep": "${repName}",
  "surgeonName": "surgeon or doctor name (Unknown if not mentioned)",
  "hospital": "hospital or clinic name (empty string if not mentioned)",
  "productLine": "S+N product line discussed if mentioned, else empty string",
  "topicDiscussed": "clear summary of main topic",
  "keyFollowups": ["specific action 1", "specific action 2"],
  "keywords": ["only applicable from: New Business Opportunity, Business at Risk, Follow-up Required, Escalation Needed"],
  "sentiment": "positive | neutral | negative",
  "summary": "2-3 sentence summary of the interaction"
}` }]
        })
      });
      const data = await res.json();
     const rawText = data.content.map(b => b.text || "").join("");
const jsonMatch = rawText.match(/\{[\s\S]*\}/);
if (!jsonMatch) throw new Error("No JSON found in response");
const parsed = JSON.parse(jsonMatch[0]);
if (!parsed) throw new Error("Empty response");
      const rawText = data.content.map(b => b.text || "").join("");
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      const parsed = JSON.parse(jsonMatch[0]);
      setExtracted(parsed); setStep("extracted");
    } catch (e) { alert("Extraction failed: " + e.message); setStep("idle"); }
    setProcessing(false);
  }

  async function save() {
    if (!extracted) return;
    const entry = {
      user_id:         user.id,
      salesperson:     extracted.salesRep,
      date:            extracted.date,
      customer_name:   extracted.surgeonName,
      organisation:    extracted.hospital || "",
      topic_discussed: extracted.topicDiscussed,
      key_followups:   extracted.keyFollowups || [],
      keywords:        extracted.keywords || [],
      sentiment:       extracted.sentiment || "",
      summary:         extracted.summary || "",
      product_line:    extracted.productLine || "",
    };
    if (supabase) {
      const { error } = await supabase.from("entries").insert([entry]);
      if (error) { alert("Save failed: " + error.message); return; }
    }
    onSave({ ...extracted, id: Date.now(), customerName: extracted.surgeonName, organisation: extracted.hospital, topicDiscussed: extracted.topicDiscussed, keyFollowups: extracted.keyFollowups, salesperson: extracted.salesRep });
    setExtracted(null); setTranscript(""); setStep("idle");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Rep info bar */}
      <div style={{ ...cardSt, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.orangeLight, border: `2px solid ${C.orange}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>â€¢</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{repName}</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>{user?.email}</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 11, color: C.textMuted }}>{new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</div>
      </div>

      {/* How to dictate instruction card */}
      <div style={{ background: C.navyLight, border: `1px solid ${C.navy}22`, borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10 }}>How to log a call</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["1", "Tap the notes box below"],
            ["2", "Tap the mic icon on your phone keyboard"],
            ["3", "Speak your call notes naturally"],
            ["4", "Tap the keyboard mic again to stop"],
            ["5", "Tap Extract CRM Data"],
          ].map(([n, text]) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.orange, color: C.white, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
              <div style={{ fontSize: 13, color: C.navy }}>{text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Text input */}
      <div>
        <label style={labelSt}>Call Notes</label>
        <textarea
          style={{ ...inputSt, minHeight: 140, resize: "vertical", lineHeight: 1.65, fontSize: 15 }}
          placeholder={"Tap the mic on your keyboard and speak, or type here.\n\nE.g. \"Visited Dr. Van der Berg at Amsterdam UMC today. Discussed the JOURNEY II knee system. Very interested but needs cadaver lab session. Follow up next week.\""}
          value={transcript}
          onChange={e => setTranscript(e.target.value)}
        />
        {transcript.length > 0 && (
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, textAlign: "right" }}>{transcript.length} characters</div>
        )}
      </div>

      {step !== "extracted" && (
        <button onClick={extract} disabled={processing || !transcript.trim()} style={btnOrange(processing || !transcript.trim())}>
          {processing ? "Extracting with AI..." : "Extract CRM Data"}
        </button>
      )}

      {!transcript && (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div style={{ fontSize: 11, color: C.textMuted }}>Or type your notes manually if preferred</div>
        </div>
      )}

      {step === "extracted" && extracted && (
        <div style={{ ...cardSt, display: "flex", flexDirection: "column", gap: 16, border: `1.5px solid ${C.orange}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.orange }} />
            <div style={{ color: C.orange, fontWeight: 700, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>AI Extracted Data â€” Please Review</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["Date", extracted.date], ["Sales Rep", extracted.salesRep], ["Surgeon", extracted.surgeonName], ["Hospital", extracted.hospital || "â€”"], ["Product Line", extracted.productLine || "â€”"], ["Sentiment", extracted.sentiment]].map(([k, v]) => (
              <div key={k}>
                <div style={microSt}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
            <div style={microSt}>Topic Discussed</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.65 }}>{extracted.topicDiscussed}</div>
          </div>

          {extracted.keyFollowups?.length > 0 && (
            <div>
              <div style={microSt}>Key Follow-ups</div>
              {extracted.keyFollowups.map((f, i) => (
                <div key={i} style={{ fontSize: 13, color: C.text, borderLeft: `3px solid ${C.orange}`, paddingLeft: 10, marginBottom: 5, lineHeight: 1.5 }}>â†’ {f}</div>
              ))}
            </div>
          )}

          {extracted.keywords?.length > 0 && (
            <div>
              <div style={microSt}>Flags Detected</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {extracted.keywords.map(k => <Badge key={k} label={k} />)}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button onClick={save} style={{ flex: 1, background: C.orange, color: C.white, border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 8px rgba(244,130,31,0.3)" }}>
              Save to Database
            </button>
            <button onClick={() => setStep("idle")} style={{ flex: 1, background: C.bg, color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 0", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              âœ• Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€ DATABASE TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function DatabaseTab({ entries, onDelete, isAdmin, onExport }) {
  const [filter, setFilter]       = useState("");
  const [kwFilter, setKwFilter]   = useState("");
  const [repFilter, setRepFilter] = useState("");
  const reps = [...new Set(entries.map(e => e.salesperson).filter(Boolean))];
  const iSt  = { background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 12, outline: "none", fontFamily: "inherit" };

  const filtered = entries.filter(e => {
    const s  = filter.toLowerCase();
    const mt = !filter || [e.customerName || e.customer_name, e.salesperson, e.topicDiscussed || e.topic_discussed, e.organisation].some(f => f?.toLowerCase().includes(s));
    const mk = !kwFilter  || e.keywords?.includes(kwFilter);
    const mr = !repFilter || e.salesperson === repFilter;
    return mt && mk && mr;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input style={{ ...iSt, flex: 1, minWidth: 120 }} placeholder="Search surgeon, hospital, topic..." value={filter} onChange={e => setFilter(e.target.value)} />
        <select style={{ ...iSt, minWidth: 110 }} value={kwFilter} onChange={e => setKwFilter(e.target.value)}>
          <option value="">All Flags</option>
          {KEYWORDS.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        {isAdmin && reps.length > 0 && (
          <select style={{ ...iSt, minWidth: 110 }} value={repFilter} onChange={e => setRepFilter(e.target.value)}>
            <option value="">All Reps</option>
            {reps.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        )}
        <button onClick={onExport} style={{ background: C.navy, color: C.white, border: "none", borderRadius: 8, padding: "9px 16px", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>Export CSV</button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: C.textMuted, padding: "48px 0", fontSize: 14 }}>
          {entries.length === 0 ? "No entries yet â€” record your first call!" : "No results match your filter."}
        </div>
      ) : filtered.map(e => {
        const customer  = e.customerName || e.customer_name;
        const topic     = e.topicDiscussed || e.topic_discussed;
        const followups = e.keyFollowups || e.key_followups || [];
        return (
          <div key={e.id} style={{ ...cardSt }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{customer}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                  {e.organisation && `${e.organisation}  Â·  `}{e.salesperson}  Â·  {e.date}
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "flex-start" }}>
                {(e.keywords || []).map(k => <Badge key={k} label={k} />)}
                {isAdmin && (
                  <button onClick={() => onDelete(e.id)} style={{ background: C.redLight, border: `1px solid ${C.red}`, color: C.red, borderRadius: 4, padding: "3px 9px", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>âœ•</button>
                )}
              </div>
            </div>
            <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.65, marginBottom: followups.length ? 10 : 0 }}>{e.summary}</div>
            {followups.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                {followups.map((f, i) => (
                  <div key={i} style={{ fontSize: 12, color: C.yellow, borderLeft: `3px solid ${C.yellow}`, paddingLeft: 8, fontWeight: 500 }}>â†’ {f}</div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// â”€â”€ MANAGER DASHBOARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ManagerDashboard({ entries }) {
  const reps     = [...new Set(entries.map(e => e.salesperson).filter(Boolean))];
  const kwCounts = KEYWORDS.map(k => ({ label: k, count: entries.filter(e => e.keywords?.includes(k)).length }));

  const stat = (label, value, color, bg) => (
    <div style={{ background: bg, border: `1px solid ${color}22`, borderRadius: 12, padding: "18px 14px", textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 30, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3, fontWeight: 600 }}>{label}</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 4, height: 20, background: C.orange, borderRadius: 2 }} />
        <div style={{ fontWeight: 800, fontSize: 15, color: C.navy }}>Manager Dashboard</div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        {stat("Total Calls", entries.length, C.orange, C.orangeLight)}
        {stat("Active Reps", reps.length, C.navy, C.navyLight)}
        {stat("At Risk", entries.filter(e => e.keywords?.includes("Business at Risk")).length, C.red, C.redLight)}
      </div>

      {/* Flag breakdown */}
      <div style={cardSt}>
        <div style={{ fontSize: 12, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, marginBottom: 16 }}>Flag Overview</div>
        {kwCounts.map(({ label, count }) => {
          const c   = KW[label];
          const pct = entries.length ? Math.round(count / entries.length * 100) : 0;
          return (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: c.text, fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 12, color: C.textMuted }}>{count} {count === 1 ? "entry" : "entries"}</span>
              </div>
              <div style={{ background: C.bg, borderRadius: 6, height: 6, border: `1px solid ${C.border}` }}>
                <div style={{ width: `${pct}%`, background: c.border, borderRadius: 6, height: "100%", transition: "width 0.6s" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Rep table */}
      <div style={cardSt}>
        <div style={{ fontSize: 12, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, marginBottom: 16 }}>Rep Performance</div>
        {reps.length === 0 ? (
          <div style={{ color: C.textMuted, fontSize: 13 }}>No reps have logged calls yet.</div>
        ) : reps.map(rep => {
          const re   = entries.filter(e => e.salesperson === rep);
          const risk = re.filter(e => e.keywords?.includes("Business at Risk")).length;
          const opp  = re.filter(e => e.keywords?.includes("New Business Opportunity")).length;
          const fu   = re.filter(e => e.keywords?.includes("Follow-up Required")).length;
          const esc  = re.filter(e => e.keywords?.includes("Escalation Needed")).length;
          return (
            <div key={rep} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{rep}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{re.length} {re.length === 1 ? "call logged" : "calls logged"}</div>
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {opp  > 0 && <span style={{ fontSize: 11, background: C.greenLight,  border: `1px solid ${C.green}`,  color: C.green,  borderRadius: 4, padding: "2px 7px", fontWeight: 700 }}>+{opp} opp</span>}
                {risk > 0 && <span style={{ fontSize: 11, background: C.redLight,    border: `1px solid ${C.red}`,    color: C.red,    borderRadius: 4, padding: "2px 7px", fontWeight: 700 }}>{risk} risk</span>}
                {fu   > 0 && <span style={{ fontSize: 11, background: C.yellowLight, border: `1px solid ${C.yellow}`, color: C.yellow, borderRadius: 4, padding: "2px 7px", fontWeight: 700 }}>{fu} f/u</span>}
                {esc  > 0 && <span style={{ fontSize: 11, background: C.purpleLight, border: `1px solid ${C.purple}`, color: C.purple, borderRadius: 4, padding: "2px 7px", fontWeight: 700 }}>{esc} esc</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// â”€â”€ QUERY TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function QueryTab({ entries }) {
  const [query, setQuery]     = useState("");
  const [answer, setAnswer]   = useState("");
  const [loading, setLoading] = useState(false);

  async function ask() {
    if (!query.trim()) return;
    if (entries.length === 0) { setAnswer("No entries yet â€” log some calls first!"); return; }
    setLoading(true); setAnswer("");
    const db = entries.map(e =>
      `Date:${e.date}|Rep:${e.salesperson}|Surgeon:${e.customerName || e.customer_name}|Hospital:${e.organisation || ""}|Topic:${e.topicDiscussed || e.topic_discussed}|Followups:${(e.keyFollowups || e.key_followups || []).join("; ")}|Flags:${(e.keywords || []).join(", ")}|Summary:${e.summary}`
    ).join("\n");
    try {
      const res  = await fetch("/api/claude", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `You are a sales CRM assistant for Smith+Nephew Netherlands. Answer questions based ONLY on the data below. Be concise and specific. For recent interactions, order most recent first.\n\nDATA:\n${db}\n\nQuestion: ${query}` }]
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnswer(data.content.map(b => b.text || "").join(""));
    } catch { setAnswer("Query failed. Please try again."); }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input style={{ ...inputSt, flex: 1 }} placeholder="e.g. What were the last 2 visits with Surgeon van der Berg?"
          value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && ask()} />
        <button onClick={ask} disabled={loading} style={{
          background: C.navy, color: C.white, border: "none", borderRadius: 8,
          padding: "11px 20px", fontWeight: 700, fontSize: 14,
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, whiteSpace: "nowrap",
        }}>{loading ? "..." : "Ask AI"}</button>
      </div>

      <div style={cardSt}>
        <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, marginBottom: 10 }}>Example queries â€” tap to use</div>
        {[
          "What were the last 2 discussions with Surgeon [name]?",
          "Which accounts are flagged as Business at Risk?",
          "What follow-ups are outstanding for [rep name]?",
          "Show all New Business Opportunities this month",
          "Which surgeons haven't been visited recently?",
          "What product lines came up most in discussions?",
        ].map(s => (
          <div key={s} onClick={() => setQuery(s)} style={{
            fontSize: 12, color: C.orange, cursor: "pointer", padding: "7px 10px",
            background: C.orangeLight, borderRadius: 6, marginBottom: 6,
            border: `1px solid ${C.orange}33`, fontWeight: 500,
          }}>{s}</div>
        ))}
      </div>

      {answer && (
        <div style={{ ...cardSt, border: `1.5px solid ${C.navy}22` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <img src={logo} alt="" style={{ height: 20, objectFit: "contain" }} />
            <div style={{ fontSize: 11, color: C.navy, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>AI Answer</div>
          </div>
          <div style={{ fontSize: 14, color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{answer}</div>
        </div>
      )}
    </div>
  );
}

// â”€â”€ MAIN APP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function App() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [tab, setTab]         = useState("record");
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) { setUser(data.session.user); fetchEntries(); }
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchEntries(); else setEntries([]);
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  async function fetchEntries() {
    if (!supabase) return;
    const { data } = await supabase.from("entries").select("*").order("created_at", { ascending: false });
    if (data) setEntries(data.map(e => ({ ...e, customerName: e.customer_name, topicDiscussed: e.topic_discussed, keyFollowups: e.key_followups })));
  }

  async function deleteEntry(id) {
    if (!window.confirm("Delete this entry?")) return;
    if (supabase) await supabase.from("entries").delete().eq("id", id);
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  function handleSave(entry) { setEntries(prev => [entry, ...prev]); fetchEntries(); setTab("database"); }

  function exportCSV() {
    const headers = ["Date", "Sales Rep", "Surgeon", "Hospital", "Topic", "Follow-ups", "Flags", "Sentiment", "Summary"];
    const rows    = entries.map(e => [
      e.date, e.salesperson, e.customerName || e.customer_name, e.organisation,
      e.topicDiscussed || e.topic_discussed,
      (e.keyFollowups || e.key_followups || []).join("; "),
      (e.keywords || []).join("; "), e.sentiment, e.summary
    ].map(v => `"${String(v || "").replace(/"/g, '""')}"`));
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const a   = document.createElement("a");
    a.href    = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `SN_Sales_CRM_${new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}.csv`;
    a.click();
  }

  async function signOut() { if (supabase) await supabase.auth.signOut(); setUser(null); setEntries([]); }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <img src={logo} alt="Smith+Nephew" style={{ height: 48, objectFit: "contain" }} />
      <div style={{ fontSize: 13, color: C.textMuted, fontFamily: "Inter, sans-serif" }}>Loading...</div>
    </div>
  );

  if (!user) return <LoginScreen onLogin={u => { setUser(u); fetchEntries(); }} />;

  const TABS = [
    { id: "record",   label: "Record" },
    { id: "database", label: `Calls${entries.length > 0 ? ` (${entries.length})` : ""}` },
    { id: "query",    label: "Query" },
    ...(isAdmin ? [{ id: "manager", label: "Manager" }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <Header user={user} isAdmin={isAdmin} onSignOut={signOut} />

      {/* Tabs */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px", display: "flex", gap: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "13px 4px", border: "none",
              borderBottom: tab === t.id ? `3px solid ${C.orange}` : "3px solid transparent",
              background: "transparent",
              color: tab === t.id ? C.orange : C.textMuted,
              fontWeight: tab === t.id ? 700 : 500,
              fontSize: 12, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: 20 }}>
        {tab === "record"  && <RecordTab user={user} onSave={handleSave} />}
        {tab === "database" && <DatabaseTab entries={entries} onDelete={deleteEntry} isAdmin={isAdmin} onExport={exportCSV} />}
        {tab === "query"   && <QueryTab entries={entries} />}
        {tab === "manager" && isAdmin && <ManagerDashboard entries={entries} />}
      </div>

      <div style={{ textAlign: "center", padding: "24px 0 32px", fontSize: 11, color: C.textMuted }}>
        Smith+Nephew Netherlands Â· Sales CRM Â· Confidential
      </div>
    </div>
  );
}
