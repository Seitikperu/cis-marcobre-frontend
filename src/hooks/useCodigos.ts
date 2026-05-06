'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CodigoActividad } from '@/lib/types/database.types'

export function useCodigos() {
  const [codigos, setCodigos] = useState<CodigoActividad[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('codigos_actividad')
      .select('*')
      .eq('activo', true)
      .order('codigo')
      .then(({ data }) => {
        if (data) setCodigos(data)
      })
  }, [])

  const byCategoria = {
    ACTIVIDAD_OPERATIVA:  codigos.filter(c => c.categoria === 'ACTIVIDAD_OPERATIVA'),
    DEMORA_OPERATIVA_1:   codigos.filter(c => c.categoria === 'DEMORA_OPERATIVA_1'),
    DEMORA_OPERATIVA_2:   codigos.filter(c => c.categoria === 'DEMORA_OPERATIVA_2'),
    DEMORA_MANTENIMIENTO: codigos.filter(c => c.categoria === 'DEMORA_MANTENIMIENTO'),
  }

  return { codigos, byCategoria }
}
