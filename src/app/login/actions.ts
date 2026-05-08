'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) {
    return { error: 'Por favor, completa todos los campos.' }
  }

  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // Escribir log
  try {
    const fs = require('fs')
    const path = require('path')
    const logPath = path.join(process.cwd(), 'middleware-debug.log')
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ACTION: login attempt | Error: ${error?.message || 'NONE'} | User: ${data?.user?.id || 'NULL'} | Session: ${data?.session ? 'YES' : 'NO'}\n`)
  } catch(e) {}

  if (error) {
    return { error: 'Credenciales incorrectas. Verifica tu correo y contraseña.' }
  }

  redirect('/proyectos')
}
