import bcrypt from 'bcryptjs';import { z } from 'zod';import { prisma } from '@/lib/prisma';import { fail, ok } from '@/lib/api';import { setSession } from '@/lib/auth';
const schema=z.object({email:z.string().email(),password:z.string().min(1)});
export async function POST(req:Request){const body=schema.parse(await req.json());const user=await prisma.user.findUnique({where:{email:body.email}});if(!user||!(await bcrypt.compare(body.password,user.password))) return fail('Имэйл эсвэл нууц үг буруу',401);await setSession(user.id);return ok({user:{id:user.id,email:user.email}})}
