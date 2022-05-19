import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request, event){

    const { pathname } = request.nextUrl 
    const token = await getToken({req: request, secret: process.env.JWT_SECRET})

    if (pathname.includes('/api/auth') || token){
        return NextResponse.next()
    }
    
    // if client does not have token and is requesting a protected route, redirect to login page.
    if(!token && pathname !== '/login'){
        return NextResponse.redirect(new URL('/login', request.url))
    }


}