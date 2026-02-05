import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

// --- CONEXIÓN DIRECTA (FUERZA BRUTA) ---
const supabaseUrl = "https://stenaxhdsfxrzhetetiz.supabase.co";
const supabaseAnonKey = "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = ["🎬 Reels", "📸 Imagen", "📱 Historia", "✍️ Texto"];

export default function App() {
  const [data, setData] = useState([]);
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [script, setScript] = useState("");
  const [time, setTime] = useState(new Date());
  const [simViews, setSimViews] = useState(1000000);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), topic: "", views: "", revenue: "", format: "📸 Imagen" });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const load = async () => {
    try {
      const { data: cloud, error } = await supabase.from("metrics").select("*").order('date', { ascending: false });
      if (error) throw error;
      if (cloud) setData(cloud);
    } catch (err) {
      console.error("Error cargando datos:", err.message);
    }
  }

  useEffect(() => { if (auth) load() }, [auth]);

  // --- CÁLCULOS DE INTELIGENCIA ---
  const totalRev = data.reduce((a, b) => a + Number(b.revenue), 0);
  const totalViews = data.reduce((a, b) => a + Number(b.views), 0);
  const globalRPM = totalViews > 0 ? (totalRev / totalViews) : 0.000013;
  const healthScore = data.length > 0 ? Math.min(Math.max(50 + (Number(data[0].revenue) > (totalRev/data.length) ? 25 : -15), 0), 100) : 0;
  const estimatedGain = simViews * globalRPM;

  const save = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("metrics").insert([{ 
      ...form, 
      views: parseFloat(form.views), 
      revenue: parseFloat(form.revenue) 
    }]);
    if (!error) {
      setForm({ ...form, topic: "", views: "", revenue: "" });
      load();
    }
  }

  const formatNum = (n) => {
    const num = Number(n);
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  if (!auth) return (
    <div className="min-h-screen bg-[#001d3d] flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-12 rounded-[50px] shadow-2xl text-center max-w-sm w-full border-t-8 border-blue-600">
        <h2 className="text-4xl font-black text-[#003566] italic mb-8 uppercase tracking-tighter">IBIELE TV</h2>
        <input type="password" placeholder="CÓDIGO" className="w-full p-5 rounded-2xl bg-slate-50 text-center mb-6 text-2xl font-bold outline-none border-2" value={pass} onChange={(e) => setPass(e.target.value)} />
        <button onClick={() => pass === "IBIELE2026" ? setAuth(true) : alert("ACCESO DENEGADO")} className="w-full bg-[#003566] p-5 rounded-2xl font-black text-white uppercase tracking-widest text-xl shadow-lg">Entrar al Mando</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-2 md:p-8 font-sans text-slate-900 border-[10px] md:border-[20px] border-[#003566]">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
           <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-black text-[#003566] italic uppercase tracking-tighter leading-none">IBIELE TV <span className="text-blue-600">INTEL</span></h1>
              <div className="bg-[#003566] text-white px-6 py-2 rounded-2xl mt-4 shadow-xl flex items-center gap-4 w-fit mx-auto md:mx-0 border-b-4 border-blue-400">
                 <div className="text-3xl font-black tabular-nums">{time.toLocaleTimeString()}</div>
              </div>
           </div>
           <div className="bg-white p-6 rounded-[40px] shadow-xl border border-slate-100 flex items-center gap-6">
              <div className={`w-16 h-16 rounded-full border-[6px] flex items-center justify-center font-black text-xl ${healthScore > 70 ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                 {healthScore}
              </div>
              <div className="text-left">
                 <p className="text-[10px] font-black uppercase text-slate-400">Estado del Imperio</p>
                 <p className="text-lg font-black text-[#003566] uppercase leading-none">{healthScore > 70 ? 'Firme' : 'En Riesgo'}</p>
              </div>
           </div>
        </header>

        {/* 🔮 SIMULADOR "EL ORÁCULO" */}
        <div className="bg-[#003566] p-10 rounded-[60px] shadow-2xl text-white mb-10 text-left border-b-[12px] border-blue-900 relative overflow-hidden">
           <p className="text-xs font-black uppercase text-blue-400 mb-8 tracking-widest italic">🔮 Oráculo: Simulador de Impacto</p>
           <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 w-full">
                 <p className="text-sm font-bold opacity-70 mb-4 uppercase tracking-tighter">SI EL VIDEO LOGRA:</p>
                 <input type="range" min="100000" max="10000000" step="100000" value={simViews} onChange={(e) => setSimViews(e.target.value)} className="w-full h-4 bg-blue-400 rounded-lg appearance-none cursor-pointer mb-4" />
                 <p className="text-6xl md:text-8xl font-black italic tracking-tighter">{(simViews/1000000).toFixed(1)}M <span className="text-2xl not-italic opacity-40">Vistas</span></p>
              </div>
              <div className="bg-white/10 p-10 rounded-[45px] backdrop-blur-xl border border-white/20 text-center lg:text-right min-w-[300px]">
                 <p className="text-xs font-black text-green-400 uppercase mb-2">Ganancia Estimada</p>
                 <p className="text-7xl font-black italic text-green-400 leading-none">${estimatedGain.toFixed(2)}</p>
                 <p className="text-[11px] opacity-60 mt-4 uppercase font-bold tracking-widest">Basado en RPM Global</p>
              </div>
           </div>
        </div>

        {/* PATRONES & GUION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-left">
           <div className="bg-white p-8 rounded-[50px] shadow-xl border border-slate-100">
              <p className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest italic">📡 Scanner de Patrones</p>
              <div className="bg-blue-50 p-6 rounded-3xl border-l-[10px] border-blue-600 text-lg font-black italic text-[#003566]">
                 {data.length > 0 ? `🔥 El formato ${data[0].format} está dominando tu alcance.` : "Sincronizando con la nube..."}
              </div>
           </div>
           <div className="bg-white p-8 rounded-[50px] shadow-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase mb-2 italic">🎭 IA Script AI</p>
                <p className="text-2xl font-black text-[#003566] italic leading-tight">"{script || 'Escribe un titular abajo...'}"</p>
              </div>
              <button onClick={() => setScript(`¡URGENTE! Tienes que ver lo que pasó en: ${form.topic}`)} className="mt-6 bg-blue-600 text-white p-4 rounded-2xl font-black uppercase text-xs shadow-lg">Generar Gancho 🚀</button>
           </div>
        </div>

        {/* REGISTRO */}
        <section className="bg-white p-10 rounded-[60px] shadow-2xl mb-12 border-2 border-slate-50">
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="p-5 rounded-2xl bg-slate-50 font-black border-2 border-slate-100 text-xl text-center" />
            <select value={form.format} onChange={e => setForm({...form, format: e.target.value})} className="p-5 rounded-2xl bg-slate-50 font-black border-2 border-slate-100 text-xl uppercase">
              {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <input placeholder="TITULAR DE LA NOTICIA" value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="md:col-span-2 p-5 rounded-2xl bg-slate-50 font-black border-2 border-slate-100 text-xl uppercase tracking-tighter" required />
            <input placeholder="Vistas" value={form.views} onChange={e => setForm({...form, views: e.target.value})} className="p-6 rounded-[40px] bg-slate-50 font-black text-6xl text-blue-600 text-center shadow-inner" required />
            <input placeholder="Caja $" value={form.revenue} onChange={e => setForm({...form, revenue: e.target.value})} className="p-6 rounded-[40px] bg-slate-50 font-black text-6xl text-green-600 text-center shadow-inner" required />
            <button className="md:col-span-2 p-8 rounded-[45px] font-black uppercase text-3xl shadow-2xl bg-[#003566] text-white tracking-widest italic">Sincronizar Imperio 🚀</button>
          </form>
        </section>

        {/* BITÁCORA (NÚMEROS GIGANTES) */}
        <div className="bg-white rounded-[70px] shadow-2xl p-10 border border-slate-100 mb-10 text-left text-sm md:text-base">
          <h2 className="text-4xl font-black text-[#003566] uppercase text-center italic tracking-widest mb-12 border-b-8 border-blue-600 pb-6">Bitácora de Mando Supremo</h2>
          <div className="space-y-8">
            {data.map(d => (
              <div key={d.id} className="p-10 bg-slate-50 rounded-[60px] flex flex-col lg:flex-row justify-between items-center border-2 border-slate-100 hover:bg-blue-50 transition-all gap-10">
                <div className="flex items-center gap-10 text-left w-full lg:w-auto">
                  <div className="bg-[#003566] w-28 h-28 rounded-[40px] flex flex-col items-center justify-center text-white shadow-2xl border-b-[10px] border-blue-900 shrink-0 font-black">
                    <span className="text-6xl italic leading-none">{d.date.split("-")[2]}</span>
                    <span className="text-sm uppercase opacity-60">FEB</span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-blue-600 uppercase mb-1 tracking-widest">{d.format}</p>
                    <p className="text-4xl font-black text-[#003566] uppercase leading-tight italic tracking-tighter">{d.topic}</p>
                  </div>
                </div>
                <div className="text-right font-black">
                   <p className="text-6xl text-slate-800 tracking-tighter leading-none">{formatNum(d.views)}</p>
                   <p className="text-6xl text-green-600 leading-none mt-3 italic">${Number(d.revenue).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}