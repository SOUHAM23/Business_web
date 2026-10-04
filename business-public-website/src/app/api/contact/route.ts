import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sanitizeText, sanitizePhoneNumber } from '@/lib/sanitizer';

// Zod Validation Schema for Website Contact Form
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  service: z.enum([
    'SIP & Mutual Funds',
    'Insurance Solutions',
    'Loans & Credit Advisory',
    'Retirement & Wealth Management',
    'General Enquiry',
  ]),
  message: z.string().max(1000, 'Message cannot exceed 1000 characters').optional(),
});

// Simple In-Memory Rate Limiting
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export async function POST(req: NextRequest) {
  try {
    // 1. Rate-Limiting Protection
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const maxRequests = 5;

    const rateData = rateLimitMap.get(clientIp) || { count: 0, lastReset: now };
    if (now - rateData.lastReset > windowMs) {
      rateData.count = 0;
      rateData.lastReset = now;
    }

    if (rateData.count >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    rateData.count += 1;
    rateLimitMap.set(clientIp, rateData);

    // 2. Parse & Validate JSON Body
    const body = await req.json();
    const validation = contactFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, phone, email, service, message } = validation.data;

    // 3. Sanitize Inputs
    const cleanName = sanitizeText(name);
    const cleanPhone = sanitizePhoneNumber(phone);
    const cleanEmail = email ? sanitizeText(email).toLowerCase() : null;
    const cleanMessage = sanitizeText(message || '');

    // 4. Prisma ORM Transaction (Upsert Customer & Create Enquiry)
    const customer = await prisma.customer.upsert({
      where: { phone: cleanPhone },
      update: {
        name: cleanName,
        email: cleanEmail || undefined,
      },
      create: {
        phone: cleanPhone,
        name: cleanName,
        email: cleanEmail,
      },
    });

    const enquiry = await prisma.enquiry.create({
      data: {
        customerId: customer.id,
        source: 'website',
        service: service,
        message: cleanMessage || `Enquiry from website contact form for ${service}`,
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      enquiryId: enquiry.id,
      message: 'Thank you! Your enquiry has been received. Our team will contact you shortly.',
    });
  } catch (error: any) {
    console.error('API Contact Error:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
