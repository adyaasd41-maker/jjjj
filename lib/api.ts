import { NextResponse } from 'next/server';
export function ok(data:any){return NextResponse.json(data)}
export function fail(message='Алдаа гарлаа',status=400){return NextResponse.json({error:message},{status})}
