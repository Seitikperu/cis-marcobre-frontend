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

  if (error) {
    return { error: `Auth Error: ${error.message} (Status: ${error.status})` }
  }

  if (!data?.session) {
    return { error: 'Success but NO SESSION returned by Supabase!' }
  }

  // If we reach here, login was successful and session exists.
  // Instead of redirecting immediately, let's return a special string
  // so the UI knows it succeeded.
  return { error: `SUCCESS! User ID: ${data.user.id}. Session: YES. Try navigating manually.` }
}
