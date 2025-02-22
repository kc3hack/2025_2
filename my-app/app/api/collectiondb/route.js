import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        // クエリパラメータから email と query を取得
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        const query = searchParams.get("query");

        // email が存在しない場合
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        console.log("Search Query:", query);  // デバッグ用ログ

        let whereCondition = {
            EmailAdd: email // ユーザーを特定
        };

        if (query) {
            whereCondition = {
                ...whereCondition,
                music: {
                    OR: [
                        { MusicName: { contains: query.trim() } },  // 曲名で検索
                        { ArtistName: { contains: query.trim() } }  // アーティスト名で検索
                    ]
                }
            };
        }

        const musicid = await prisma.CollectionTable.findMany({
            where: whereCondition,
            include: {
                music: true  // MusicTableのデータも取得
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
    } finally {
        await prisma.$disconnect();
    }
}