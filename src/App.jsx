import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

// --- CONFIGURACIÓN CLOUD SEGURA ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = ["🎬 Reels", "📸 Imagen", "📱 Historia", "✍️ Texto"];

export default function App() {
  const [data, setData] = useState([]);
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [script, setScript] = useState("");
  const [time, setTime] = useState(new Date());
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), topic: "", views: "", revenue: "", format: "📸 Imagen" });
  
  // --- ESTADOS SIMULADOR ---
  const [simViews, setSimViews] = useState(1000000);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const load = async () => {
    const { data: cloud } = await supabase.from("metrics").select("*").order('date', { ascending: false });
    if (cloud) setData(cloud);
  }

  useEffect(() => { if (auth) load() }, [auth]);

  // --- CÁLCULOS INTELIGENCIA ---
  const totalRev = data.reduce((a, b) => a + Number(b.revenue), 0);
  const totalViews = data.reduce((a, b) => a + Number(b.views), 0);
  const globalRPM = totalViews > 0 ? (totalRev / totalViews) : 0.000013;
  
  // Salud del Imperio
  const healthScore = data.length > 0 ? Math.min(Math.max(50 + (data[0].revenue > (totalRev/data.length) ? 25 : -15), 0), 100) : 0;

  // --- SIMULACIÓN DE IMPACTO (FASE 7) ---
  const estimatedGain = simViews * globalRPM;

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, views: parseFloat(form.views), revenue: parseFloat(form.revenue) };
    await supabase.from("metrics").insert([payload]);
    setForm({ ...form, topic: "", views: "", revenue: "" });
    load();
  }

  const createScript = () => {
    const hooks = ["¡ALERTA! Lo que verás hoy cambiará tu perspectiva...", "NOTICIA URGENTE: El testimonio que el mundo ignora.", "Esto acaba de ocurrir y es un milagro real..."];
    setScript(`${hooks[Math.floor(Math.random()*hooks.length)]} \n\nNoticia: ${form.topic || "Escribe un titular"}`);
  };

  if (!auth) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-sm w-full border-t-8 border-blue-600">
        <h2 className="text-3xl font-black text-blue-600 mb-6 uppercase italic">IBIELE TV</h2>
        <input type="password" placeholder="PASSWORD" className="w-full p-4 rounded-xl bg-slate-50 text-center mb-6 text-xl font-black outline-none border" value={pass} onChange={(e) => setPass(e.target.value)} />
        <button onClick={() => pass === "IBIELE2026" ? setAuth(true) : alert("ERROR")} className="w-full bg-[#003566] p-4 rounded-xl font-black text-white uppercase">Acceder</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-3 md:p-8 font-sans text-slate-900 border-[10px] md:border-[20px] border-[#003566]">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 text-center md:text-left">
           <div>
              <h1 className="text-5xl md:text-7xl font-black text-[#003566] italic uppercase tracking-tighter">IBIELE TV <span className="text-blue-600">INTEL</span></h1>
              <div className="bg-[#003566] text-white px-5 py-2 rounded-2xl mt-4 shadow-xl flex items-center gap-4 w-fit mx-auto md:mx-0 border-b-4 border-blue-400 font-black">
                 {time.toLocaleTimeString()}
              </div>
           </div>
           <div className={`bg-white p-6 rounded-[40px] shadow-xl border-t-4 ${healthScore > 70 ? 'border-green-500' : 'border-red-500'}`}>
              <p className="text-[10px] font-black uppercase text-slate-400">Salud Imperio: <span className="text-slate-900">{healthScore}%</span></p>
           </div>
        </header>

        {/* 🔮 SIMULADOR DE IMPACTO (FASE 7) */}
        <div className="bg-gradient-to-br from-[#003566] to-blue-900 p-8 rounded-[50px] shadow-2xl text-white mb-10 text-left relative overflow-hidden">
           <div className="relative z-10">
              <p className="text-xs font-black uppercase text-blue-300 mb-6 tracking-widest italic">🔮 Oráculo: Simulador de Ganancia Proyectada</p>
              <div className="flex flex-col md:flex-row items-center gap-8">
                 <div className="flex-1 w-full">
                    <p className="text-sm font-bold opacity-70 mb-2">SI ESTE VIDEO LOGRA (Vistas):</p>
                    <input 
                       type="range" min="100000" max="10000000" step="100000" 
                       value={simViews} onChange={(e) => setSimViews(e.target.value)}
                       className="w-full h-3 bg-blue-400 rounded-lg appearance-none cursor-pointer mb-2"
                    />
                    <p className="text-4xl font-black italic tracking-tighter">{(simViews/1000000).toFixed(1)}M VISTAS</p>
                 </div>
                 <div className="bg-white/10 p-6 rounded-[35px] backdrop-blur-md border border-white/20 text-center md:text-right min-w-[200px]">
                    <p className="text-xs font-black text-green-400 uppercase">La Caja sería de:</p>
                    <p className="text-6xl font-black italic text-green-400 leading-none mt-2">${estimatedGain.toFixed(2)}</p>
                    <p className="text-[10px] opacity-60 mt-2 uppercase font-bold">Basado en tu RPM actual</p>
                 </div>
              </div>
           </div>
           <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl font-black italic">$</div>
        </div>

        {/* PATRONES & GUION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left text-sm">
           <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100">
              <p className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest italic">📡 Scanner de Patrones</p>
              <div className="bg-blue-50 p-4 rounded-2xl border-l-8 border-blue-600 font-bold italic">
                 {data.length > 0 ? `🔥 El formato ${data[0].format} está liderando tu crecimiento.` : "Carga datos para analizar."}
              </div>
           </div>
           <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase mb-2">🎭 News Script AI</p>
                <p className="text-lg font-black text-[#003566] italic leading-tight">"{script || 'Escribe y genera...'}"</p>
              </div>
              <button onClick={createScript} className="mt-4 bg-blue-600 text-white p-3 rounded-xl font-black uppercase text-xs">Generar Gancho 🚀</button>
           </div>
        </div>

        {/* REGISTRO */}
        <section className="bg-white p-8 rounded-[45px] shadow-xl mb-12 border">
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="p-4 rounded-2xl bg-slate-50 font-black border text-lg text-center" />
            <select value={form.format} onChange={e => setForm({...form, format: e.target.value})} className="p-4 rounded-2xl bg-slate-50 font-black border text-lg uppercase text-center">
              {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <input placeholder="TITULAR" value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="md:col-span-2 p-4 rounded-2xl bg-slate-50 font-black border text-lg uppercase" required />
            <input placeholder="Vistas" value={form.views} onChange={e => setForm({...form, views: e.target.value})} className="p-5 rounded-[30px] bg-slate-50 font-black text-5xl text-blue-600 text-center" required />
            <input placeholder="Caja $" value={form.revenue} onChange={e => setForm({...form, revenue: e.target.value})} className="p-5 rounded-[30px] bg-slate-50 font-black text-5xl text-green-600 text-center" required />
            <button className="md:col-span-2 p-6 rounded-[35px] font-black uppercase text-2xl bg-[#003566] text-white">Sincronizar Imperio 🚀</button>
          </form>
        </section>

        {/* BITÁCORA */}
        <div className="bg-white rounded-[60px] shadow-2xl p-6 md:p-10 border mb-10 text-left">
          <h2 className="text-3xl font-black text-[#003566] uppercase text-center italic tracking-widest mb-10 border-b-4 border-blue-600 pb-4">Bitácora de Mando</h2>
          <div className="space-y-6">
            {data.map(d => (
              <div key={d.id} className="p-8 bg-slate-50 rounded-[50px] flex flex-col md:flex-row justify-between items-center border hover:bg-blue-50 transition-all gap-8">
                <div className="flex items-center gap-8 text-left w-full md:w-auto">
                  <div className="bg-[#003566] w-24 h-24 rounded-[35px] flex flex-col items-center justify-center text-white shrink-0 border-b-8 border-blue-900 shadow-xl">
                    <span className="text-5xl font-black italic">{d.date.split("-")[2]}</span>
                    <span className="text-[12px] font-bold uppercase opacity-60">FEB</span>
                  </div>
                  <div className="max-w-md">
                    <p className="text-sm font-black text-blue-600 uppercase mb-1">{d.format}</p>
                    <p className="text-3xl font-black text-[#003566] uppercase leading-tight italic">{d.topic}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-5xl font-black text-slate-800 tracking-tighter">{(d.views / 1000000).toFixed(1)}M</p>
                   <p className="text-5xl font-black text-green-600 italic leading-none mt-2">${Number(d.revenue).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}