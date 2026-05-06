'use client'
import { useReporte } from '@/hooks/useReporte'
import EncabezadoForm from '@/components/reportes/shared/EncabezadoForm'
import HorometrosForm from '@/components/reportes/shared/HorometrosForm'
import ActividadesTable from '@/components/reportes/shared/ActividadesTable'
import CierreForm from '@/components/reportes/shared/CierreForm'
import type { Equipo, TipoEquipo } from '@/lib/types/database.types'
import { useRouter } from 'next/navigation'

interface Props {
  minaId: string
  proyecto: string
  tipo: TipoEquipo
  tipoLabel: string
  equipos: Equipo[]
  reporteId?: string
}

const ESTADO_STYLE = {
  idle:   { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', dot: '#9CA8B8', txt: 'Sin guardar' },
  saving: { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', dot: '#F59E0B', txt: 'Guardando...' },
  saved:  { bg: 'rgba(34,197,94,0.1)',    color: '#86EFAC',               dot: '#22C55E', txt: 'Guardado ✓' },
  error:  { bg: 'rgba(239,68,68,0.1)',    color: '#FCA5A5',               dot: '#EF4444', txt: 'Error al guardar' },
}

export default function ReporteForm({ minaId, proyecto, tipo, tipoLabel, equipos, reporteId }: Props) {
  const router = useRouter()
  const { cabecera, updateCabecera, detalle, updateDetalle, resumen, status, save, submit } = useReporte({
    minaId, tipoReporte: tipo, reporteId,
  })

  const est = ESTADO_STYLE[status]

  async function handleSubmit() {
    const req = [
      { v: cabecera.mina_id,    l: 'Mina' },
      { v: cabecera.fecha,      l: 'Fecha' },
      { v: cabecera.turno,      l: 'Turno' },
    ]
    for (const { v, l } of req) {
      if (!v) { alert(`Campo requerido: ${l}`); return }
    }
    const id = await submit()
    if (id) router.push(`/${proyecto}/reportes/${tipo.toLowerCase()}/${id}`)
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 pb-20">
      {/* Sub-topbar del formulario */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-2 rounded-lg"
        style={{ background: '#0B1E3D', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-xs font-condensed font-semibold uppercase tracking-wider px-3 py-1.5 rounded"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            ← Volver
          </button>
          <span className="font-condensed font-bold text-white text-sm uppercase tracking-widest">
            Nuevo Reporte · {tipoLabel}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Status pill */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{ background: est.bg, border: '1px solid rgba(255,255,255,0.08)', color: est.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: est.dot }} />
            {est.txt}
          </div>
          <button
            onClick={() => save('borrador')}
            className="text-xs font-condensed font-bold uppercase tracking-wider px-4 py-1.5 rounded"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            Guardar borrador
          </button>
          <button
            onClick={handleSubmit}
            className="text-xs font-condensed font-bold uppercase tracking-wider px-4 py-1.5 rounded"
            style={{ background: '#C89A1E', color: '#0B1E3D' }}
          >
            Enviar reporte ▶
          </button>
        </div>
      </div>

      {/* Sección 1: Encabezado */}
      <EncabezadoForm
        cabecera={cabecera}
        equipos={equipos}
        onChange={updateCabecera}
        tipoLabel={tipoLabel}
      />

      {/* Sección 2: Horómetros */}
      <HorometrosForm cabecera={cabecera} tipo={tipo} onChange={updateCabecera} />

      {/* Sección 3: Tabla de actividades */}
      <ActividadesTable detalle={detalle} tipo={tipo} onChange={updateDetalle} />

      {/* Sección 4: Cierre + firmas */}
      <CierreForm cabecera={cabecera} onChange={updateCabecera} resumen={resumen} />
    </div>
  )
}
