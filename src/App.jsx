import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

/* ================== SUPABASE ================== */
const supabase = createClient(
  "https://stenaxhdsfxrzhetetiz.supabase.co",
  "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN"
)

/* ================== CONFIG ================== */
const FORMATS = ["🎬 Reels", "📸 Imagen", "📱 Historia", "✍️ Texto"]

/* ================== HELPERS ================== */
const toNumber = (v) => {
  if (!v) return 0
  return Number(String(v).replace(/,/g, ""))
}

const formatViews = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return n
}

/* ================== APP ================== */
export default function App() {
  const [auth, setAuth] = useState(false)
  const [pass, setPass] = useState("")
  const [data, setData] = useState([])
  const [time, setTime] = useState(new Date())
  const [simViews, setSimViews] = useState(1_000_000)

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    topic: "",
    format: "🎬 Reels",
    views: "",
    revenue: ""
  })

  /* ================== CLOCK ================== */
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  /* ================== LOAD ================== */
  const load = async () => {
    const { data } = await supabase
      .from("metrics")
      .select("*")
      .order("date", { ascending: false })
    if (data) setData(data)
  }

  useEffect(() => { if (auth) load() }, [auth])

  /* ================== METRICS ================== */
  const totalViews = data.reduce((a, b) => a + toNumber(b.views), 0)
  const totalRev = data.reduce((a, b) => a + toNumber(b.revenue), 0)
  const rpm = totalViews > 0 ? totalRev / totalViews : 0
  const estimated = simViews * rpm

  const health = data.length === 0
    ? 0
    : Math.min(
        Math.max(
          50 + (toNumber(data[0].revenue) > (totalRev / data.length) ? 25 : -15),
          0
        ),
        100
      )

  /* ================== SAVE ================== */
  const save = async (e) => {
    e.preventDefault()

    const payload = {
      date: form.date,
      topic: form.topic.trim(),
      format: form.format,
      views: toNumber(form.views),
      revenue: Number(form.revenue)
    }

    if (!payload.topic) return alert("Falta el titular")

    await supabase.from("metrics").insert([payload])

    setForm({
      date: new Date().toISOString().slice(0, 10),
      topic: "",
      format: "🎬 Reels",
      views: "",
      revenue: ""
    })

    load()
  }

  /* ================== LOGIN ================== */
  if (!auth) {
    return (
      <div className="min-h-screen bg-[#001d3d] flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-2xl text-center">
          <h1 className="text-3xl font-black text-[#003566] mb-6">IBIELE TV</h1>
          <input
            type="password"
            placeholder="CÓDIGO"
            className="w-full p-4 rounded-xl bg-slate-100 text-center font-bold mb-4"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <button
            onClick={() => pass === "IBIELE2026" ? setAuth(true) : alert("ERROR")}
            className="w-full bg-[#003566] text-white p-4 rounded-xl font-black"
          >
            ENTRAR
          </button>
        </div>
      </div>
    )
  }

  /* ================== UI ================== */
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 overflow-x-hidden">
      
      {/* HEADER */}
      <div className="bg-[#003566] text-white p-4 sticky top-0 z-50">
        <h1 className="text-xl font-black">IBIELE TV INTEL</h1>
        <p className="text-xs opacity-70">{time.toLocaleTimeString()}</p>
      </div>

      <div className="p-4 space-y-6 max-w-md mx-auto">

        {/* ORÁCULO */}
        <div className="bg-[#003566] text-white p-6 rounded-3xl shadow-xl">
          <p className="text-xs font-bold opacity-70 mb-2">🔮 Simulación</p>
          <p className="text-4xl font-black">{formatViews(simViews)} vistas</p>
          <input
            type="range"
            min="100"
            max="10000000"
            step="100"
            value={simViews}
            onChange={(e) => setSimViews(Number(e.target.value))}
            className="w-full mt-4"
          />
          <div className="bg-white/10 mt-4 p-4 rounded-2xl">
            <p className="text-xs opacity-70">Ganancia estimada</p>
            <p className="text-4xl font-black text-green-400">
              ${estimated.toFixed(2)}
            </p>
          </div>
        </div>

        {/* SALUD */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-xs font-bold opacity-60">Estado</p>
          <p className={`text-xl font-black ${health > 70 ? "text-green-600" : "text-red-600"}`}>
            {health}% {health > 70 ? "Firme" : "En riesgo"}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={save} className="bg-white p-4 rounded-2xl shadow space-y-3">
          <input type="date" value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="w-full p-3 bg-slate-100 rounded-xl font-bold"
          />
          <select value={form.format}
            onChange={e => setForm({ ...form, format: e.target.value })}
            className="w-full p-3 bg-slate-100 rounded-xl font-bold"
          >
            {FORMATS.map(f => <option key={f}>{f}</option>)}
          </select>
          <input placeholder="Titular"
            value={form.topic}
            onChange={e => setForm({ ...form, topic: e.target.value })}
            className="w-full p-3 bg-slate-100 rounded-xl font-bold"
          />
          <input placeholder="Vistas (ej: 2100 o 2000000)"
            value={form.views}
            onChange={e => setForm({ ...form, views: e.target.value })}
            className="w-full p-3 bg-slate-100 rounded-xl font-bold"
          />
          <input placeholder="Ingreso (ej: 0.10)"
            value={form.revenue}
            onChange={e => setForm({ ...form, revenue: e.target.value })}
            className="w-full p-3 bg-slate-100 rounded-xl font-bold"
          />
          <button className="w-full bg-[#003566] text-white p-4 rounded-xl font-black">
            GUARDAR 🚀
          </button>
        </form>

        {/* LISTA */}
        <div className="space-y-3">
          {data.map(d => (
            <div key={d.id} className="bg-white p-4 rounded-2xl shadow flex justify-between">
              <div>
                <p className="text-xs opacity-60">{d.format}</p>
                <p className="font-black">{d.topic}</p>
              </div>
              <div className="text-right">
                <p className="font-black">{formatViews(d.views)}</p>
                <p className="font-black text-green-600">${Number(d.revenue).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
