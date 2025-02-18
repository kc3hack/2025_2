import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email } = req.body;
    try {
      const newUser = await prisma.user.upsert({
        where: { email },
        update: { name },
        create: { name, email },
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: 'Error saving user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
