import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();


export async function GET(req,res) {
    try {
        // クエリパラメータから email を取得
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

         // email が存在しない場合
         if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const musicid = await prisma.CollectionTable.findMany({
            where: {
                EmailAdd: email  
            },
            include: {
                music: true  // 関連する MusicTable のデータも取得
            }
        });

        console.log("Fetched data:", musicid); // デバッグ用

        if (!musicid || musicid.length === 0) {
            // データが空の場合のエラーハンドリング
            return NextResponse.json({ error: 'No data found' }, { status: 404 });
        }
        
        return NextResponse.json(musicid);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }finally {
        await prisma.$disconnect();
    }
}