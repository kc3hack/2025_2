import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login", // 未ログイン時のリダイレクト先
    },
});

// 保護したいパスの指定
export const config = { matcher: ["/player/:path*", "/add/:path*", "/collection/:path*"] };
