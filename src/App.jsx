import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://stenaxhdsfxrzhetetiz.supabase.co";
const supabaseAnonKey = "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = [
  { value: "Foto", label: "Foto", icon: "🖼️" },
  { value: "Reels", label: "Reels", icon: "🎬" },
  { value: "Enlaces", label: "Enlaces", icon: "🔗" },
  { value: "Historias", label: "Historias", icon: "📱" }
];

const ENERO_DATA = [
  { day: 1, date: "2026-01-01", views: 0.76, revenue: 7.85, topic: "🚫 PROHIBIDO QUEJARSE EN ESTE 2026", format: "Foto" },
  { day: 2, date: "2026-01-02", views: 0.78, revenue: 8.04, topic: "🚨 ¡LA TIERRA SE MOVIÓ, PERO DIOS ES NUESTRA ROCA!", format: "Foto" },
  { day: 3, date: "2026-01-03", views: 2.01, revenue: 20.83, topic: "NOTICIA DE ÚLTIMA HORA: TRUMP", format: "Foto" },
  { day: 4, date: "2026-01-04", views: 0.78, revenue: 12.8, topic: "😭 MATARON A MI HIJO Y QUEMARON MI IGLESIA", format: "Foto" },
  { day: 5, date: "2026-01-05", views: 13.07, revenue: 103.96, topic: "😭 NO GRITARON DE MIEDO... SUSURRARON EL NOMBRE DE JESÚS", format: "Foto" },
  { day: 6, date: "2026-01-06", views: 6.24, revenue: 51.84, topic: "😭 DE RODILLAS ESPERANDO EL FIN...", format: "Foto" },
  { day: 7, date: "2026-01-07", views: 5.3, revenue: 44.32, topic: "💔 ¿CUÁNTAS BIBLIAS TIENES EN TU CASA QUE NO ABRES?", format: "Foto" },
  { day: 8, date: "2026-01-08", views: 6.86, revenue: 61.68, topic: "💔🇪🇨 LLEGARON CON ENGAÑOS", format: "Foto" },
  { day: 9, date: "2026-01-09", views: 4.32, revenue: 45.48, topic: "50 AÑOS DE CÁRCEL POR ORAR? 😱", format: "Reels" },
  { day: 10, date: "2026-01-10", views: 5.3, revenue: 37.98, topic: "⚠️ PREFIERE LA MUERTE ANTES QUE VER A SUS HIJOS", format: "Foto" },
  { day: 11, date: "2026-01-11", views: 9.19, revenue: 84.27, topic: "🏟️ CALIFORNIA: 50,000 ALMAS", format: "Foto" },
  { day: 12, date: "2026-01-12", views: 3.22, revenue: 31.96, topic: "⚠️ IRÁN SE HA CONVERTIDO EN UN VALLE DE LÁGRIMAS", format: "Foto" },
  { day: 13, date: "2026-01-13", views: 2.02, revenue: 22.29, topic: "🌊 🇧🇷 CREÍAN QUE ESTABA SOLO CONTRA EL MAR", format: "Foto" },
  { day: 14, date: "2026-01-14", views: 2.06, revenue: 21.54, topic: "😭 ¿SU DELITO? QUERER UN FUTURO MEJOR", format: "Foto" },
  { day: 15, date: "2026-01-15", views: 2.68, revenue: 23.74, topic: "🚨 CHINA ENVÍA FUERZAS ESPECIALES", format: "Foto" },
  { day: 16, date: "2026-01-16", views: 0.93, revenue: 8.16, topic: "🛑 LE DIJERON QUE SU CÁNCER ERA TERMINAL", format: "Foto" },
  { day: 17, date: "2026-01-17", views: 7.51, revenue: 60.45, topic: "😭 NOS ATARON LAS MANOS... Y CERRAMOS LOS OJOS", format: "Foto" },
  { day: 18, date: "2026-01-18", views: 2.93, revenue: 25.13, topic: "🚫 LÉELO ANTES DE PONER UNA EXCUSA PARA NO IR AL CULTO", format: "Foto" },
  { day: 19, date: "2026-01-19", views: 4.59, revenue: 43.14, topic: "🛑 LA ORDEN DE DISPARAR YA ESTABA DADA...", format: "Foto" },
  { day: 20, date: "2026-01-20", views: 4.53, revenue: 46.21, topic: "🚫 IBA A DARLE MUERTE ... PERO ALGUIEN SE INTERPUSO", format: "Foto" },
  { day: 21, date: "2026-01-21", views: 2.13, revenue: 16.41, topic: "¡ESTABA ATADO, GOLPEADO Y A PUNTO DE MORIR...", format: "Foto" },
  { day: 22, date: "2026-01-22", views: 1.08, revenue: 9.99, topic: "¡MIENTRAS EL MUNDO LO NIEGA, UNA NACIÓN ENTERA", format: "Foto" },
  { day: 23, date: "2026-01-23", views: 1.09, revenue: 12.67, topic: "¡LA PEOR OLA EN 30 AÑOS... PRISIÓN", format: "Foto" },
  { day: 24, date: "2026-01-24", views: 2.02, revenue: 21.03, topic: "😱¡YA ESTABAN ALINEADOS FRENTE AL POZO...", format: "Foto" },
  { day: 25, date: "2026-01-25", views: 8.32, revenue: 70.59, topic: "ELLOS PAGAN CON SANGRE POR IR AL CULTO...", format: "Foto" },
  { day: 26, date: "2026-01-26", views: 4.76, revenue: 41.61, topic: "LA POLICÍA DIJO AQUÍ NO PASA NADA...", format: "Foto" },
  { day: 27, date: "2026-01-27", views: 3.05, revenue: 27.5, topic: "EL GOLPE EN LA PUERTA QUE TODA FAMILIA TEME", format: "Foto" },
  { day: 28, date: "2026-01-28", views: 1.56, revenue: 14.83, topic: "SU PROFESOR LE ORDENÓ: ESCONDE ESA CRUZ", format: "Foto" },
  { day: 29, date: "2026-01-29", views: 1.19, revenue: 10.86, topic: "DORMÍAN TRANQUILOS... Y DESPERTARON EN LA ETERNIDAD", format: "Foto" },
  { day: 30, date: "2026-01-30", views: 0.95, revenue: 11.47, topic: "¿QUIÉNES ERAN ESOS HOMBRES?", format: "Foto" },
  { day: 31, date: "2026-01-31", views: 1.83, revenue: 21.2, topic: "DICEN QUE EN CALIFORNIA YA NO CREEN EN DIOS...", format: "Foto" }
];

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("02");
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: "", views: "", interactions: "", followers: "", format: "Reels", topic: ""
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: metrics, error } = await supabase.from("metrics").select("*").order('date', { ascending: false });
      if (error) throw error;
      setData(metrics || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const saveData = async (e) => {
    e.preventDefault();
    try {
      await supabase.from("metrics").insert([{
        ...formData,
        revenue: parseFloat(formData.revenue) || 0,
        views: (parseFloat(formData.views) || 0) * 1000000,
        interactions: (parseFloat(formData.interactions) || 0) * 1000,
        followers: parseFloat(formData.followers) || 0,
        topic: formData.topic.toUpperCase()
      }]);
      setFormData({ ...formData, revenue: "", views: "", interactions: "", followers: "", topic: "" });
      loadData();
    } catch (err) { alert("Error al guardar"); }
  };

  const deleteRow = async (id) => {
    if(window.confirm("¿BORRAR REGISTRO?")) {
      await supabase.from("metrics").delete().eq('id', id);
      loadData();
    }
  };

  const todayDay = new Date().getDate();
  const sameDayEnero = ENERO_DATA.find(item => item.day === todayDay);
  const filteredData = data.filter(item => item.date.split("-")[1] === activeTab);

  const totalRevenue = filteredData.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
  const daysInMonth = new Date(2026, parseInt(activeTab), 0).getDate();
  const daysPassed = activeTab === "02" ? new Date().getDate() : daysInMonth;
  const daysLeft = daysInMonth - daysPassed;
  const dailyTarget = (1250 - totalRevenue) / (daysLeft || 1);

  return (
    <div className="min-h-screen bg-slate-200 font-sans text-slate-900 border-[12px] border-[#003566]">
      
      {/* HEADER ELITE */}
      <header className="bg-[#003566] text-white p-6 shadow-2xl flex justify-between items-center border-b-4 border-slate-400">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">IBIELE <span className="text-slate-400">INTEL</span></h1>
          <p className="text-[10px] font-bold tracking-widest opacity-70 uppercase">{time.toLocaleTimeString()} • COMANDO AGUASCALIENTES</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black opacity-50 uppercase">Revenue {activeTab === "02" ? "Feb" : "Ene"}</p>
          <p className="text-3xl font-black text-green-400">${totalRevenue.toFixed(2)}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* INTELIGENCIA HISTÓRICA (AZUL & PLATA) */}
        {activeTab === "02" && sameDayEnero && (
          <section className="bg-[#001d3d] p-1 rounded-[40px] shadow-2xl border-2 border-slate-400 overflow-hidden">
            <div className="bg-slate-800/50 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-slate-200 text-[#003566] p-4 rounded-2xl font-black text-2xl shadow-inner">0{todayDay}</div>
                <div>
                  <h2 className="text-slate-200 font-black text-xl uppercase tracking-tighter italic">Referencia Enero 2026</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase">{sameDayEnero.topic}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center min-w-[100px]">
                   <p className="text-[9px] font-black text-slate-500 uppercase">Caja</p>
                   <p className="text-xl font-black text-green-400">${sameDayEnero.revenue}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center min-w-[100px]">
                   <p className="text-[9px] font-black text-slate-500 uppercase">Vistas</p>
                   <p className="text-xl font-black text-blue-400">{sameDayEnero.views}M</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#003566] text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              Sugerencia Operativa: Duplicar formato {sameDayEnero.format} hoy mismo.
            </div>
          </section>
        )}

        {/* REGISTRO TÁCTICO */}
        <section className="bg-white rounded-[40px] shadow-xl p-8 border-2 border-slate-300">
          <form onSubmit={saveData} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Fecha</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 border-2 font-bold outline-none focus:border-[#003566]" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Vistas (Millones)</label>
              <input placeholder="0.00" type="number" step="0.01" value={formData.views} onChange={(e) => setFormData({...formData, views: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 border-2 font-bold outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Caja (USD)</label>
              <input placeholder="0.00" type="number" step="0.01" value={formData.revenue} onChange={(e) => setFormData({...formData, revenue: e.target.value})} className="w-full p-4 rounded-2xl bg-green-50 border-2 border-green-200 font-black text-green-700 outline-none" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Titular de Noticia</label>
              <input placeholder="NOMBRE DE LA PUBLICACIÓN" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 border-2 font-bold uppercase outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Formato</label>
              <select value={formData.format} onChange={(e) => setFormData({...formData, format: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 border-2 font-bold outline-none">
                {FORMATS.map(f => <option key={f.value} value={f.value}>{f.icon} {f.label}</option>)}
              </select>
            </div>
            <button type="submit" className="md:col-span-3 bg-[#003566] p-6 rounded-[35px] text-white font-black text-2xl shadow-xl hover:bg-slate-800 transition-all italic">SINCRONIZAR IMPERIO 🚀</button>
          </form>
        </section>

        {/* BITÁCORA (AZUL & PLATA) */}
        <section className="bg-white rounded-[40px] shadow-2xl p-8 border-2 border-slate-300">
          <div className="flex justify-between items-center mb-8 border-b-4 border-slate-100 pb-4">
            <h2 className="text-3xl font-black text-[#003566] uppercase italic tracking-tighter">Historial de Mando</h2>
            <div className="bg-slate-200 p-2 rounded-2xl flex gap-2">
              <button onClick={() => setActiveTab("02")} className={`px-6 py-2 rounded-xl font-black transition ${activeTab === "02" ? "bg-[#003566] text-white" : "text-slate-500"}`}>FEBRERO</button>
              <button onClick={() => setActiveTab("01")} className={`px-6 py-2 rounded-xl font-black transition ${activeTab === "01" ? "bg-[#003566] text-white" : "text-slate-500"}`}>ENERO</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[#003566] text-[10px] font-black uppercase tracking-widest">
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Titular</th>
                  <th className="p-4">Vistas</th>
                  <th className="p-4">Caja</th>
                  <th className="p-4 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {(activeTab === "01" ? ENERO_DATA : filteredData).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-400">{item.date.split("-").reverse().slice(0,2).join("/")}</td>
                    <td className="p-4 font-black text-[#003566] uppercase truncate max-w-xs italic">{item.topic}</td>
                    <td className="p-4 font-black text-blue-600">{activeTab === "01" ? `${item.views}M` : `${(item.views/1000000).toFixed(2)}M`}</td>
                    <td className="p-4 font-black text-green-600 text-xl">${Number(item.revenue).toFixed(2)}</td>
                    <td className="p-4 text-right">
                       {activeTab === "02" && <button onClick={() => deleteRow(item.id)} className="text-red-400 hover:text-red-600">🗑️</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* PROYECCIÓN (VERDE & AZUL) */}
        <section className="bg-[#003566] p-8 rounded-[50px] shadow-2xl text-white border-b-[12px] border-slate-400">
          <h2 className="text-2xl font-black italic uppercase text-center mb-8 opacity-40">Proyección de Crecimiento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="text-center bg-white/5 p-8 rounded-3xl border border-white/10">
               <p className="text-[10px] font-black opacity-50 uppercase mb-2 tracking-widest">Meta Diaria</p>
               <p className="text-5xl font-black italic text-green-400">${dailyTarget > 0 ? dailyTarget.toFixed(2) : "0.00"}</p>
             </div>
             <div className="text-center bg-white/5 p-8 rounded-3xl border border-white/10">
               <p className="text-[10px] font-black opacity-50 uppercase mb-2 tracking-widest">Días Restantes</p>
               <p className="text-5xl font-black italic text-blue-300">{daysLeft}</p>
             </div>
             <div className="text-center bg-white/5 p-8 rounded-3xl border border-white/10">
               <p className="text-[10px] font-black opacity-50 uppercase mb-2 tracking-widest">Ingreso Actual</p>
               <p className="text-5xl font-black italic text-slate-200">${totalRevenue.toFixed(2)}</p>
             </div>
          </div>
        </section>

      </main>
    </div>
  );
}