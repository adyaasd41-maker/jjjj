import { z } from 'zod';import { prisma } from '@/lib/prisma';import { fail, ok } from '@/lib/api';import { requireUser } from '@/lib/auth';
const schema=z.object({name:z.string(),amount:z.number().positive(),interestRate:z.number().nonnegative(),monthlyPayment:z.number().positive(),remainingBalance:z.number().nonnegative(),dueDay:z.number().min(1).max(31).default(1)});
export async function GET(){try{const u=await requireUser();return ok(await prisma.loan.findMany({where:{userId:u.id}}))}catch{return fail('Нэвтрэх шаардлагатай',401)}}
export async function POST(req:Request){try{const u=await requireUser();const b=schema.parse(await req.json());return ok(await prisma.loan.create({data:{userId:u.id,...b}}))}catch{return fail('Зээл хадгалж чадсангүй',400)}}
