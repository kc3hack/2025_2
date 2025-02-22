import NextAuth from "next-auth/next";
import SpotifyProvider from "next-auth/providers/spotify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const options = {
    providers: [
        SpotifyProvider({
            authorization:
                'https://accounts.spotify.com/authorize?scope=user-read-email,user-read-private,user-read-playback-state,user-modify-playback-state,user-read-currently-playing',
            clientId: process.env.SPOTIFY_CLIENT_ID || '',
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.access_token = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            try {
                await prisma.userTable.upsert({
                    where: { EmailAdd: session.user.email },
                    update: { UserName: session.user.name },
                    create: {
                        EmailAdd: session.user.email,
                        UserName: session.user.name,
                    },
                });
                console.log('ログインに成功!');
            } catch (error) {
                console.error('ログインに失敗または、ユーザデータの保存に失敗しました:', error.message);
            }
            return {
                ...session,
                token,
            };
        },
    }
}
const handler = NextAuth(options);

export { handler as GET, handler as POST };