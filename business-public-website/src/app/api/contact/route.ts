import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sanitizeText, sanitizePhoneNumber } from '@/lib/sanitizer';

// Zod Validation Schema for Website Contact Form
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  age: z.union([z.number(), z.string()]).optional().nullable(),
  service: z.string().min(1, 'Please select a service category'),
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

    const { name, phone, email, age, service, message } = validation.data;

    // 3. Sanitize & Parse Inputs
    const cleanName = sanitizeText(name);
    const cleanPhone = sanitizePhoneNumber(phone);
    const cleanEmail = email ? sanitizeText(email).toLowerCase() : null;
    const cleanMessage = sanitizeText(message || '');
    
    const parsedAge = age ? parseInt(String(age), 10) : null;
    const cleanAge = (parsedAge && !isNaN(parsedAge) && parsedAge >= 18 && parsedAge <= 99) ? parsedAge : null;

    // 4. Prisma ORM Transaction (Upsert Customer & Create Enquiry)
    const customer = await prisma.customer.upsert({
      where: { phone: cleanPhone },
      update: {
        name: cleanName,
        email: cleanEmail || undefined,
        age: cleanAge || undefined,
      },
      create: {
        phone: cleanPhone,
        name: cleanName,
        email: cleanEmail,
        age: cleanAge,
      },
    });

    const enquiry = await prisma.enquiry.create({
      data: {
        customerId: customer.id,
        source: 'website',
        service: service,
        message: cleanMessage || `Enquiry from website contact form for ${service}`,
        age: cleanAge,
        status: 'NEW',
        syncedToSheet: false,
      } as any,
    });

    // Check count of pending unsynced enquiries in Supabase
    try {
      const pendingCount = await prisma.enquiry.count({
        where: { syncedToSheet: false } as any,
      });

      if (pendingCount >= 4) {
        // Trigger batch sync endpoint safely without blocking response
        const adminHost = process.env.ADMIN_PANEL_URL || 'http://localhost:3000';
        fetch(`${adminHost}/api/admin/trigger-sheet-export`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ forceSync: false }),
        }).catch(() => {
          // Failure leaves lead safely pending in Supabase for manual Sync Now or next batch
        });
      }
    } catch (err) {
      // Ignored: lead remains safely pending in Supabase
    }

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
