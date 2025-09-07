import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = waitlistSchema.parse(body);

    // In a real implementation, you would:
    // 1. Save to your database
    // 2. Send confirmation email
    // 3. Add to email marketing service (Mailchimp, ConvertKit, etc.)
    
    // For now, we'll simulate a successful response
    console.log('Waitlist signup:', validatedData);
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist',
      data: {
        email: validatedData.email,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Waitlist signup error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid input data',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to join waitlist. Please try again.',
        },
      },
      { status: 500 }
    );
  }
}