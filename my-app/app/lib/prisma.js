import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Prisma() {
    try {
        const newUser = await prisma.user.create({
            data: {
                email: 'alice@example.com',
                name: 'Alice',
            },
        });
        consoler.log(newUser);
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
    }

}