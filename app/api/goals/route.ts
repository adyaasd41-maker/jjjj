import { z } from 'zod';import { prisma } from '@/lib/prisma';import { fail, ok } from '@/lib/api';import { requireUser } from '@/lib/auth';
const schema=z.object({name:z.string(),targetAmount:z.number().positive(),currentAmount:z.number().nonnegative().default(0)});
export async function GET(){try{const u=await requireUser();return ok(await prisma.savingsGoal.findMany({where:{userId:u.id}}))}catch{return fail('Нэвтрэх шаардлагатай',401)}}
export async function POST(req:Request){try{const u=await requireUser();const b=schema.parse(await req.json());return ok(await prisma.savingsGoal.create({data:{userId:u.id,...b}}))}catch{return fail('Зорилго хадгалж чадсангүй',400)}}
