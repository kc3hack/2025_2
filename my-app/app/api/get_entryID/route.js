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

        const entry = await prisma.EntryTable.findFirst({
            where: {
                MusicID: musicId,
            },
            select: {
                EntryID: true,
            },
        });

        if (!entry) {
            return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
        }

        return NextResponse.json({ entryId: entry.EntryID });
    } catch (e) {
        console.error("Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}