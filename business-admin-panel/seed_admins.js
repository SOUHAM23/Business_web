const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Manually parse .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const prisma = new PrismaClient();

async function seedAdmins() {
  console.log('Seeding Super Admin users into Supabase admin_users table...');

  const superAdmins = [
    { email: 'tathyamitra2374@gmail.com', role: 'SUPER_ADMIN' },
    { email: 'souhamdutta23@gmail.com', role: 'SUPER_ADMIN' },
  ];

  for (const admin of superAdmins) {
    const record = await prisma.adminUser.upsert({
      where: { email: admin.email.toLowerCase() },
      update: {
        role: admin.role,
        active: true,
      },
      create: {
        email: admin.email.toLowerCase(),
        role: admin.role,
        active: true,
      },
    });
    console.log(`✅ SEEDED SUPER ADMIN: ${record.email} (Role: ${record.role})`);
  }

  await prisma.$disconnect();
}

seedAdmins().catch((err) => {
  console.error('Error seeding admins:', err);
  prisma.$disconnect();
});
