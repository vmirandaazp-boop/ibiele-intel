import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

// --- CONFIGURACIÓN CORE ---
const supabase = createClient(
  "https://stenaxhdsfxrzhetetiz.supabase.co",
  "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN"
)

const FORMATS = ["🎬 Reels", "📸 Imagen", "📱 Historia", "✍️ Texto"]
const MONTH_GOAL = 1019.82; 
const JAN_TOTAL_VIEWS = 106000000; 

const JANUARY_LOG = {
  "01": { topic: "Nick Vujicic", rev: 7.85, views: 700000 },
  "02": { topic: "Terremoto", rev: 8.04, views: 700000 },
  "03": { topic: "Trump", rev: 20.83, views: 2000000 },
  "04": { topic: "Mataron a mi hijo", rev: 12.80, views: 700000 },
  "05": { topic: "🎥 RÉCORD: Mártires", rev: 33.56, views: 1200000 }
};

// ================== 🧠 MOTORES DE INTELIGENCIA (FASES 1-5) ==================

const analyzeTopics = (data) => {
  if (!data || data.length === 0) return [];
  const keywords = ["JESÚS", "MISIONERO", "MUERTE", "ETIOPIA", "SALVA", "MÁRTIRES", "CRISTIANOS", "TRUMP", "MILAGRO"];
  return keywords.map(word => {
    const matches = data.filter(d => d.topic.toUpperCase().includes(word));
    if (matches.length === 0) return null;
    const avgRev = matches.reduce((a, b) => a + Number(b.revenue), 0) / matches.length;
    return { word, avgRev, count: matches.length };
  }).filter(s => s !== null).sort((a, b) => b.avgRev - a.avgRev);
}

const predictMonthRealist = (data) => {
  if (!data || data.length < 2) return null;
  const totalRev = data.reduce((a, b) => a + Number(b.revenue), 0);
  const avgDaily = totalRev / data.length;
  const projection = avgDaily * 28;
  const risk = (data[0]?.revenue || 0) < (avgDaily * 0.75);
  return { avg: avgDaily, projection, risk, totalRev };
}

const formatNum = (n) => {
  const num = Number(n);
  if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num;
};

// ================== COMPONENTE PRINCIPAL ==================

