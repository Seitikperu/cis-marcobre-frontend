/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const PROYECTO_META: Record<string, { color: string; icon: string; desc: string }> = {
  'SAN RAFAEL':  { color: '#1A4B8C', icon: '⛰', desc: 'Puno, Perú' },
  'MINA JUSTA':  { color: '#E05B2B', icon: '🪨', desc: 'Ica, Perú' },
  'RAURA':       { color: '#15803D', icon: '⛏', desc: 'Lima, Perú' },
  'CHUNGAR':     { color: '#7C3AED', icon: '🏔', desc: 'Pasco, Perú' },
  'CERRO LINDO': { color: '#B45309', icon: '⚙', desc: 'Ica, Perú' },
}

function slugify(nombre: string) {
  return nombre.toLowerCase().replace(/ /g, '-')
}

export default async function ProyectosPage() {
  const sb = createClient() as any
  const { data } = await sb.from('minas').select('id,nombre,ubicacion').eq('activo', true).order('nombre')
  const minas: any[] = data ?? []

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#5A6B80' }}>Bienvenido al sistema</p>
        <h1 className="font-condensed font-bold text-3xl uppercase tracking-wide" style={{ color: '#0B1E3D' }}>Selecciona un Proyecto</h1>
        <p className="text-sm mt-1" style={{ color: '#5A6B80' }}>Elige la unidad minera en la que operarás este turno</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {minas.map((mina) => {
          const nombre: string = mina.nombre ?? ''
          const meta = PROYECTO_META[nombre] ?? { color: '#0B1E3D', icon: '◈', desc: '' }
          const slug = slugify(nombre)
          return (
            <Link key={mina.id} href={`/${slug}`}
              className="group block rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              style={{ background: '#fff', border: '1px solid #C4CDD8' }}>
              <div className="h-2 w-full" style={{ background: meta.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{meta.icon}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wider"
                    style={{ background: `${meta.color}18`, color: meta.color }}>Activo</span>
                </div>
                <h2 className="font-condensed font-bold text-xl uppercase tracking-wide" style={{ color: '#0B1E3D' }}>{nombre}</h2>
                <p className="text-xs mt-1" style={{ color: '#5A6B80' }}>{meta.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-all" style={{ color: meta.color }}>
                  Ingresar
                  <span className="transition-transform group-hover:translate-x-1 duration-150">→</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
