import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `SET: ${process.env.NEXT_PUBLIC_SUPABASE_URL.slice(0, 35)}...`
      : 'NOT SET - variables de entorno faltantes',
    supabase_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? `SET: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 20)}...`
      : 'NOT SET - variables de entorno faltantes',
    node_env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}
