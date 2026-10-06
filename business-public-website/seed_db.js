const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const INITIAL_CONTENT = [
  {
    contentKey: 'founder_vision_badge',
    contentValue: 'Sukanta Dutta | AMFI-Registered MFD (ARN: 347438)',
    contentType: 'text',
  },
  {
    contentKey: 'founder_vision_quote',
    contentValue: '"Financial planning begins with understanding the person—not the product."',
    contentType: 'text',
  },
  {
    contentKey: 'founder_vision_description',
    contentValue:
      'With 15+ years of experience in Banking & Financial Services, we focus on helping clients plan for their important financial goals through a structured, personalized approach to Mutual Funds & SIPs, Retirement, and Family Protection.',
    contentType: 'text',
  },
  {
    contentKey: 'founder_vision_image_url',
    contentValue: '/cropped_prof_image1.png',
    contentType: 'image',
  },
  {
    contentKey: 'founder_vision_card1_icon',
    contentValue: '🎯',
    contentType: 'text',
  },
  {
    contentKey: 'founder_vision_card1_title',
    contentValue: 'Goal-Centric SIP Allocation',
    contentType: 'text',
  },
  {
    contentKey: 'founder_vision_card1_desc',
    contentValue: 'Personalized equity & debt mutual fund portfolios matched to your specific family milestones.',
    contentType: 'text',
  },
  {
    contentKey: 'founder_vision_card2_icon',
    contentValue: '🔍',
    contentType: 'text',
  },
  {
    contentKey: 'founder_vision_card2_title',
    contentValue: 'Strategy Before Product',
    contentType: 'text',
  },
  {
    contentKey: 'founder_vision_card2_desc',
    contentValue: 'Evaluating your risk profile, income, and existing commitments before suggesting financial solutions.',
    contentType: 'text',
  },
  {
    contentKey: 'founder_vision_card3_icon',
    contentValue: '🔄',
    contentType: 'text',
  },
  {
    contentKey: 'founder_vision_card3_title',
    contentValue: 'Structured 6-Step Framework',
    contentType: 'text',
  },
  {
    contentKey: 'founder_vision_card3_desc',
    contentValue: 'Understand → Plan → Invest → Protect → Review → Grow for long-term wealth creation.',
    contentType: 'text',
  },
  {
    contentKey: 'office_address',
    contentValue: 'House of PADA Sova, Uttar Kowgachi Feeder Road, Shyamnagar, North 24 Parganas, West Bengal, Pin-743127',
    contentType: 'text',
  },
];



async function seed() {
  console.log('Seeding updated business site_content into Supabase PostgreSQL...');

  for (const item of INITIAL_CONTENT) {
    await prisma.siteContent.upsert({
      where: { contentKey: item.contentKey },
      update: {
        contentValue: item.contentValue,
        contentType: item.contentType,
        isPublished: true,
      },
      create: {
        contentKey: item.contentKey,
        contentValue: item.contentValue,
        contentType: item.contentType,
        isPublished: true,
      },
    });
  }

  console.log('✅ SEED COMPLETED SUCCESSFULLY! All site_content keys updated with business copy.');
  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error('Seed Error:', err);
  prisma.$disconnect();
});
