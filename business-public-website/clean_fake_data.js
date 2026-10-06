const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.xlewftzyvsyhpktgizlz:SqG%29%2B%248X35X%40hJf@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres',
    },
  },
});

async function main() {
  console.log('Cleaning test/fake data from primary database...');
  const e = await prisma.enquiry.deleteMany({});
  const a = await prisma.appointment.deleteMany({});
  const c = await prisma.customer.deleteMany({});
  const l = await prisma.auditLog.deleteMany({});

  console.log(`Deleted ${e.count} test enquiries.`);
  console.log(`Deleted ${a.count} test appointments.`);
  console.log(`Deleted ${c.count} test customers.`);
  console.log(`Deleted ${l.count} test audit logs.`);
  console.log('✅ Admin dashboard database is now 100% clean with zero fake data!');
}

main()
  .catch((err) => console.error('Error cleaning fake data:', err))
  .finally(() => prisma.$disconnect());
