import { NextResponse, type NextRequest } from 'next/server'

// Middleware simplificado — sin verificación de sesión en Edge
// La protección de rutas se maneja en cada layout de servidor
export async function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
