import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import logo from "./logo.png";

const SUPABASE_URL  = process.env.REACT_APP_SUPABASE_URL  || "";
const SUPABASE_KEY  = process.env.REACT_APP_SUPABASE_ANON_KEY || "";
const ADMIN_EMAIL   = process.env.REACT_APP_ADMIN_EMAIL || "";
const supabase      = SUPABASE_URL ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const KEYWORDS = ["New Business Opportunity","Business at Risk","Follow-up Required","Escalation Needed"];

const C = {
  orange:"#F4821F", orangeLight:"#FEF0E3", orangeDark:"#C96A10",
  navy:"#1A2856", navyLight:"#EEF0F6",
  bg:"#F5F6F8", white:"#FFFFFF",
  border:"#E2E5EB", text:"#1A1A2E", textMid:"#4A5068", textMuted:"#8A90A8",
  green:"#0D9E6E", greenLight:"#E6F7F2",
  red:"#D93025", redLight:"#FDECEA",
  yellow:"#E07B00", yellowLight:"#FEF5E7",
  purple:"#6B3FA0", purpleLight:"#F2ECFA",
  shadow:"0 1px 4px rgba(0,0,0,0.08)", shadowMd:"0 4px 16px rgba(0,0,0,0.10)",
};

const KW = {
  "New Business Opportunity":{ bg:C.greenLight,  border:C.green,  text:C.green  },
  "Business at Risk":        { bg:C.redLight,    border:C.red,    text:C.red    },
  "Follow-up Required":      { bg:C.yellowLight, border:C.yellow, text:C.yellow },
  "Escalation Needed":       { bg:C.purpleLight, border:C.purple, text:C.purple },
};

const iSt = { width:"100%", background:C.white, border:`1.5px solid ${C.border}`, borderRadius:8, padding:"11px 14px", color:C.text, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" };
const lSt = { fontSize:11, color:C.textMuted, letterSpacing:"0.07em", textTransform:"uppercase", display:"block", marginBottom:6, fontWeight:600 };
const mSt = { fontSize:10, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4, fontWeight:600 };
const cSt = { background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:18, boxShadow:C.shadow };
const bOrange = (dis) => ({ background:dis?C.border:C.orange, color:dis?C.textMuted:C.white, border:"none", borderRadius:8, padding:"13px 0", width:"100%", fontWeight:700, fontSize:15, cursor:dis?"not-allowed":"pointer", fontFamily:"inherit", transition:"all 0.2s", boxShadow:dis?"none":"0 2px 8px rgba(244,130,31,0.3)" });

function Badge({ label }) {
  const c = KW[label]||{ bg:C.orangeLight, border:C.orange, text:C.orange };
  return <span style={{ background:c.bg, border:`1px solid ${c.border}`, color:c.text, borderRadius:4, padding:"3px 9px", fontSize:11, fontWeight:700, whiteSpace:"nowrap", display:"inline-block" }}>{label}</span>;
}

// â”€â”€ LOGIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function LoginScreen({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [mode, setMode]         = useState("login");

  async function handle() {
    if (!email||!password) { setError("Please enter your email and password."); return; }
    if (!supabase) { setError("App not configured - check environment variables."); return; }
    setLoading(true); setError("");
    const { data, error:err } = mode==="login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (err) setError(err.message);
    else if (data?.user) onLogin(data.user);
    else if (mode==="signup") setError("Account created! You can now sign in.");
    setLoading(false);
  }

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:380, background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:36, boxShadow:C.shadowMd }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, marginBottom:28 }}>
          <img src={logo} alt="Smith+Nephew" style={{ height:56, objectFit:"contain" }} />
          <div style={{ width:40, height:3, background:C.orange, borderRadius:2 }} />
          <div style={{ fontWeight:700, fontSize:16, color:C.navy }}>Sales CRM - Netherlands</div>
          <div style={{ fontSize:12, color:C.textMuted }}>{mode==="login"?"Sign in to continue":"Create your account"}</div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div><label style={lSt}>Email</label><input style={iSt} type="email" placeholder="name@smithnephew.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} /></div>
          <div><label style={lSt}>Password</label><input style={iSt} type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} /></div>
          {error && <div style={{ color:C.red, fontSize:13, background:C.redLight, padding:"10px 14px", borderRadius:8 }}>{error}</div>}
          <button onClick={handle} disabled={loading} style={bOrange(loading)}>{loading?"Please wait...":mode==="login"?"Sign In":"Create Account"}</button>
          <div style={{ textAlign:"center", fontSize:13, color:C.textMuted }}>
            {mode==="login"
              ? <><span>No account? </span><span onClick={()=>{setMode("signup");setError("");}} style={{ color:C.orange, cursor:"pointer", fontWeight:600 }}>Sign up</span></>
              : <><span>Have an account? </span><span onClick={()=>{setMode("login");setError("");}} style={{ color:C.orange, cursor:"pointer", fontWeight:600 }}>Sign in</span></>}
          </div>
        </div>
      </div>
      <div style={{ marginTop:20, fontSize:11, color:C.textMuted }}>Smith+Nephew - Confidential</div>
    </div>
  );
}

