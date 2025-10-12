import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, recommendations, profile } = body;

    // Format the email content
    const emailContent = `
New Onboarding Submission
========================

User Information:
-----------------
Name: ${profile?.fullName || 'Not provided'}
Address: ${profile?.address || 'Not provided'}

Onboarding Answers:
-------------------
Project Type: ${answers.projectType || 'Not specified'}
Purpose: ${answers.purpose || 'Not specified'}
Budget: ${answers.budget || 'Not specified'}
Urgency: ${answers.urgency || 'Not specified'}
Size: ${answers.size || 'Not specified'}
Bedrooms: ${answers.bedrooms || 'Not specified'}
Parking: ${answers.parking || 'Not specified'}
Style Preferences: ${Array.isArray(answers.style) ? answers.style.join(', ') : 'Not specified'}
Priorities: ${Array.isArray(answers.priorities) ? answers.priorities.join(', ') : 'Not specified'}
Financing Options: ${Array.isArray(answers.financing) ? answers.financing.join(', ') : 'Not specified'}

Recommended Models:
-------------------
${recommendations?.matches?.map((model: any, index: number) => 
  `${index + 1}. ${model.name} (Score: ${model.matchScore}%)`
).join('\n') || 'No recommendations'}

Insights:
---------
${recommendations?.insights?.join('\n') || 'No insights'}

---
Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}
    `.trim();

    // Send email using Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Используем onboarding@resend.dev пока домен не верифицирован
    // После верификации домена, замените на: onboarding@adu-seattle.com
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ADU Seattle <onboarding@seattle-adu.com>',
        to: ['Office@seattle-adu.com'],
        reply_to: 'Office@seattle-adu.com',
        subject: `New Onboarding Submission - ${profile?.fullName || 'Guest User'}`,
        text: emailContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Failed to send email:', data);
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, emailId: data.id });
  } catch (error) {
    console.error('Error sending onboarding email:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

