import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(req, res) {
  const users = await prisma.userTable.findMany();
  console.log(users);
  return NextResponse.json(users);
  // const user = await prisma.userTable.create({
  //   data: {
  //     UserName: "Alice",
  //     EmailAdd: "alice@gmail.com",
  //   },
  // });
  // return NextResponse.json(user);
}
