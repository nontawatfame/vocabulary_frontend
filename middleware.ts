/* eslint-disable @next/next/no-server-import-in-page */
import Head from 'next/head'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import * as authenticationService from './service/authentication'

export async function middleware(request: NextRequest) {
  console.log(authenticationService.isAuth)
  const url = request.nextUrl.clone()
  if (url.pathname == "/") {
    return NextResponse.redirect(new URL('/login', request.url))
  } else if (url.pathname == "/login") {
    if (authenticationService.isAuth == true) {
      return NextResponse.redirect(new URL('/vocabulary', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: [],
}