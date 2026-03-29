import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const rotasProtegidas = ["/minha-conta", "/reserva"];
  const rotasAdmin = ["/admin"];

  const precisaLogin = rotasProtegidas.some((r) => pathname.startsWith(r));
  const precisaAdmin = rotasAdmin.some((r) => pathname.startsWith(r));

  // Por enquanto deixa passar, vamos adicionar auth depois
  if (precisaLogin || precisaAdmin) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};