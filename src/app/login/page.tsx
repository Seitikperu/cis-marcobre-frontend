'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.session) {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
      setLoading(false)
      return
    }

    // Guardar sesión y forzar recarga completa del servidor
    // El servidor leerá las cookies sb-* que Supabase acaba de escribir
    window.location.replace('/proyectos')
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0B1E3D' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(160deg, #1A4B8C 0%, #0B1E3D 55%)',
          clipPath: 'polygon(0 0, 58% 0, 42% 100%, 0 100%)',
        }}/>
        <div className="absolute" style={{
          top: '35%', right: '6%', width: '280px', height: '280px',
          border: '1px solid rgba(200,154,30,0.1)', borderRadius: '50%',
          boxShadow: '0 0 0 55px rgba(200,154,30,0.03), 0 0 0 110px rgba(200,154,30,0.015)',
        }}/>
      </div>

      {/* Panel izquierdo */}
      <div className="relative z-10 hidden lg:flex flex-col justify-between flex-1 p-14">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center font-condensed font-extrabold text-xl"
            style={{ background: '#C89A1E', color: '#0B1E3D' }}>A</div>
          <div>
            <div className="font-condensed font-bold text-white text-lg tracking-widest uppercase">AESA</div>
            <div className="text-xs tracking-widest uppercase" style={{ color: '#C89A1E' }}>Infraestructura y Minería</div>
          </div>
        </div>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs tracking-widest uppercase mb-7"
            style={{ background: 'rgba(200,154,30,0.1)', border: '1px solid rgba(200,154,30,0.2)', color: '#E8B82A' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8B82A]"/>Operaciones Mineras
          </div>
          <h1 className="font-condensed font-bold text-white uppercase leading-none mb-6"
            style={{ fontSize: 'clamp(44px,5vw,68px)', letterSpacing: '-1px' }}>
            Sistema de<br/><span style={{ color: '#C89A1E' }}>Reportes</span><br/>de Equipos
          </h1>
          <p className="text-base leading-relaxed max-w-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Control y trazabilidad de perforación, mantenimiento y demoras
            operativas para todas las flotas de equipos mineros en tiempo real.
          </p>
          <div className="flex gap-10 mt-10">
            {[['5','Proyectos'],['5','Flotas'],['3','Roles']].map(([n,l]) => (
              <div key={l}>
                <div className="font-condensed font-bold text-3xl leading-none" style={{ color: '#E8B82A' }}>{n}</div>
                <div className="text-xs uppercase tracking-wider mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs tracking-wider" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © {new Date().getFullYear()} AESA · Todos los derechos reservados
        </p>
      </div>

      {/* Panel derecho */}
      <div className="relative z-10 flex items-center justify-center w-full lg:w-[460px] p-8"
        style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-full max-w-sm animate-fade-up">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-condensed font-extrabold text-base"
              style={{ background: '#C89A1E', color: '#0B1E3D' }}>A</div>
            <span className="font-condensed font-bold text-white tracking-widest text-base uppercase">AESA</span>
          </div>

          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#5A6B80' }}>Acceso al sistema</p>
          <h2 className="font-condensed font-semibold text-white text-3xl mb-8">Iniciar sesión</h2>

          <div className="flex items-center gap-2 rounded-lg px-3 py-2 mb-6 text-xs"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#E05B2B' }}/>
            Plataforma centralizada · AESA / MARCOBRE
          </div>

          {error && (
            <div className="rounded-lg px-4 py-3 mb-4 text-sm"
              style={{ background: 'rgba(185,28,28,0.12)', border: '1px solid rgba(185,28,28,0.25)', color: '#FCA5A5' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#5A6B80' }}>
                Correo electrónico
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="usuario@aesa.com.pe" required autoComplete="email"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', borderRadius: '8px', padding: '11px 14px', fontSize: '13px',
                  width: '100%', outline: 'none' }}/>
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#5A6B80' }}>
                Contraseña
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required autoComplete="current-password"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', borderRadius: '8px', padding: '11px 14px', fontSize: '13px',
                  width: '100%', outline: 'none' }}/>
            </div>
            <button type="submit" disabled={loading}
              className="w-full font-condensed font-bold uppercase tracking-widest text-sm py-3 rounded-lg transition-all duration-150 mt-2"
              style={{ background: loading ? '#9A7818' : '#C89A1E', color: '#0B1E3D',
                cursor: loading ? 'wait' : 'pointer', border: 'none' }}>
              {loading ? 'Verificando...' : 'Ingresar al sistema'}
            </button>
          </form>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <span className="text-xs tracking-wider" style={{ color: 'rgba(255,255,255,0.2)' }}>v1.0.0 · 2025</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>¿Sin acceso? Contacta al admin</span>
          </div>
        </div>
      </div>
    </div>
  )
}
