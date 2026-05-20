import { z } from 'zod';import { prisma } from '@/lib/prisma';import { fail, ok } from '@/lib/api';import { requireUser } from '@/lib/auth';
const schema=z.object({date:z.string(),cash:z.number().nonnegative().default(0),card:z.number().nonnegative().default(0),qpay:z.number().nonnegative().default(0),note:z.string().optional()});
export async function GET(){try{const u=await requireUser();return ok(await prisma.cafeSale.findMany({where:{userId:u.id},orderBy:{date:'desc'},take:90}))}catch{return fail('Нэвтрэх шаардлагатай',401)}}
export async function POST(req:Request){try{const u=await requireUser();const b=schema.parse(await req.json());return ok(await prisma.cafeSale.create({data:{...b,date:new Date(b.date),userId:u.id}}))}catch{return fail('Борлуулалт хадгалж чадсангүй',400)}}
