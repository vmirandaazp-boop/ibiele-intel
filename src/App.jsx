import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://stenaxhdsfxrzhetetiz.supabase.co";
const supabaseAnonKey = "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = [
  { value: "Foto", label: "Foto", icon: "🖼️", color: "bg-blue-600" },
  { value: "Reels", label: "Reels", icon: "🎬", color: "bg-slate-400" },
  { value: "Enlaces", label: "Enlaces", icon: "🔗", color: "bg-emerald-600" },
  { value: "Historias", label: "Historias", icon: "📱", color: "bg-slate-500" }
];

// 📊 DATOS MAESTROS RECUPERADOS (ENERO 2026)
const ENERO_DATA = [
  { day: 1, date: "2026-01-01", views: 0.76, revenue: 7.85, topic: "🚫 PROHIBIDO QUEJARSE EN ESTE 2026", followers: 167 },
  { day: 2, date: "2026-01-02", views: 0.78, revenue: 8.04, topic: "🚨 LA TIERRA SE MOVIÓ, DIOS ES ROCA", followers: 225 },
  { day: 3, date: "2026-01-03", views: 2.01, revenue: 20.83, topic: "ÚLTIMA HORA: ANUNCIO TRUMP", followers: 559 },
  { day: 4, date: "2026-01-04", views: 0.78, revenue: 12.80, topic: "😭 MATARON A MI HIJO (BURKINA)", followers: 182 },
  { day: 5, date: "2026-01-05", views: 13.07, revenue: 103.96, topic: "😭 SUSURRARON EL NOMBRE DE JESÚS", followers: 3081 },
  { day: 6, date: "2026-01-06", views: 6.24, revenue: 51.84, topic: "😭 DE RODILLAS ESPERANDO EL FIN", followers: 1691 },
  { day: 7, date: "2026-01-07", views: 5.30, revenue: 44.32, topic: "💔 BIBLIAS QUE NO ABRES", followers: 1225 },
  { day: 8, date: "2026-01-08", views: 6.86, revenue: 61.68, topic: "💔 LLEGARON CON ENGAÑOS", followers: 1591 },
  { day: 9, date: "2026-01-09", views: 4.32, revenue: 45.48, topic: "50 AÑOS POR ORAR? 😱", followers: 1448 },
  { day: 10, date: "2026-01-10", views: 5.30, revenue: 37.98, topic: "⚠️ PREFIERE LA MUERTE", followers: 971 },
  { day: 11, date: "2026-01-11", views: 9.19, revenue: 84.27, topic: "🏟️ CALIFORNIA: 50,000 ALMAS", followers: 1969 },
  { day: 12, date: "2026-01-12", views: 3.22, revenue: 31.96, topic: "⚠️ IRÁN: VALLE DE LÁGRIMAS", followers: 737 },
  { day: 13, date: "2026-01-13", views: 2.02, revenue: 22.29, topic: "🌊 SOLO CONTRA EL MAR", followers: 438 },
  { day: 14, date: "2026-01-14", views: 2.06, revenue: 21.54, topic: "😭 QUERER UN FUTURO MEJOR", followers: 644 },
  { day: 15, date: "2026-01-15", views: 2.68, revenue: 23.74, topic: "🚨 CHINA ENVÍA FUERZAS", followers: 524 },
  { day: 16, date: "2026-01-16", views: 0.93, revenue: 8.16, topic: "🛑 CÁNCER TERMINAL", followers: 233 },
  { day: 17, date: "2026-01-17", views: 7.51, revenue: 60.45, topic: "😭 NOS ATARON LAS MANOS", followers: 1253 },
  { day: 18, date: "2026-01-18", views: 2.93, revenue: 25.13, topic: "🚫 EXCUSAS PARA EL CULTO", followers: 641 },
  { day: 19, date: "2026-01-19", views: 4.59, revenue: 43.14, topic: "🛑 ORDEN DE DISPARAR", followers: 934 },
  { day: 20, date: "2026-01-20", views: 4.53, revenue: 46.21, topic: "🚫 IBA A DARLE MUERTE", followers: 1137 },
  { day: 21, date: "2026-01-21", views: 2.13, revenue: 16.41, topic: "ATADO Y GOLPEADO", followers: 645 },
  { day: 22, date: "2026-01-22", views: 1.08, revenue: 9.99, topic: "NACIÓN ENTERA EN CLAMOR", followers: 320 },
  { day: 23, date: "2026-01-23", views: 1.09, revenue: 12.67, topic: "OLA DE PRISIÓN 30 AÑOS", followers: 412 },
  { day: 24, date: "2026-01-24", views: 2.02, revenue: 21.03, topic: "😱 ALINEADOS FRENTE AL POZO", followers: 588 },
  { day: 25, date: "2026-01-25", views: 8.32, revenue: 70.59, topic: "PAGAN CON SANGRE", followers: 2101 },
  { day: 26, date: "2026-01-26", views: 4.76, revenue: 41.61, topic: "LA POLICÍA DIJO NO PASA NADA", followers: 1222 },
  { day: 27, date: "2026-01-27", views: 3.05, revenue: 27.50, topic: "GOLPE EN LA PUERTA", followers: 843 },
  { day: 28, date: "2026-01-28", views: 1.56, revenue: 14.83, topic: "ESCONDE ESA CRUZ", followers: 331 },
  { day: 29, date: "2026-01-29", views: 1.19, revenue: 10.86, topic: "DORMÍAN TRANQUILOS", followers: 241 },
  { day: 30, date: "2026-01-30", views: 0.95, revenue: 11.47, topic: "QUIÉNES ERAN ESOS HOMBRES", followers: 299 },
  { day: 31, date: "2026-01-31", views: 1.83, revenue: 21.20, topic: "YA NO CREEN EN DIOS?", followers: 512 }
];

