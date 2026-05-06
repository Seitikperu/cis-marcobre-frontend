'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/proyectos', label: 'Proyectos',  icon: '◈' },
]

export default function Sidebar() {
  const pathname = usePathname()

  // Detectar proyecto activo
  const parts = pathname.split('/').filter(Boolean)
  const proyecto = parts[0] !== 'proyectos' ? parts[0] : null

  const proyectoNav = proyecto
    ? [
        { href: `/${proyecto}`,             label: 'Dashboard',  icon: '▤' },
        { href: `/${proyecto}/reportes`,     label: 'Reportes',   icon: '☰' },
        { href: `/${proyecto}/reportes/nuevo`, label: 'Nuevo Reporte', icon: '+' },
      ]
    : []

  return (
    <aside
      className="w-14 flex flex-col items-center py-4 gap-1 flex-shrink-0"
      style={{ background: '#0B1E3D', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {[...NAV, ...proyectoNav].map(({ href, label, icon }) => {
        const active = pathname === href || (href !== '/proyectos' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            title={label}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-base transition-all duration-150"
            style={{
              background: active ? 'rgba(200,154,30,0.15)' : 'transparent',
              color: active ? '#E8B82A' : 'rgba(255,255,255,0.35)',
              border: active ? '1px solid rgba(200,154,30,0.25)' : '1px solid transparent',
            }}
          >
            {icon}
          </Link>
        )
      })}
    </aside>
  )
}
