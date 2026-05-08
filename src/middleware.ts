import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data, error } = await supabase.auth.getUser()
  const user = data?.user
  
  // Escribir a un archivo local para depuración
  try {
    const fs = require('fs')
    const path = require('path')
    const logPath = path.join(process.cwd(), 'middleware-debug.log')
    const logLine = `[${new Date().toISOString()}] Path: ${request.nextUrl.pathname} | User: ${user?.id || 'NULL'} | Error: ${error?.message || 'NONE'} | Cookies: ${request.cookies.getAll().map(c => c.name).join(',')}\n`
    fs.appendFileSync(logPath, logLine)
  } catch (e) {}

  const { pathname } = request.nextUrl

  // Rutas públicas que no necesitan auth
  const publicPaths = ['/login', '/api/debug', '/_next', '/favicon']
  const isPublic = publicPaths.some(p => pathname.startsWith(p))

  // Si no tiene sesión y trata de acceder a ruta protegida → login
  if (!user && !isPublic) {
    console.log('Redirecting to /login because no user')
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si tiene sesión y va a /login → proyectos
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/proyectos'
    return NextResponse.redirect(url)
  }

  // CRÍTICO: devolver siempre supabaseResponse para que las cookies se propaguen
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
