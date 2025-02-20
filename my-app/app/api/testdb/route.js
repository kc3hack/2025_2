import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        const { Name, Email } = await req.json();
        const user = await prisma.UserTable.create({
            data: {
                EmailAdd: Email,
                UserName: Name,
            }
        });
        await prisma.$disconnect();
        return NextResponse.json(user);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function GET(req, res) {
    try {
        const users = await prisma.UserTable.findMany();
        await prisma.$disconnect();
        return NextResponse.json(users);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}