export default function App() {
  const [data, setData] = useState([])
  const [auth, setAuth] = useState(false)
  const [pass, setPass] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [time, setTime] = useState(new Date())
  const [form, setForm] = useState({ date: "2026-02-05", topic: "", views: "", revenue: "", format: "🎬 Reels" })

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const load = async () => {
    const { data: cloud } = await supabase.from("metrics").select("*").order('date', { ascending: false });
    if (cloud) setData(cloud);
  }

  useEffect(() => { if (auth) load() }, [auth])

  // Ejecución de IA
  const ai = predictMonthRealist(data);
  const topicIntel = analyzeTopics(data);
  const totalFebViews = data.reduce((a, b) => a + Number(b.views), 0);
  const refDay = JANUARY_LOG[form.date.split("-")[2]] || { topic: "N/A", rev: 0, views: 0 };

  const save = async (e) => {
    e.preventDefault();
    const v = parseFloat(form.views.toString().toUpperCase().replace("M","").replace("K","")) || 0;
    const r = parseFloat(form.revenue) || 0;
    const payload = { date: form.date, topic: form.topic, views: v, revenue: r, format: form.format };
    if (editingId) { await supabase.from("metrics").update(payload).eq('id', editingId); setEditingId(null); }
    else { await supabase.from("metrics").insert([payload]); }
    setForm({ ...form, topic: "", views: "", revenue: "" }); load();
  }

  if (!auth) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-sm w-full border-t-8 border-blue-600">
        <h2 className="text-3xl font-black text-blue-600 italic mb-6">IBIELE TV INTEL</h2>
        <input type="password" placeholder="PASSWORD" className="w-full p-4 rounded-xl bg-slate-50 text-center mb-6 text-xl font-bold outline-none" value={pass} onChange={(e) => setPass(e.target.value)} />
        <button onClick={() => pass === "IBIELE2026" ? setAuth(true) : alert("ERROR")} className="w-full bg-[#003566] p-4 rounded-xl font-black text-white uppercase tracking-widest">Entrar al Mando</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-3 md:p-8 font-sans text-slate-900 border-[10px] md:border-[20px] border-[#003566]">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER & RELOJ */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
           <div className="text-center md:text-left">
              <h1 className="text-5xl font-black text-[#003566] italic uppercase tracking-tighter leading-none">IBIELE TV <span className="text-blue-600 font-black">INTEL</span></h1>
              <div className="bg-[#003566] text-white px-5 py-2 rounded-2xl mt-4 shadow-xl flex items-center gap-4 w-fit mx-auto md:mx-0 border-b-4 border-blue-400">
                 <div className="text-2xl font-black tabular-nums">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                 <div className="text-[10px] font-black uppercase opacity-60 border-l border-white/20 pl-4 leading-tight">ESTRATEGIA ACTIVA</div>
              </div>
           </div>
           <div className="w-full md:w-1/2 space-y-3">
              <div className="bg-white p-4 rounded-3xl shadow-lg border border-slate-100 flex justify-between items-center italic font-black text-sm md:text-lg">
                 <span>CAJA FEB: ${ai?.totalRev.toFixed(2)}</span>
                 <div className="w-1/3 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div style={{ width: `${Math.min((ai?.totalRev/MONTH_GOAL)*100, 100)}%` }} className="bg-green-500 h-full"></div>
                 </div>
              </div>
              <div className="bg-white p-4 rounded-3xl shadow-lg border border-slate-100 flex justify-between items-center italic font-black text-sm md:text-lg text-blue-600">
                 <span>VISTAS: {formatNum(totalFebViews)}</span>
                 <div className="w-1/3 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div style={{ width: `${Math.min((totalFebViews/JAN_TOTAL_VIEWS)*100, 100)}%` }} className="bg-blue-600 h-full"></div>
                 </div>
              </div>
           </div>
        </header>

        {/* 🚨 PANEL IA PREDICTIVA REALISTA */}
        {ai && (
          <div className={`p-8 rounded-[45px] shadow-2xl mb-10 border-b-[10px] transition-all ${ai.risk ? "bg-red-50 border-red-500" : "bg-green-50 border-green-500"}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-slate-400 text-center md:text-left">🤖 IA Ejecutiva — Proyección de Cierre</p>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-xs font-bold opacity-60 uppercase mb-1">Proyección Realista de Febrero</p>
                <p className="text-6xl md:text-8xl font-black text-slate-900 italic tracking-tighter leading-none">${ai.projection.toFixed(2)}</p>
                <p className={`mt-4 text-sm font-black uppercase ${ai.risk ? 'text-red-600' : 'text-green-600'}`}>
                  {ai.risk ? "⚠️ ALERTA: Ritmo en descenso. Necesitas video de alto impacto hoy." : "✅ RITMO SALUDABLE: Estás cumpliendo la tendencia de crecimiento."}
                </p>
              </div>
              <div className="bg-white p-6 rounded-[35px] shadow-inner text-center md:text-right border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-2 italic">Duelo vs Enero ({refDay.topic})</p>
                 <p className="text-sm font-bold opacity-40 uppercase">Enero: ${refDay.rev}</p>
                 <p className="text-5xl font-black text-blue-600 italic">${data.filter(d => d.date === form.date).reduce((a,b)=>a+Number(b.revenue),0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* 🔥 IA ANALISTA DE TEMAS (FASE 5) */}
        {topicIntel.length > 0 && (
          <div className="bg-white p-8 rounded-[45px] shadow-2xl border border-slate-100 mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6 text-center md:text-left">🔥 Temas de Alto Rendimiento (Inteligencia de Datos)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topicIntel.slice(0, 4).map(t => (
                <div key={t.word} className="bg-slate-50 p-5 rounded-[30px] border-b-4 border-blue-600 shadow-sm">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{t.word}</p>
                  <p className="text-3xl font-black text-[#003566] leading-none">${t.avgRev.toFixed(2)}</p>
                  <p className="text-[8px] font-bold text-blue-500 mt-2 uppercase">Promedio p/post</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REGISTRO / EDICIÓN */}
        <section className="bg-white p-8 rounded-[40px] shadow-xl mb-10 border border-slate-100">
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="p-4 rounded-2xl bg-slate-50 font-black border border-slate-100 text-lg text-center" />
            <select value={form.format} onChange={e => setForm({...form, format: e.target.value})} className="p-4 rounded-2xl bg-slate-50 font-black border border-slate-100 text-lg uppercase">
              {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <input placeholder="TITULAR DE LA NOTICIA" value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="md:col-span-2 p-4 rounded-2xl bg-slate-50 font-black border border-slate-100 text-lg uppercase tracking-tighter" required />
            <input placeholder="Vistas (K/M)" value={form.views} onChange={e => setForm({...form, views: e.target.value})} className="p-6 rounded-[35px] bg-slate-50 font-black text-5xl text-blue-600 text-center shadow-inner outline-none focus:border-blue-600" required />
            <input placeholder="Caja $" value={form.revenue} onChange={e => setForm({...form, revenue: e.target.value})} className="p-6 rounded-[35px] bg-slate-50 font-black text-5xl text-green-600 text-center shadow-inner outline-none focus:border-green-600" required />
            <button className={`md:col-span-2 p-6 rounded-[40px] font-black uppercase text-2xl shadow-xl transition-all ${editingId ? 'bg-orange-500' : 'bg-[#003566]'} text-white tracking-widest active:scale-95`}>
               {editingId ? "ACTUALIZAR" : "SINCRONIZAR 🚀"}
            </button>
          </form>
        </section>

        {/* BITÁCORA */}
        <div className="bg-white rounded-[50px] shadow-2xl p-6 md:p-10 border border-slate-100 mb-10">
          <h2 className="text-3xl font-black text-[#003566] uppercase text-center italic tracking-widest mb-10 underline decoration-blue-600 decoration-4 underline-offset-8">Bitácora de Inteligencia</h2>
          <div className="space-y-4">
            {data.map(d => {
               const dayKey = d.date.split("-")[2];
               const jan = JANUARY_LOG[dayKey] || { rev: 0, views: 0, topic: "N/A" };
               const rDiff = (d.revenue - jan.rev).toFixed(2);
               return (
                  <div key={d.id} className="p-6 bg-slate-50 rounded-[45px] flex flex-col md:flex-row justify-between items-center border border-slate-100 hover:bg-blue-50 transition-all gap-6 shadow-sm">
                     <div className="flex items-center gap-6 text-left w-full md:w-auto">
                        <div className="bg-[#003566] w-16 h-16 rounded-[22px] flex flex-col items-center justify-center text-white shrink-0 border-b-4 border-blue-900 shadow-lg">
                           <span className="text-3xl font-black italic">{dayKey}</span>
                           <span className="text-[8px] font-bold uppercase opacity-60">FEB</span>
                        </div>
                        <div className="truncate">
                           <p className="text-[10px] font-black text-blue-600 uppercase mb-0.5">{d.format}</p>
                           <p className="text-2xl font-black text-[#003566] uppercase tracking-tighter italic leading-none">{d.topic}</p>
                           <p className={`mt-2 font-black uppercase text-xs ${rDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              Vs Enero: {rDiff >= 0 ? '🚀 +$' : '📉 -$'} {Math.abs(rDiff)}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-10">
                        <div className="text-right">
                           <p className="text-4xl font-black text-slate-800 tracking-tighter leading-none">{formatNum(d.views)}</p>
                           <p className="text-4xl font-black text-green-600 leading-none mt-1">${Number(d.revenue).toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                           <button onClick={() => {setEditingId(d.id); setForm(d); window.scrollTo({top:0, behavior:'smooth'});}} className="p-3 bg-white border-2 border-blue-600 rounded-xl text-blue-600 text-[10px] font-black uppercase shadow-sm">Editar</button>
                           <button onClick={() => { if(confirm("¿ELIMINAR?")) supabase.from("metrics").delete().eq('id', d.id).then(load); }} className="p-3 bg-white border-2 border-red-600 rounded-xl text-red-600 text-[10px] font-black uppercase shadow-sm">X</button>
                        </div>
                     </div>
                  </div>
               )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}