import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const contactFormSchema = z.object({
  subject: z.string().min(1, 'Onderwerp is verplicht').max(200),
  message: z.string().min(10, 'Bericht moet minimaal 10 karakters bevatten').max(2000),
  urgency: z.enum(['normal', 'high']).default('normal'),
});

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = contactFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Validatie fout' },
        { status: 400 }
      );
    }

    const { subject, message, urgency } = validation.data;

    // Get user profile for full name
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    }

    const fullName = userProfile?.full_name || 'Onbekende gebruiker';

    // Update user's profile to mark they've contacted for conversion
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ contacted_for_conversion: true })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      // Don't fail the request if this update fails
    }

    // Send email notification to admin via Resend
    try {
      const urgencyColor = urgency === 'high' ? '#dc3545' : '#28a745';
      const urgencyLabel = urgency === 'high' ? 'Hoog' : 'Normaal';

      const emailHtml = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nieuw contact formulier - DoBbie</title>
  <style>
    body {
      font-family: 'Open Sans', Arial, sans-serif;
      line-height: 1.6;
      color: #3D3D3D;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #F5F2EB;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #771138;
      margin-bottom: 10px;
    }
    .subtitle {
      color: #707070;
      font-size: 16px;
    }
    .content {
      margin-bottom: 30px;
    }
    .info-box {
      background-color: #F8F9FA;
      border: 1px solid #E9ECEF;
      padding: 20px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .urgency-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      color: white;
      background-color: ${urgencyColor};
    }
    .message-box {
      background-color: #F5F2EB;
      border-left: 4px solid #771138;
      padding: 20px;
      margin: 20px 0;
      border-radius: 0 5px 5px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #E5E5E5;
      color: #707070;
      font-size: 14px;
    }
    .info-row {
      margin-bottom: 10px;
    }
    .info-label {
      font-weight: bold;
      color: #771138;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">DoBbie</div>
      <div class="subtitle">Contact Formulier</div>
    </div>

    <div class="content">
      <h2>Nieuw contact formulier ontvangen</h2>

      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Van:</span> ${fullName} (${user.email})
        </div>
        <div class="info-row">
          <span class="info-label">Gebruiker ID:</span> ${user.id}
        </div>
        <div class="info-row">
          <span class="info-label">Onderwerp:</span> ${subject}
        </div>
        <div class="info-row">
          <span class="info-label">Urgentie:</span>
          <span class="urgency-badge">${urgencyLabel}</span>
        </div>
      </div>

      <div class="message-box">
        <h3>Bericht:</h3>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>

      <p><strong>Actie vereist:</strong> Beantwoord dit bericht direct door te reageren op deze e-mail.</p>
    </div>

    <div class="footer">
      <p>DoBbie - Jouw Verzuimbuddy | Admin Notificatie</p>
    </div>
  </div>
</body>
</html>
      `;

      await resend.emails.send({
        from: 'DoBbie <noreply@dobbie-mail.ikbenlit.nl>',
        to: 'talar@dobbie.nl',
        subject: `[DoBbie Contact] ${subject}`,
        html: emailHtml,
        replyTo: user.email || undefined,
      });
    } catch (emailError) {
      console.error('Error sending email via Resend:', emailError);
      // We don't block the user if email fails
      // In production, you might want to queue this for retry
    }

    return NextResponse.json({
      success: true,
      message: 'Bericht succesvol verzonden. We nemen zo snel mogelijk contact met je op.',
    });
  } catch (error) {
    console.error('Server error in contact form:', error);
    return NextResponse.json({ error: 'Server fout' }, { status: 500 });
  }
}
