const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('Testing ap-northeast-1 pooler connection...');
  const p = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://postgres.xlewftzyvsyhpktgizlz:SqG%29%2B%248X35X%40hJf@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres',
      },
    },
  });

  try {
    await p.$connect();
    console.log('🎉 SUCCESS! Connected to Supabase DB in ap-northeast-1!');
    await p.$disconnect();
  } catch (e) {
    console.error('❌ Failed:', e.message);
    await p.$disconnect();
  }
}

testConnection();
