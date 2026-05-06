'use client'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Topbar({ user }: { user: User }) {
  const router = useRouter()
  const pathname = usePathname()

  // Extraer nombre del proyecto de la URL
  const proyectoSlug = pathname.split('/')[1]
  const proyectoNombre = proyectoSlug
    ? proyectoSlug.replace(/-/g, ' ').toUpperCase()
    : ''

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header
      className="flex items-center justify-between px-5 h-12 flex-shrink-0"
      style={{ background: '#0B1E3D', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center font-condensed font-extrabold text-sm flex-shrink-0"
          style={{ background: '#C89A1E', color: '#0B1E3D' }}
        >A</div>
        <span className="font-condensed font-semibold text-white text-sm tracking-wider">
          AESA · REPORTES
        </span>
        {proyectoNombre && (
          <>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
            <span
              className="text-xs px-2 py-0.5 rounded font-condensed font-semibold tracking-wider uppercase"
              style={{ background: 'rgba(200,154,30,0.15)', color: '#E8B82A' }}
            >
              {proyectoNombre}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs hidden sm:block" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {user.email}
        </span>
        <button
          onClick={handleLogout}
          className="text-xs px-3 py-1.5 rounded font-condensed font-semibold uppercase tracking-wider transition-all"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Salir
        </button>
      </div>
    </header>
  )
}
