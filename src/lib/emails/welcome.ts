/**
 * Welkomstmail template voor nieuwe abonnementen
 */

interface WelcomeEmailData {
  userName: string;
  plan: 'solo' | 'team';
  billing: 'monthly' | 'yearly';
  amount: number;
  currency: string;
  discountCode?: string | null;
  discountAmount?: number | null;
  originalPrice?: number | null;
  loginUrl: string;
}

/**
 * Format plan naam voor display
 */
function getPlanDisplayName(plan: 'solo' | 'team', billing: 'monthly' | 'yearly'): string {
  const planName = plan === 'solo' ? 'Solo' : 'Team';
  const billingName = billing === 'monthly' ? 'Maandelijks' : 'Jaarlijks';
  return `${planName} ${billingName}`;
}

/**
 * Format prijs voor display
 */
function formatPrice(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Genereer welkomstmail HTML template
 */
export function getWelcomeEmailTemplate(data: WelcomeEmailData): string {
  const planDisplayName = getPlanDisplayName(data.plan, data.billing);
  const hasDiscount = !!data.discountCode && !!data.discountAmount;
  const finalPrice = formatPrice(data.amount, data.currency);
  const originalPriceDisplay = data.originalPrice
    ? formatPrice(data.originalPrice, data.currency)
    : finalPrice;

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welkom bij DOBbie!</title>
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
    .success-box {
      background-color: #F0FDF4;
      border: 2px solid #22C55E;
      padding: 20px;
      border-radius: 5px;
      margin: 20px 0;
      text-align: center;
    }
    .success-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .info-box {
      background-color: #F8F9FA;
      border: 1px solid #E9ECEF;
      padding: 20px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #E9ECEF;
    }
    .info-row:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .info-label {
      font-weight: bold;
      color: #771138;
    }
    .discount-badge {
      display: inline-block;
      background-color: #22C55E;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      margin-left: 8px;
    }
    .cta-button {
      display: inline-block;
      background-color: #771138;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .cta-button:hover {
      background-color: #5a0d2a;
    }
    .tips-box {
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">DOBbie</div>
      <div class="subtitle">Jouw Verzuimbuddy</div>
    </div>

    <div class="content">
      <h1>Welkom bij DOBbie, ${data.userName}!</h1>
      
      <div class="success-box">
        <div class="success-icon">✓</div>
        <h2 style="margin: 0; color: #22C55E;">Betaling succesvol verwerkt!</h2>
        <p style="margin: 10px 0 0 0;">Je abonnement is geactiveerd en je hebt nu volledige toegang tot DOBbie.</p>
      </div>

      <div class="info-box">
        <h3 style="margin-top: 0; color: #771138;">Abonnementsdetails</h3>
        
        <div class="info-row">
          <span class="info-label">Abonnement:</span>
          <span>${planDisplayName}</span>
        </div>
        
        ${hasDiscount ? `
        <div class="info-row">
          <span class="info-label">Originele prijs:</span>
          <span>${originalPriceDisplay}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">Korting:</span>
          <span style="color: #22C55E; font-weight: bold;">
            -${formatPrice(data.discountAmount!, data.currency)}
            <span class="discount-badge">${data.discountCode}</span>
          </span>
        </div>
        ` : ''}
        
        <div class="info-row" style="border-top: 2px solid #771138; padding-top: 15px; margin-top: 10px;">
          <span class="info-label" style="font-size: 18px;">Betaald bedrag:</span>
          <span style="font-size: 18px; font-weight: bold; color: #771138;">${finalPrice}</span>
        </div>
      </div>

      <div class="tips-box">
        <h3 style="margin-top: 0; color: #771138;">Wat nu?</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Log in op je account om direct te beginnen</li>
          <li>Stel je eerste vraag aan DOBbie</li>
          <li>Ontdek alle functies van je nieuwe abonnement</li>
        </ul>
      </div>

      <div style="text-align: center;">
        <a href="${data.loginUrl}" class="cta-button">Start met DOBbie</a>
      </div>

      <p style="color: #707070; font-size: 14px;">
        Heb je vragen over je abonnement of DOBbie? Neem gerust contact met ons op via 
        <a href="mailto:talar@dobbie.nl" style="color: #771138;">talar@dobbie.nl</a>
      </p>
    </div>

    <div class="footer">
      <p>DOBbie - Jouw Verzuimbuddy</p>
      <p style="font-size: 12px; color: #999;">
        Deze email is automatisch gegenereerd. Je ontvangt deze omdat je een abonnement hebt afgesloten.
      </p>
    </div>
  </div>
</body>
</html>`;
}

