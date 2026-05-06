/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ReporteEquipo, TipoEquipo } from '@/lib/types/database.types'

export type DetalleRow = {
  item: number
  hora_inicio: string | null
  hora_final: string | null
  codigo_actividad_id: string | null
  brazo_izq_elec_inicial: number | null
  brazo_izq_elec_final: number | null
  brazo_der_elec_inicial: number | null
  brazo_der_elec_final: number | null
  nivel: string | null
  labor_id: string | null
  labor_descripcion: string | null
  material: 'M' | 'D' | null
  long_perf_pies: number | null
  n_tal_perforados: number | null
  n_tal_rimados: number | null
  n_viajes: number | null
  m3_acarreados: number | null
  observaciones: string | null
}

interface UseReporteOptions {
  minaId: string
  tipoReporte: TipoEquipo
  reporteId?: string
}

export function useReporte({ minaId, tipoReporte, reporteId }: UseReporteOptions) {
  const sb = createClient() as any
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [savedId, setSavedId] = useState<string | null>(reporteId ?? null)
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [cabecera, setCabecera] = useState<Partial<ReporteEquipo>>({
    tipo_reporte: tipoReporte,
    mina_id: minaId,
    turno: 'DIA',
    fecha: new Date().toISOString().split('T')[0],
    empresa: 'ADMINISTRACIÓN DE EMPRESAS S.A.C.',
  })

  const [detalle, setDetalle] = useState<DetalleRow[]>(
    Array.from({ length: 18 }, (_, i) => ({
      item: i + 1,
      hora_inicio: null, hora_final: null,
      codigo_actividad_id: null,
      brazo_izq_elec_inicial: null, brazo_izq_elec_final: null,
      brazo_der_elec_inicial: null, brazo_der_elec_final: null,
      nivel: null, labor_id: null, labor_descripcion: null,
      material: null, long_perf_pies: null,
      n_tal_perforados: null, n_tal_rimados: null,
      n_viajes: null, m3_acarreados: null,
      observaciones: null,
    }))
  )

  // Cargar reporte existente
  useEffect(() => {
    if (!reporteId) return
    ;(async () => {
      const { data: rep } = await sb.from('reportes_equipos').select('*').eq('id', reporteId).maybeSingle()
      if (rep) setCabecera(rep as Partial<ReporteEquipo>)

      const { data: det } = await sb.from('reporte_detalle_actividades').select('*').eq('reporte_id', reporteId).order('item')
      if (det && (det as any[]).length > 0) {
        setDetalle(prev => prev.map(row => {
          const found = (det as any[]).find((d: any) => d.item === row.item)
          return found ? { ...found } : row
        }))
      }
    })()
  }, [reporteId]) // eslint-disable-line

  const scheduleAutoSave = useCallback(() => {
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current)
    autoSaveRef.current = setTimeout(() => save('borrador'), 60000)
  }, []) // eslint-disable-line

  const updateCabecera = useCallback((updates: Partial<ReporteEquipo>) => {
    setCabecera(prev => ({ ...prev, ...updates }))
    scheduleAutoSave()
  }, [scheduleAutoSave])

  const updateDetalle = useCallback((item: number, updates: Partial<DetalleRow>) => {
    setDetalle(prev => prev.map(row => row.item === item ? { ...row, ...updates } : row))
    scheduleAutoSave()
  }, [scheduleAutoSave])

  const save = useCallback(async (estado: 'borrador' | 'enviado' = 'borrador') => {
    setStatus('saving')
    try {
      const payload: any = { ...cabecera, estado, tipo_reporte: tipoReporte, mina_id: minaId }
      let id = savedId

      if (id) {
        await sb.from('reportes_equipos').update(payload).eq('id', id)
      } else {
        const { data, error } = await sb.from('reportes_equipos').insert(payload).select('id').maybeSingle()
        if (error) throw error
        id = (data as any).id
        setSavedId(id)
      }

      // Upsert detalle — solo filas con datos
      const filasConDatos = detalle.filter(r => r.codigo_actividad_id || r.hora_inicio || r.long_perf_pies)
      if (filasConDatos.length > 0 && id) {
        await sb.from('reporte_detalle_actividades').upsert(
          filasConDatos.map((r: any) => ({ ...r, reporte_id: id })),
          { onConflict: 'reporte_id,item' }
        )
      }

      setStatus('saved')
      setTimeout(() => setStatus('idle'), 3000)
      return id
    } catch {
      setStatus('error')
      return null
    }
  }, [cabecera, detalle, savedId, tipoReporte, minaId, sb]) // eslint-disable-line

  const submit = useCallback(() => save('enviado'), [save])

  const resumen = {
    actividadesCount: detalle.filter(r => r.codigo_actividad_id).length,
    totalPies: detalle.reduce((s, r) => s + (r.long_perf_pies ?? 0), 0),
    totalTalPerf: detalle.reduce((s, r) => s + (r.n_tal_perforados ?? 0), 0),
    totalTalRim: detalle.reduce((s, r) => s + (r.n_tal_rimados ?? 0), 0),
    totalViajes: detalle.reduce((s, r) => s + (r.n_viajes ?? 0), 0),
    totalM3: detalle.reduce((s, r) => s + (r.m3_acarreados ?? 0), 0),
    horasMotor: (() => {
      const ini = cabecera.horometro_inicial ?? 0
      const fin = cabecera.horometro_final ?? 0
      return fin > ini ? (fin - ini).toFixed(1) : '—'
    })(),
  }

  return { cabecera, updateCabecera, detalle, updateDetalle, resumen, status, save, submit, savedId }
}
