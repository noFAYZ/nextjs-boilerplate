import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = 'a15aef02-d9b8-4cb7-b23b-53cafb1883cd';

// Validation schema
const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50).optional(),
  lastName: z.string().min(1, 'Last name is required').max(50).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = waitlistSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Validation failed',
            details: validationResult.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { email, firstName, lastName } = validationResult.data;

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Email service is not configured. Please try again later.',
          },
        },
        { status: 500 }
      );
    }

    // Add contact to Resend audience
    const contact = await resend.contacts.create({
      email,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      unsubscribed: false,
      audienceId: AUDIENCE_ID,
    });

    // Check if contact creation was successful
    if (!contact.data) {
      throw new Error('Failed to add contact to audience');
    }

    // Log success (in production, consider using a proper logging service)
    console.log(`Contact added to waitlist: ${email}`, {
      contactId: contact.data.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          contactId: contact.data.id,
          message: 'Successfully joined the waitlist!',
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle specific Resend errors
    if (error.name === 'ResendError') {
      console.error('Resend API error:', error);

      // Check for duplicate email error
      if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'This email is already on the waitlist.',
            },
          },
          { status: 409 }
        );
      }

      // Handle rate limiting
      if (error.statusCode === 429) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Too many requests. Please try again later.',
            },
          },
          { status: 429 }
        );
      }

      // Handle invalid API key
      if (error.statusCode === 401 || error.statusCode === 403) {
        console.error('Invalid Resend API key');
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Email service authentication failed. Please contact support.',
            },
          },
          { status: 500 }
        );
      }
    }

    // Log the error for debugging
    console.error('Waitlist API error:', error);

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'Failed to join waitlist. Please try again later.',
        },
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const isConfigured = !!process.env.RESEND_API_KEY;

  return NextResponse.json({
    status: isConfigured ? 'operational' : 'misconfigured',
    service: 'waitlist',
    timestamp: new Date().toISOString(),
  });
}
