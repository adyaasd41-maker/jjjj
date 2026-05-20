import { z } from 'zod';import { prisma } from '@/lib/prisma';import { fail, ok } from '@/lib/api';import { requireUser } from '@/lib/auth';
const schema=z.object({category:z.string(),limitAmount:z.number().positive()});
export async function GET(){try{const u=await requireUser();return ok(await prisma.budget.findMany({where:{userId:u.id}}))}catch{return fail('Нэвтрэх шаардлагатай',401)}}
export async function POST(req:Request){try{const u=await requireUser();const b=schema.parse(await req.json());return ok(await prisma.budget.upsert({where:{userId_category:{userId:u.id,category:b.category}},update:{limitAmount:b.limitAmount},create:{userId:u.id,...b}}))}catch{return fail('Төсөв хадгалж чадсангүй',400)}}
