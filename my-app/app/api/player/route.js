import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const blockNo = Number(searchParams.get('blockNo'));
    console.log(`No:${blockNo}`)
    try {
        const musics = await prisma.entryTable.findMany({
            where: {
                BlockNo: {
                    in: [
                        blockNo,
                        blockNo + 1,
                        blockNo - 1,
                        blockNo + 2700,
                        blockNo - 2700,
                        blockNo + 1 + 2700,
                        blockNo + 1 - 2700,
                        blockNo - 1 + 2700,
                        blockNo - 1 - 2700,
                    ],
                },
            },
            select: {
                Latitude: true,
                Longitude: true,
                music: {
                    select: {
                        MusicID: true,
                        MusicName: true,
                        ArtistName: true,
                        ImageUrl: true,
                        Duration: true,
                    },
                },
            },
        });
        await prisma.$disconnect();
        return NextResponse.json(musics);
    } catch (err) {
        console.error(err);
        return NextResponse.json([]);
    }


}