import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

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
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), topic: "", views: "", revenue: "", format: "🎬 Reels" });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const load = async () => {
    const { data: cloud } = await supabase.from("metrics").select("*").order('date', { ascending: false });
    if (cloud) setData(cloud);
  }

  useEffect(() => { if (auth) load() }, [auth]);

  const totalRev = data.reduce((a, b) => a + Number(b.revenue), 0);
  const totalViews = data.reduce((a, b) => a + Number(b.views), 0);
  const globalRPM = totalViews > 0 ? (totalRev / totalViews) : 0.000010;
  const healthScore = data.length > 0 ? Math.min(Math.max(50 + (Number(data[0].revenue) > (totalRev/data.length || 1) ? 25 : -15), 0), 100) : 0;
  const estimatedGain = simViews * globalRPM;

  const save = async (e) => {
    e.preventDefault();
    await supabase.from("metrics").insert([{ ...form, views: parseFloat(form.views), revenue: parseFloat(form.revenue) }]);
    setForm({ ...form, topic: "", views: "", revenue: "", date: new Date().toISOString().slice(0, 10), format: "🎬 Reels" });
    load();
  }

  if (!auth) return (
    <div className="min-h-screen bg-[#001d3d] flex items-center justify-center p-6 text-slate-900">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center w-full max-w-sm border-t-8 border-blue-600">
        <h2 className="text-3xl font-black text-[#003566] italic mb-6 uppercase">IBIELE TV</h2>
        <input type="password" placeholder="CÓDIGO" className="w-full p-4 rounded-2xl bg-slate-50 text-center mb-6 text-xl font-bold border-2 outline-none" value={pass} onChange={(e) => setPass(e.target.value)} />
        <button onClick={() => pass === "IBIELE2026" ? setAuth(true) : alert("ERROR")} className="w-full bg-[#003566] text-white p-4 rounded-2xl font-black uppercase shadow-lg">ENTRAR</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-900 pb-10">
      
      {/* HEADER SUPREMO */}
      <header className="bg-[#003566] text-white p-6 rounded-b-[50px] shadow-2xl mb-8 border-b-8 border-blue-500">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter leading-none uppercase">IBIELE TV <span className="text-blue-400 block text-lg">INTEL COMMAND</span></h1>
            <p className="text-[12px] font-bold opacity-60 mt-2 bg-white/10 w-fit px-3 py-1 rounded-lg border border-white/10 uppercase tabular-nums">{time.toLocaleTimeString()}</p>
          </div>
          <div className="text-right bg-white/10 p-3 rounded-3xl border border-white/20">
            <p className="text-[9px] font-black uppercase opacity-50 mb-1">Status</p>
            <div className={`text-xl font-black ${healthScore > 70 ? 'text-green-400' : 'text-red-400'}`}>{healthScore}%</div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 space-y-8">
        
        {/* 🔮 SIMULADOR DE IMPACTO (GIGANTE) */}
        <section className="bg-white p-8 rounded-[50px] shadow-2xl border border-slate-100 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-black italic">$</div>
           <p className="text-[10px] font-black uppercase text-blue-600 mb-6 tracking-widest italic border-b pb-2 inline-block">🔮 Simulador de Caja</p>
           <div className="space-y-6">
              <div className="text-6xl font-black italic tracking-tighter text-[#003566]">{(simViews/1000000).toFixed(1)}M <span className="text-base not-italic opacity-40">vistas</span></div>
              <input type="range" min="100000" max="10000000" step="100000" value={simViews} onChange={(e) => setSimViews(e.target.value)} className="w-full h-4 bg-slate-100 rounded-2xl appearance-none cursor-pointer accent-blue-600" />
              <div className="bg-[#003566] p-6 rounded-[35px] text-white shadow-xl">
                 <p className="text-[10px] font-black uppercase text-green-400 mb-1">Ganancia Estimada:</p>
                 <p className="text-6xl font-black italic text-green-400 leading-none">${estimatedGain.toFixed(2)}</p>
              </div>
           </div>
        </section>

        {/* REGISTRO AGRESIVO */}
        <section className="bg-white p-8 rounded-[50px] shadow-2xl border-t-8 border-blue-600">
          <h3 className="text-center text-xs font-black uppercase text-slate-400 mb-6 italic tracking-widest">Sincronizar Nuevo Post</h3>
          <form onSubmit={save} className="space-y-4">
            <input placeholder="TÍTULO DEL CONTENIDO" value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="w-full p-5 rounded-3xl bg-slate-50 font-black border-2 border-slate-100 text-lg uppercase outline-none focus:border-blue-600 transition-all" required />
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-slate-50 p-4 rounded-[30px] border-2 border-slate-100">
                  <p className="text-[10px] font-black text-blue-600 mb-1 text-center">VISTAS</p>
                  <input placeholder="0" value={form.views} onChange={e => setForm({...form, views: e.target.value})} className="bg-transparent w-full text-3xl font-black text-center outline-none" required />
               </div>
               <div className="bg-slate-50 p-4 rounded-[30px] border-2 border-slate-100">
                  <p className="text-[10px] font-black text-green-600 mb-1 text-center">CAJA $</p>
                  <input placeholder="0" value={form.revenue} onChange={e => setForm({...form, revenue: e.target.value})} className="bg-transparent w-full text-3xl font-black text-center outline-none" required />
               </div>
            </div>
            <button className="w-full p-6 rounded-[35px] font-black uppercase text-2xl shadow-xl bg-[#003566] text-white active:scale-95 transition-all italic tracking-tighter">GUARDAR REGISTRO 🚀</button>
          </form>
        </section>

        {/* BITÁCORA (EL REGRESO DE LOS GIGANTES) */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-[#003566] uppercase text-center italic tracking-widest border-b-8 border-blue-600 pb-4 mx-10">Bitácora</h2>
          {data.map(d => (
            <div key={d.id} className="p-6 bg-white rounded-[45px] shadow-xl border border-slate-100 flex flex-col gap-4 relative overflow-hidden active:bg-blue-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-[#003566] w-20 h-20 rounded-[25px] flex flex-col items-center justify-center text-white shadow-2xl shrink-0 border-b-8 border-blue-900">
                    <span className="text-4xl font-black italic leading-none">{d.date.split("-")[2]}</span>
                    <span className="text-[10px] font-bold uppercase opacity-60">FEB</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase mb-1 tracking-widest">{d.format}</p>
                    <p className="text-2xl font-black text-[#003566] uppercase leading-none italic tracking-tighter">{d.topic}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-around bg-slate-50 p-4 rounded-[30px] border border-slate-100 mt-2">
                 <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Vistas</p>
                    <p className="text-4xl font-black text-slate-800 tracking-tighter">{Number(d.views) >= 1000000 ? (d.views/1000000).toFixed(1) + "M" : (d.views/1000).toFixed(1) + "K"}</p>
                 </div>
                 <div className="w-[2px] bg-slate-200 h-10 self-center"></div>
                 <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Caja</p>
                    <p className="text-4xl font-black text-green-600 italic tracking-tighter">${Number(d.revenue).toFixed(2)}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}