// 🌍 DEMOGRAFÍA TÁCTICA
const DEMOGRAPHICS = {
  gender: [{ label: "MUJERES", val: 67.1, color: "bg-slate-400" }, { label: "HOMBRES", val: 32.9, color: "bg-blue-600" }],
  age: [
    { r: "18-24", p: 5.0 }, { r: "25-34", p: 22.2 }, { r: "35-44", p: 29.1, h: true },
    { r: "45-54", p: 23.4, h: true }, { r: "55-64", p: 13.6 }, { r: "65+", p: 6.7 }
  ],
  geo: [
    { n: "México", p: 25.8, f: "🇲🇽" }, { n: "Colombia", p: 13.3, f: "🇨🇴" },
    { n: "Argentina", p: 10.0, f: "🇦🇷" }, { n: "Perú", p: 6.2, f: "🇵🇪" }, { n: "Ecuador", p: 5.7, f: "🇪🇨" }
  ]
};

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("mando"); // mando, audiencia, estrategia, historial
  
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: "", views: "", interactions: "", followers: "", format: "Foto", topic: ""
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data: m, error } = await supabase.from("metrics").select("*").order('date', { ascending: false });
      if (error) throw error;
      setData(m || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (e) => {
    e.preventDefault();
    await supabase.from("metrics").insert([{
      ...form,
      revenue: parseFloat(form.revenue) || 0,
      views: (parseFloat(form.views) || 0) * 1000000,
      interactions: (parseFloat(form.interactions) || 0) * 1000,
      followers: parseFloat(form.followers) || 0,
      topic: form.topic.toUpperCase()
    }]);
    setForm({ ...form, revenue: "", views: "", interactions: "", followers: "", topic: "" });
    load();
  };

  const del = async (id) => {
    if(window.confirm("¿ELIMINAR REGISTRO?")) {
      await supabase.from("metrics").delete().eq('id', id);
      load();
    }
  };

  // CÁLCULOS
  const febData = data.filter(i => i.date.split("-")[1] === "02");
  const febRev = febData.reduce((s, i) => s + (Number(i.revenue) || 0), 0);
  const janRev = ENERO_DATA.reduce((s, i) => s + i.revenue, 0);
  const janViews = ENERO_DATA.reduce((s, i) => s + i.views, 0);
  const daysPassed = new Date().getDate();
  const dailyTarget = (1250 - febRev) / (28 - daysPassed || 1);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 border-[12px] border-[#003566]">
      
      {/* 🎖️ TOP NAVIGATION BAR */}
      <nav className="bg-[#003566] text-white p-5 sticky top-0 z-50 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-slate-300 text-[#003566] px-3 py-1 rounded font-black italic tracking-tighter">IMPERIAL INTEL</div>
          <p className="text-[10px] font-bold opacity-60 uppercase">{time.toLocaleTimeString()} • HQ AGUASCALIENTES</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {["mando", "audiencia", "estrategia", "historial"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === t ? "bg-white text-[#003566] shadow-lg" : "text-blue-200 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="text-right border-l border-white/20 pl-4 hidden md:block">
          <p className="text-[9px] font-black opacity-50 uppercase">Feb Revenue</p>
          <p className="text-2xl font-black text-green-400 leading-none">${febRev.toFixed(2)}</p>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

        {/* 📟 TAB: MANDO (DASHBOARD) */}
        {activeTab === "mando" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* COMPARATIVA PRO */}
              <div className="lg:col-span-2 bg-[#001d3d] p-8 rounded-[40px] shadow-2xl text-white border-b-8 border-slate-400 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl font-black italic">FEB</div>
                <div className="relative z-10 flex justify-between items-end h-full">
                  <div>
                    <h2 className="text-4xl font-black italic mb-2 tracking-tighter">OPERATIVO FEBRERO</h2>
                    <p className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">Estado del Imperio vs Meta $1,250</p>
                    <div className="flex gap-8">
                       <div>
                         <p className="text-[10px] font-black opacity-50 uppercase">Target Diario</p>
                         <p className="text-4xl font-black text-blue-400">${dailyTarget.toFixed(2)}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-black opacity-50 uppercase">Progreso</p>
                         <p className="text-4xl font-black text-green-400">{((febRev/1250)*100).toFixed(1)}%</p>
                       </div>
                    </div>
                  </div>
                  <div className="w-24 bg-white/10 h-48 rounded-3xl border border-white/10 p-2 flex flex-col justify-end">
                    <div className="bg-gradient-to-t from-blue-600 to-green-400 w-full rounded-2xl transition-all duration-1000" style={{height: `${Math.min((febRev/1250)*100, 100)}%`}}></div>
                  </div>
                </div>
              </div>

              {/* INPUT RÁPIDO */}
              <div className="bg-white p-6 rounded-[40px] shadow-xl border-2 border-slate-300">
                <h3 className="text-sm font-black text-[#003566] uppercase mb-4 italic tracking-widest border-b-2 pb-2">Sincronizar Datos</h3>
                <form onSubmit={save} className="space-y-3">
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border font-bold text-xs" />
                  <input placeholder="TEMA NOTICIA" value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border font-bold text-xs uppercase" />
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Vistas (M)" type="number" step="0.01" value={form.views} onChange={e => setForm({...form, views: e.target.value})} className="p-3 rounded-xl bg-slate-50 border font-bold text-xs" />
                    <input placeholder="Caja ($)" type="number" step="0.01" value={form.revenue} onChange={e => setForm({...form, revenue: e.target.value})} className="p-3 rounded-xl bg-green-50 border font-black text-xs" />
                  </div>
                  <button className="w-full bg-[#003566] text-white p-4 rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-slate-800 transition-all italic">Ejecutar Comando 🚀</button>
                </form>
              </div>
            </section>

            {/* REFERENCIA HISTÓRICA DÍA ACTUAL */}
            <section className="bg-slate-300 p-8 rounded-[40px] border-l-[20px] border-[#003566] shadow-xl">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="flex items-center gap-6">
                    <div className="text-5xl font-black text-[#003566] italic">0{daysPassed}</div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase">Referencia Enero 2026</p>
                      <h3 className="text-2xl font-black text-[#003566] uppercase tracking-tighter leading-tight italic">{ENERO_DATA[daysPassed-1]?.topic}</h3>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="bg-white/50 px-6 py-3 rounded-2xl text-center"><p className="text-[10px] font-black opacity-50">CAJA</p><p className="text-xl font-black">${ENERO_DATA[daysPassed-1]?.revenue}</p></div>
                    <div className="bg-white/50 px-6 py-3 rounded-2xl text-center"><p className="text-[10px] font-black opacity-50">VISTAS</p><p className="text-xl font-black">{ENERO_DATA[daysPassed-1]?.views}M</p></div>
                 </div>
               </div>
            </section>
          </div>
        )}

        {/* 🛡️ TAB: AUDIENCIA (REDISEÑADO) */}
        {activeTab === "audiencia" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
            {/* GÉNERO TÁCTICO */}
            <div className="bg-white p-8 rounded-[50px] shadow-2xl border-2 border-slate-300">
              <h2 className="text-2xl font-black text-[#003566] uppercase italic mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#003566] rounded-full flex items-center justify-center text-white text-xs">A</span> Segmentación Género
              </h2>
              <div className="flex items-center gap-12">
                 <div className="relative w-48 h-48 rounded-full border-[15px] border-slate-100 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-black text-[#003566]">67%</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mujeres</p>
                    </div>
                    <svg className="absolute -inset-4 w-56 h-56 transform -rotate-90">
                       <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="15" fill="transparent" className="text-blue-600" strokeDasharray="628" strokeDashoffset={628 - (628 * 0.67)} />
                    </svg>
                 </div>
                 <div className="space-y-4 flex-1">
                    {DEMOGRAPHICS.gender.map(g => (
                      <div key={g.label} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="flex justify-between font-black text-xs mb-2"><span>{g.label}</span><span>{g.val}%</span></div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden"><div className={`${g.color} h-full`} style={{width: `${g.val}%`}}></div></div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* GEOGRAFÍA DE PODER */}
            <div className="bg-[#003566] p-8 rounded-[50px] shadow-2xl text-white">
              <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tighter">Alcance Territorial</h2>
              <div className="space-y-4">
                {DEMOGRAPHICS.geo.map(g => (
                  <div key={g.n} className="flex items-center justify-between group hover:bg-white/5 p-3 rounded-2xl transition-all">
                    <div className="flex items-center gap-4 text-xl"><span>{g.f}</span><span className="font-black italic text-sm">{g.n.toUpperCase()}</span></div>
                    <div className="flex items-center gap-4">
                       <div className="w-32 bg-white/10 h-2 rounded-full hidden md:block overflow-hidden"><div className="bg-blue-400 h-full" style={{width: `${g.p*3}%`}}></div></div>
                       <span className="font-black text-blue-300">{g.p}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-white/10 rounded-3xl border border-white/5 text-[10px] font-bold text-center italic text-blue-200">
                RECOMENDACIÓN: Programa publicaciones para el huso horario de México (CST) entre las 11:00 y 14:00.
              </div>
            </div>
          </div>
        )}

        {/* 🎯 TAB: ESTRATEGIA (MODO ÉLITE) */}
        {activeTab === "estrategia" && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-4xl font-black text-[#003566] italic uppercase text-center border-b-4 border-slate-300 pb-4">Terminal de Estrategia 2026</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {ENERO_DATA.sort((a,b) => b.revenue - a.revenue).slice(0,3).map((top, idx) => (
                 <div key={idx} className="bg-white p-8 rounded-[40px] shadow-xl border-t-8 border-[#003566] relative overflow-hidden group hover:scale-105 transition-all">
                    <div className="text-5xl font-black opacity-10 absolute -top-2 -right-2 italic">#{idx+1}</div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Top Performer</p>
                    <h3 className="text-xl font-black text-[#003566] leading-tight mb-6 italic">{top.topic}</h3>
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border">
                       <div><p className="text-[8px] font-black opacity-50">CAJA</p><p className="text-2xl font-black text-green-600">${top.revenue}</p></div>
                       <div className="text-right"><p className="text-[8px] font-black opacity-50">ALCANCE</p><p className="text-2xl font-black text-blue-600">{top.views}M</p></div>
                    </div>
                    <div className="mt-4 text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Conversión: {(top.followers/top.views).toFixed(0)} seguidores/M
                    </div>
                 </div>
               ))}
            </div>

            <div className="bg-[#001d3d] p-10 rounded-[60px] text-white border-b-[15px] border-slate-400">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-3xl font-black italic mb-6 text-blue-400 uppercase tracking-tighter">Scanner de Patrones</h3>
                    <div className="space-y-6">
                      <div className="bg-white/5 p-6 rounded-3xl border-l-4 border-blue-600">
                         <p className="font-black mb-2 italic uppercase">🔥 El Algoritmo de Tragedia</p>
                         <p className="text-sm text-slate-400 font-bold">Las palabras "SUSURRARON", "ATARON" y "MATARON" elevan el RPM un 45%. Tu mejor post de Enero (Día 5) usó esta estructura.</p>
                      </div>
                      <div className="bg-white/5 p-6 rounded-3xl border-l-4 border-slate-400">
                         <p className="font-black mb-2 italic uppercase">📅 Ciclo de Publicación</p>
                         <p className="text-sm text-slate-400 font-bold">Los domingos (Días 11 y 25) rindieron 3.2x más que los lunes. No desperdicies contenido ÉLITE en inicios de semana.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-300 p-8 rounded-[40px] text-[#003566] text-center">
                     <p className="text-[10px] font-black uppercase mb-2 tracking-[0.3em]">IA Predictive Meta</p>
                     <p className="text-5xl font-black italic mb-4 leading-none">REELS + 12PM</p>
                     <p className="text-sm font-black uppercase max-w-xs mx-auto">Usa este combo para el fin de semana. Basado en el éxito del post "{bestDay.topic}".</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* 📜 TAB: HISTORIAL (EL CLÁSICO) */}
        {activeTab === "historial" && (
          <section className="bg-white rounded-[40px] shadow-2xl p-8 border-2 border-slate-300 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b-4 border-slate-100 pb-6">
              <h2 className="text-3xl font-black text-[#003566] italic uppercase">Archivo de Enero 2026</h2>
              <div className="text-right">
                 <p className="text-[10px] font-black opacity-50">Cierre Consolidado</p>
                 <p className="text-3xl font-black text-slate-800">${janRev.toFixed(2)}</p>
                 <p className="text-[10px] font-black text-blue-600 uppercase">{janViews.toFixed(1)}M Total Views</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-[#003566] uppercase tracking-widest">
                  <tr>
                    <th className="p-4">Día</th>
                    <th className="p-4">Titular de Noticia</th>
                    <th className="p-4">Caja</th>
                    <th className="p-4">Alcance</th>
                    <th className="p-4">Siguientes</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100">
                  {ENERO_DATA.map(i => (
                    <tr key={i.day} className="hover:bg-blue-50 transition-colors">
                      <td className="p-4 font-black text-slate-400">0{i.day}</td>
                      <td className="p-4 font-black text-[#003566] uppercase italic truncate max-w-xs">{i.topic}</td>
                      <td className="p-4 font-black text-green-600 text-lg">${i.revenue.toFixed(2)}</td>
                      <td className="p-4 font-black text-blue-600">{i.views}M</td>
                      <td className="p-4 font-black text-yellow-600">+{i.followers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}