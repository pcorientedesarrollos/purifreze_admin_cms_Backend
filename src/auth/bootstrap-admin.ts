import 'dotenv/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

async function bootstrap() {
  const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password || password.length < 5) {
    throw new Error('Set ADMIN_USERNAME and ADMIN_PASSWORD with at least 5 characters.');
  }
  const prisma = new PrismaService();
  const auth = new AuthService(prisma);
  const passwordHash = await auth.hashPassword(password);
  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });
  await prisma.$disconnect();
  console.log(`Admin account ready: ${username}`);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
