"use client"
import { useSession } from "next-auth/react"
import Prisma from "../lib/prisma"

export default function Home() {
  const { data: session } = useSession();
  console.log(session);
  const token = session?.token?.access_token;

  return (
    <>
      <p>曲を登録するページ</p>
      <button onClick={Prisma}>登録</button>
    </>
  )
}