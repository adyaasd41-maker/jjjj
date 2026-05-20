import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');
export async function signSession(userId:string){return new SignJWT({userId}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('30d').sign(secret)}
export async function getUser(){
  const token=(await cookies()).get('finance_token')?.value; if(!token) return null;
  try{const {payload}=await jwtVerify(token,secret); return prisma.user.findUnique({where:{id:String(payload.userId)},select:{id:true,email:true}})}catch{return null}
}
export async function requireUser(){const user=await getUser(); if(!user) throw new Error('UNAUTHORIZED'); return user;}
export async function setSession(userId:string){(await cookies()).set('finance_token',await signSession(userId),{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30})}