// â”€â”€ RECORD TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function RecordTab({ user, onSave }) {
  const [recState, setRecState]     = useState("idle"); // idle | recording | processing | extracted
  const [transcript, setTranscript] = useState("");
  const [extracted, setExtracted]   = useState(null);
  const [seconds, setSeconds]       = useState(0);
  const [statusMsg, setStatusMsg]   = useState("");
  const [error, setError]           = useState("");
  const mediaRef  = useRef(null);
  const chunksRef = useRef([]);
  const timerRef  = useRef(null);
  const repName   = user?.email?.split("@")[0] || "Unknown";

  useEffect(() => {
    if (recState==="recording") {
      setSeconds(0);
      timerRef.current = setInterval(()=>setSeconds(s=>s+1),1000);
    } else {
      clearInterval(timerRef.current);
    }
    return ()=>clearInterval(timerRef.current);
  },[recState]);

  const fmt = s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  async function startRecording() {
    setError(""); setTranscript(""); setExtracted(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      const mime = ["audio/webm;codecs=opus","audio/webm","audio/mp4","audio/ogg",""].find(m=>m===""||MediaRecorder.isTypeSupported(m));
      const mr   = new MediaRecorder(stream, mime?{mimeType:mime}:undefined);
      mediaRef.current = mr; chunksRef.current = [];
      mr.ondataavailable = e=>{ if(e.data.size>0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t=>t.stop());
        const blob = new Blob(chunksRef.current, { type: mime||"audio/webm" });
        await transcribeAndExtract(blob);
      };
      mr.start(500);
      setRecState("recording");
    } catch(err) {
      setError("Microphone access denied. Please allow microphone access in your browser settings and try again.");
    }
  }

  function stopRecording() {
    if (mediaRef.current && recState==="recording") {
      mediaRef.current.stop();
      setRecState("processing");
      setStatusMsg("Transcribing your voice note...");
    }
  }

  async function transcribeAndExtract(blob) {
    try {
      // Step 1: Transcribe with Whisper
      setStatusMsg("Transcribing with AI...");
      const formData = new FormData();
      formData.append("file", blob, "recording.webm");
      formData.append("model", "whisper-1");
      formData.append("language", "en");

      const tRes = await fetch("/api/transcribe", { method:"POST", body:formData });
      const tData = await tRes.json();
      if (!tRes.ok || tData.error) throw new Error(tData.error || "Transcription failed");
      if (!tData.text || tData.text.trim()==="") throw new Error("No speech detected. Please try again and speak clearly.");

      const text = tData.text.trim();
      setTranscript(text);
      setStatusMsg("Extracting CRM data...");

      // Step 2: Extract with Claude
      await extractFromText(text);
    } catch(err) {
      setError(err.message);
      setRecState("idle");
      setStatusMsg("");
    }
  }

  async function extractFromText(text) {
    try {
      setStatusMsg("Extracting CRM data with AI...");
      const eRes = await fetch("/api/extract", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ transcript:text, repName, date:new Date().toLocaleDateString("en-GB") })
      });
      const eData = await eRes.json();
      if (!eRes.ok || eData.error) throw new Error(eData.error || "Extraction failed");
      setExtracted(eData);
      setRecState("extracted");
      setStatusMsg("");
    } catch(err) {
      setError(err.message);
      setRecState("idle");
      setStatusMsg("");
    }
  }

  async function handleExtractText() {
    if (!transcript.trim()) return;
    setError("");
    setRecState("processing");
    await extractFromText(transcript.trim());
  }

  async function save() {
    if (!extracted) return;
    const entry = {
      user_id:         user.id,
      salesperson:     extracted.salesRep || repName,
      date:            extracted.date || new Date().toLocaleDateString("en-GB"),
      customer_name:   extracted.surgeonName || "Unknown",
      organisation:    extracted.hospital || "",
      topic_discussed: extracted.topicDiscussed || "",
      key_followups:   extracted.keyFollowups || [],
      keywords:        extracted.keywords || [],
      sentiment:       extracted.sentiment || "neutral",
      summary:         extracted.summary || "",
      product_line:    extracted.productLine || "",
      transcript:      transcript || "",
    };
    if (supabase) {
      const { error:err } = await supabase.from("entries").insert([entry]);
      if (err) { setError("Save failed: "+err.message); return; }
    }
    onSave(entry);
    setExtracted(null); setTranscript(""); setRecState("idle"); setError("");
  }

  function reset() { setExtracted(null); setTranscript(""); setRecState("idle"); setError(""); setStatusMsg(""); }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* Rep bar */}
      <div style={{ ...cSt, display:"flex", alignItems:"center", gap:12, padding:"12px 16px" }}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:C.orangeLight, border:`2px solid ${C.orange}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:C.orange, fontSize:14, flexShrink:0 }}>
          {repName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{repName}</div>
          <div style={{ fontSize:11, color:C.textMuted }}>{user?.email}</div>
        </div>
        <div style={{ marginLeft:"auto", fontSize:11, color:C.textMuted, fontWeight:500 }}>
          {new Date().toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}
        </div>
      </div>

      {/* Error */}
      {error && <div style={{ background:C.redLight, border:`1px solid ${C.red}`, borderRadius:8, padding:"12px 14px", color:C.red, fontSize:13 }}>{error}</div>}

      {/* Recording UI */}
      {recState !== "extracted" && (
        <div style={{ ...cSt, display:"flex", flexDirection:"column", alignItems:"center", gap:16, padding:28 }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.navy, textAlign:"center" }}>
            {recState==="idle"       && "Tap the button and speak your call notes"}
            {recState==="recording"  && "Recording - tap Stop when finished"}
            {recState==="processing" && statusMsg}
          </div>

          {/* Big record button */}
          {recState==="idle" && (
            <div onClick={startRecording} style={{ width:90, height:90, borderRadius:"50%", background:C.orange, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 6px 24px rgba(244,130,31,0.4)", transition:"all 0.2s", gap:4 }}>
              <div style={{ fontSize:28, color:C.white }}>&#9679;</div>
              <div style={{ fontSize:11, color:C.white, fontWeight:800, letterSpacing:2 }}>RECORD</div>
            </div>
          )}

          {/* Recording state */}
          {recState==="recording" && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
              <div style={{ width:90, height:90, borderRadius:"50%", background:C.red, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 0 0 12px rgba(217,48,37,0.15), 0 0 0 24px rgba(217,48,37,0.07)", animation:"pulse 1.5s infinite" }}
                onClick={stopRecording}>
                <div style={{ width:28, height:28, background:C.white, borderRadius:4 }} />
              </div>
              <div style={{ fontSize:22, fontWeight:800, color:C.red, letterSpacing:2 }}>{fmt(seconds)}</div>
              <div style={{ fontSize:12, color:C.textMuted }}>Tap the square to stop</div>
            </div>
          )}

          {/* Processing state */}
          {recState==="processing" && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
              <div style={{ width:60, height:60, borderRadius:"50%", border:`4px solid ${C.border}`, borderTop:`4px solid ${C.orange}`, animation:"spin 1s linear infinite" }} />
              <div style={{ fontSize:12, color:C.textMuted }}>{statusMsg}</div>
            </div>
          )}

          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes pulse { 0%,100% { box-shadow: 0 0 0 12px rgba(217,48,37,0.15), 0 0 0 24px rgba(217,48,37,0.07); } 50% { box-shadow: 0 0 0 18px rgba(217,48,37,0.1), 0 0 0 32px rgba(217,48,37,0.04); } }
          `}</style>
        </div>
      )}

      {/* Transcript box - shown after recording or for manual entry */}
      {recState !== "processing" && recState !== "recording" && (
        <div>
          <label style={lSt}>
            {transcript ? "Transcription (edit if needed)" : "Or type your notes manually"}
          </label>
          <textarea
            style={{ ...iSt, minHeight:120, resize:"vertical", lineHeight:1.65 }}
            placeholder={"Type your call notes here if you prefer not to use voice.\n\nE.g. Visited Dr. Van der Berg at Amsterdam UMC. Discussed JOURNEY II knee system. Very interested, needs cadaver lab. Follow up next week."}
            value={transcript}
            onChange={e=>setTranscript(e.target.value)}
          />
          {transcript && recState==="idle" && (
            <button onClick={handleExtractText} disabled={!transcript.trim()} style={{ ...bOrange(!transcript.trim()), marginTop:10 }}>
              Extract CRM Data
            </button>
          )}
        </div>
      )}

      {/* Extracted data */}
      {recState==="extracted" && extracted && (
        <div style={{ ...cSt, border:`2px solid ${C.orange}`, display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:C.orange }} />
            <div style={{ color:C.orange, fontWeight:700, fontSize:12, textTransform:"uppercase", letterSpacing:"0.06em" }}>AI Extracted Data - Please Review</div>
          </div>

          {/* Transcript preview */}
          {transcript && (
            <div style={{ background:C.bg, borderRadius:8, padding:"10px 12px" }}>
              <div style={mSt}>Transcription</div>
              <div style={{ fontSize:12, color:C.textMid, lineHeight:1.6, fontStyle:"italic" }}>"{transcript}"</div>
            </div>
          )}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
            {[["Date",extracted.date],["Sales Rep",extracted.salesRep],["Surgeon",extracted.surgeonName],["Hospital",extracted.hospital||"-"],["Product",extracted.productLine||"-"],["Sentiment",extracted.sentiment]].map(([k,v])=>(
              <div key={k}><div style={mSt}>{k}</div><div style={{ fontSize:13, fontWeight:600, color:C.text }}>{v}</div></div>
            ))}
          </div>

          <div><div style={mSt}>Topic Discussed</div><div style={{ fontSize:13, color:C.text, lineHeight:1.65 }}>{extracted.topicDiscussed}</div></div>

          {extracted.keyFollowups?.length>0 && (
            <div>
              <div style={mSt}>Key Follow-ups</div>
              {extracted.keyFollowups.map((f,i)=>(
                <div key={i} style={{ fontSize:13, color:C.text, borderLeft:`3px solid ${C.orange}`, paddingLeft:10, marginBottom:5, lineHeight:1.5 }}>>> {f}</div>
              ))}
            </div>
          )}

          {extracted.keywords?.length>0 && (
            <div>
              <div style={mSt}>Flags</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:4 }}>
                {extracted.keywords.map(k=><Badge key={k} label={k}/>)}
              </div>
            </div>
          )}

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={save} style={{ flex:1, background:C.orange, color:C.white, border:"none", borderRadius:8, padding:"13px 0", fontWeight:700, fontSize:15, cursor:"pointer", boxShadow:"0 2px 8px rgba(244,130,31,0.3)" }}>
              Save to Database
            </button>
            <button onClick={reset} style={{ flex:1, background:C.bg, color:C.textMuted, border:`1px solid ${C.border}`, borderRadius:8, padding:"13px 0", fontWeight:600, fontSize:14, cursor:"pointer" }}>
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€ DATABASE TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function DatabaseTab({ entries, onDelete, isAdmin, onExport }) {
  const [filter, setFilter]       = useState("");
  const [kwFilter, setKwFilter]   = useState("");
  const [repFilter, setRepFilter] = useState("");
  const [expanded, setExpanded]   = useState(null);
  const reps = [...new Set(entries.map(e=>e.salesperson).filter(Boolean))];
  const fSt  = { background:C.white, border:`1.5px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:12, outline:"none", fontFamily:"inherit" };

  const filtered = entries.filter(e=>{
    const s=filter.toLowerCase();
    const mt=!filter||[e.customer_name,e.salesperson,e.topic_discussed,e.organisation].some(f=>f?.toLowerCase().includes(s));
    const mk=!kwFilter||e.keywords?.includes(kwFilter);
    const mr=!repFilter||e.salesperson===repFilter;
    return mt&&mk&&mr;
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <input style={{ ...fSt, flex:1, minWidth:120 }} placeholder="Search surgeon, hospital..." value={filter} onChange={e=>setFilter(e.target.value)}/>
        <select style={{ ...fSt, minWidth:110 }} value={kwFilter} onChange={e=>setKwFilter(e.target.value)}>
          <option value="">All Flags</option>
          {KEYWORDS.map(k=><option key={k} value={k}>{k}</option>)}
        </select>
        {isAdmin && reps.length>0 && (
          <select style={{ ...fSt, minWidth:110 }} value={repFilter} onChange={e=>setRepFilter(e.target.value)}>
            <option value="">All Reps</option>
            {reps.map(r=><option key={r} value={r}>{r}</option>)}
          </select>
        )}
        <button onClick={onExport} style={{ background:C.navy, color:C.white, border:"none", borderRadius:8, padding:"9px 16px", fontWeight:700, fontSize:12, cursor:"pointer" }}>Export CSV</button>
      </div>

      {filtered.length===0 ? (
        <div style={{ textAlign:"center", color:C.textMuted, padding:"48px 0", fontSize:14 }}>
          {entries.length===0?"No entries yet - record your first call!":"No results match your filter."}
        </div>
      ):filtered.map(e=>(
        <div key={e.id} style={{ ...cSt, cursor:"pointer" }} onClick={()=>setExpanded(expanded===e.id?null:e.id)}>
          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:15, color:C.text }}>{e.customer_name}</div>
              <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>
                {e.organisation&&`${e.organisation}  -  `}{e.salesperson}  -  {e.date}
              </div>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, alignItems:"flex-start" }}>
              {(e.keywords||[]).map(k=><Badge key={k} label={k}/>)}
              {isAdmin&&<button onClick={ev=>{ev.stopPropagation();onDelete(e.id);}} style={{ background:C.redLight, border:`1px solid ${C.red}`, color:C.red, borderRadius:4, padding:"3px 9px", fontSize:11, cursor:"pointer", fontWeight:700 }}>Delete</button>}
            </div>
          </div>

          <div style={{ fontSize:13, color:C.textMid, lineHeight:1.65, marginTop:10 }}>{e.summary}</div>

          {expanded===e.id && (
            <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:10 }}>
              {(e.key_followups||[]).length>0 && (
                <div>
                  <div style={mSt}>Follow-ups</div>
                  {(e.key_followups||[]).map((f,i)=><div key={i} style={{ fontSize:12, color:C.yellow, borderLeft:`3px solid ${C.yellow}`, paddingLeft:8, marginBottom:4 }}>>> {f}</div>)}
                </div>
              )}
              {e.transcript && (
                <div>
                  <div style={mSt}>Original Transcript</div>
                  <div style={{ fontSize:12, color:C.textMuted, fontStyle:"italic", lineHeight:1.6 }}>"{e.transcript}"</div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// â”€â”€ QUERY TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function QueryTab({ entries }) {
  const [query, setQuery]     = useState("");
  const [answer, setAnswer]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function ask() {
    if (!query.trim()) return;
    if (entries.length===0) { setAnswer("No entries yet - log some calls first!"); return; }
    setLoading(true); setAnswer(""); setError("");
    try {
      const res  = await fetch("/api/query", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ question:query, entries })
      });
      const data = await res.json();
      if (!res.ok||data.error) throw new Error(data.error||"Query failed");
      setAnswer(data.answer);
    } catch(err) { setError(err.message); }
    setLoading(false);
  }

  const suggestions = [
    "What were the last 2 discussions with Surgeon [name]?",
    "Which accounts are flagged as Business at Risk?",
    "What follow-ups are outstanding for [rep name]?",
    "Show all New Business Opportunities",
    "Which surgeons haven't been visited recently?",
    "What product lines came up most in calls?",
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"flex", gap:8 }}>
        <input style={{ ...iSt, flex:1 }} placeholder="Ask anything about your sales data..." value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()}/>
        <button onClick={ask} disabled={loading} style={{ background:C.navy, color:C.white, border:"none", borderRadius:8, padding:"11px 20px", fontWeight:700, fontSize:14, cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1, whiteSpace:"nowrap" }}>
          {loading?"...":"Ask AI"}
        </button>
      </div>

      {error && <div style={{ color:C.red, fontSize:13, background:C.redLight, padding:"10px 14px", borderRadius:8 }}>{error}</div>}

      <div style={cSt}>
        <div style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:700, marginBottom:10 }}>Example queries - tap to use</div>
        {suggestions.map(s=>(
          <div key={s} onClick={()=>setQuery(s)} style={{ fontSize:12, color:C.orange, cursor:"pointer", padding:"7px 10px", background:C.orangeLight, borderRadius:6, marginBottom:6, border:`1px solid ${C.orange}33`, fontWeight:500 }}>{s}</div>
        ))}
      </div>

      {answer && (
        <div style={{ ...cSt, border:`1.5px solid ${C.navy}22` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <img src={logo} alt="" style={{ height:18 }}/>
            <div style={{ fontSize:11, color:C.navy, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:700 }}>AI Answer</div>
          </div>
          <div style={{ fontSize:14, color:C.text, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{answer}</div>
        </div>
      )}
    </div>
  );
}

// â”€â”€ MANAGER DASHBOARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ManagerDashboard({ entries }) {
  const reps     = [...new Set(entries.map(e=>e.salesperson).filter(Boolean))];
  const kwCounts = KEYWORDS.map(k=>({ label:k, count:entries.filter(e=>e.keywords?.includes(k)).length }));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:4, height:22, background:C.orange, borderRadius:2 }}/>
        <div style={{ fontWeight:800, fontSize:16, color:C.navy }}>Manager Dashboard</div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        {[["Total Calls",entries.length,C.orange,C.orangeLight],["Active Reps",reps.length,C.navy,C.navyLight],["At Risk",entries.filter(e=>e.keywords?.includes("Business at Risk")).length,C.red,C.redLight]].map(([l,v,col,bg])=>(
          <div key={l} style={{ background:bg, border:`1px solid ${col}22`, borderRadius:12, padding:"16px 10px", textAlign:"center" }}>
            <div style={{ fontSize:32, fontWeight:800, color:col }}>{v}</div>
            <div style={{ fontSize:10, color:C.textMuted, marginTop:3, fontWeight:600 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Flag breakdown */}
      <div style={cSt}>
        <div style={{ fontSize:12, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:700, marginBottom:16 }}>Flag Overview</div>
        {kwCounts.map(({ label, count })=>{
          const c=KW[label]; const pct=entries.length?Math.round(count/entries.length*100):0;
          return (
            <div key={label} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:12, color:c.text, fontWeight:600 }}>{label}</span>
                <span style={{ fontSize:12, color:C.textMuted }}>{count} {count===1?"entry":"entries"}</span>
              </div>
              <div style={{ background:C.bg, borderRadius:6, height:6, border:`1px solid ${C.border}` }}>
                <div style={{ width:`${pct}%`, background:c.border, borderRadius:6, height:"100%", transition:"width 0.6s" }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rep table */}
      <div style={cSt}>
        <div style={{ fontSize:12, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:700, marginBottom:16 }}>Rep Activity</div>
        {reps.length===0?<div style={{ color:C.textMuted, fontSize:13 }}>No reps have logged calls yet.</div>:reps.map(rep=>{
          const re=entries.filter(e=>e.salesperson===rep);
          const risk=re.filter(e=>e.keywords?.includes("Business at Risk")).length;
          const opp=re.filter(e=>e.keywords?.includes("New Business Opportunity")).length;
          const fu=re.filter(e=>e.keywords?.includes("Follow-up Required")).length;
          const esc=re.filter(e=>e.keywords?.includes("Escalation Needed")).length;
          return (
            <div key={rep} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{rep}</div>
                <div style={{ fontSize:11, color:C.textMuted }}>{re.length} {re.length===1?"call":"calls"} logged</div>
              </div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap", justifyContent:"flex-end" }}>
                {opp>0&&<span style={{ fontSize:11, background:C.greenLight, border:`1px solid ${C.green}`, color:C.green, borderRadius:4, padding:"2px 7px", fontWeight:700 }}>+{opp} opp</span>}
                {risk>0&&<span style={{ fontSize:11, background:C.redLight, border:`1px solid ${C.red}`, color:C.red, borderRadius:4, padding:"2px 7px", fontWeight:700 }}>{risk} risk</span>}
                {fu>0&&<span style={{ fontSize:11, background:C.yellowLight, border:`1px solid ${C.yellow}`, color:C.yellow, borderRadius:4, padding:"2px 7px", fontWeight:700 }}>{fu} f/u</span>}
                {esc>0&&<span style={{ fontSize:11, background:C.purpleLight, border:`1px solid ${C.purple}`, color:C.purple, borderRadius:4, padding:"2px 7px", fontWeight:700 }}>{esc} esc</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// â”€â”€ MAIN APP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function App() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [tab, setTab]         = useState("record");
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(()=>{
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data })=>{
      if (data?.session?.user) { setUser(data.session.user); fetchEntries(); }
      setLoading(false);
    });
    const { data:listener } = supabase.auth.onAuthStateChange((_e,session)=>{
      setUser(session?.user||null);
      if (session?.user) fetchEntries(); else setEntries([]);
    });
    return ()=>listener?.subscription?.unsubscribe();
  },[]);

  async function fetchEntries() {
    if (!supabase) return;
    const { data } = await supabase.from("entries").select("*").order("created_at",{ ascending:false });
    if (data) setEntries(data);
  }

  async function deleteEntry(id) {
    if (!window.confirm("Delete this entry?")) return;
    if (supabase) await supabase.from("entries").delete().eq("id",id);
    setEntries(prev=>prev.filter(e=>e.id!==id));
  }

  function handleSave(entry) {
    fetchEntries();
    setTab("database");
  }

  function exportCSV() {
    const headers=["Date","Salesperson","Surgeon","Hospital","Product","Topic","Follow-ups","Flags","Sentiment","Summary"];
    const rows=entries.map(e=>[e.date,e.salesperson,e.customer_name,e.organisation,e.product_line||"",e.topic_discussed,(e.key_followups||[]).join("; "),(e.keywords||[]).join("; "),e.sentiment,e.summary].map(v=>`"${String(v||"").replace(/"/g,'""')}"`));
    const csv=[headers,...rows].map(r=>r.join(",")).join("\n");
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    a.download=`SN_Sales_${new Date().toLocaleDateString("en-GB").replace(/\//g,"-")}.csv`;
    a.click();
  }

  async function signOut() { if(supabase) await supabase.auth.signOut(); setUser(null); setEntries([]); }

  if (loading) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
      <img src={logo} alt="Smith+Nephew" style={{ height:52 }}/>
      <div style={{ fontSize:13, color:C.textMuted }}>Loading...</div>
    </div>
  );

  if (!user) return <LoginScreen onLogin={u=>{ setUser(u); fetchEntries(); }}/>;

  const TABS=[
    { id:"record",  label:"Record"  },
    { id:"database",label:`Calls${entries.length>0?` (${entries.length})`:""}`},
    { id:"query",   label:"Query"   },
    ...(isAdmin?[{ id:"manager", label:"Manager" }]:[]),
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'Inter','Segoe UI',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, boxShadow:C.shadow, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:640, margin:"0 auto", padding:"12px 20px", display:"flex", alignItems:"center", gap:12 }}>
          <img src={logo} alt="Smith+Nephew" style={{ height:34 }}/>
          <div style={{ width:1, height:26, background:C.border }}/>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:C.navy }}>Sales CRM</div>
            <div style={{ fontSize:10, color:C.textMuted }}>Netherlands</div>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{user.email?.split("@")[0]}</div>
              {isAdmin&&<div style={{ fontSize:10, color:C.orange, fontWeight:700 }}>Manager</div>}
            </div>
            <button onClick={signOut} style={{ background:C.bg, border:`1px solid ${C.border}`, color:C.textMid, borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Sign out</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:640, margin:"0 auto", padding:"0 20px", display:"flex" }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:"13px 4px", border:"none", borderBottom:tab===t.id?`3px solid ${C.orange}`:"3px solid transparent", background:"transparent", color:tab===t.id?C.orange:C.textMuted, fontWeight:tab===t.id?700:500, fontSize:12, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s" }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:640, margin:"0 auto", padding:20 }}>
        {tab==="record"  &&<RecordTab user={user} onSave={handleSave}/>}
        {tab==="database"&&<DatabaseTab entries={entries} onDelete={deleteEntry} isAdmin={isAdmin} onExport={exportCSV}/>}
        {tab==="query"   &&<QueryTab entries={entries}/>}
        {tab==="manager"&&isAdmin&&<ManagerDashboard entries={entries}/>}
      </div>

      <div style={{ textAlign:"center", padding:"24px 0 32px", fontSize:11, color:C.textMuted }}>
        Smith+Nephew Netherlands | Sales CRM | Confidential
      </div>
    </div>
  );
}
