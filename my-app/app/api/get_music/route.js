import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const musicId = searchParams.get("musicId");

        if (!musicId) {
            return NextResponse.json({ error: 'MusicID is required' }, { status: 400 });
        }

        const music = await prisma.MusicTable.findFirst({
            where: {
                MusicID: musicId,
            },
        });

        if (!music) {
            return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
        }

        return NextResponse.json({ music });
    } catch (e) {
        console.error("Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}