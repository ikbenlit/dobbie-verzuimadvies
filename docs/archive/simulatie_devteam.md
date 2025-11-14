Teamgesprek: Bouwplan Review
Lead Dev (Sarah): "We bespreken het MVP Checkout Flow plan. Doel: trial uitschakelen en directe checkout voor nieuwe en expired users. Wie begint?"
Frontend Dev (Mike): "Ik begin met Epic 2 en 3. Epic 2: na registratie auto-login en redirect naar checkout. Ik zie dat we supabase.auth.signUp() direct gebruiken in de component. Vraag: wat als email confirmation aan staat? Het plan zegt dat we dan naar login redirecten met een redirect parameter, maar hoe testen we dat?"
Backend Dev (Alex): "Goede vraag. Epic 3.S3 beschrijft de login redirect, maar ik zie een potentieel probleem: in de code example gebruiken we window.location.href voor redirect. Als de redirect URL query parameters bevat, worden die behouden, maar wat als de user al ingelogd is en naar checkout gaat? Dan triggert de auth check niet."
Frontend Dev: "Klopt. In Epic 3 staat dat checkout geen protected route is in middleware, dus we doen een client-side check. Maar als iemand direct naar /checkout gaat terwijl ze al ingelogd zijn, werkt dat dan?"
Lead Dev: "Laten we dat verifiëren. Epic 3.S1 zegt 'check auth status bij mount'. Als de user al ingelogd is, doet de check niets en blijft de checkout pagina werken. Dat klopt. Volgende punt?"
Backend Dev: "Epic 4: webhook status update. Ik zie dat we profiles.subscription_status updaten na createSubscription. Vraag: wat als de subscription creation slaagt maar de profile update faalt? Dan hebben we een subscription maar de user heeft geen toegang."
Frontend Dev: "En wat als de webhook twee keer wordt aangeroepen? Zie ik retry logic?"
Backend Dev: "In de code example zie ik wel een check voor subscriptionExistsForPayment (regel 73 in webhook), dus dubbele subscriptions worden voorkomen. Maar de profile update heeft geen idempotency check. Als de webhook twee keer komt, wordt de profile twee keer geüpdatet. Dat is niet erg, maar we moeten wel zorgen dat de eerste update niet faalt."
Lead Dev: "Goed punt. Epic 4 zegt 'beide operaties moeten in dezelfde webhook call gebeuren'. Moeten we een database transaction gebruiken?"
Backend Dev: "Ja, idealiter. Maar Supabase client ondersteunt geen expliciete transactions in JavaScript. We kunnen wel een database functie maken die beide updates in één transactie doet. Of we accepteren dat subscription creation kan slagen terwijl profile update faalt, en dan hebben we een monitoring/retry nodig."
Frontend Dev: "Epic 5: chat access control. Ik zie dat we de database queryen voor subscription_status. Waarom niet user_metadata? Het plan legt uit waarom database beter is, maar betekent dit dat we bij elke chat page load een database query doen?"
Backend Dev: "Ja, maar het is een server component, dus dat is acceptabel. Het is een simpele query met een index. Performance zou geen probleem moeten zijn. Belangrijker: wat als de database query faalt? Dan redirecten we naar checkout, maar misschien is de user wel actief."
Lead Dev: "Goed punt. In Epic 5 code example zie ik if (profileError || !profile || ...). Als er een error is, redirecten we. Is dat de juiste fallback? Misschien moeten we bij een database error de user doorlaten en alleen loggen?"
Frontend Dev: "Dat is een security vs UX trade-off. Als de database down is, willen we users niet blokkeren. Maar als we doorlaten, kunnen inactive users toegang krijgen. Wat is het risico?"
Backend Dev: "Als de database down is, werkt de hele app niet goed. Ik denk dat we bij een error moeten loggen en doorlaten, maar wel een monitoring alert sturen. Epic 1: trial uitschakelen. Ik zie dat we de constraint updaten om 'inactive' toe te voegen. Wat gebeurt er met bestaande users die 'trial' status hebben?"
Lead Dev: "Goede vraag. Het plan zegt alleen 'nieuwe users krijgen inactive status'. Bestaande trial users blijven trial tot ze betalen of verlopen. Dat moet expliciet gemaakt worden."
Frontend Dev: "Epic 2: registratie flow. Als email confirmation aan staat en de user krijgt geen session, redirecten we naar login met redirect parameter. Maar wat als de user de email bevestigt en dan inlogt? Wordt de redirect parameter dan gebruikt?"
Backend Dev: "Ja, Epic 3.S3 beschrijft dat. Maar er is een edge case: wat als de user de email bevestigt via de email link? Dan komt hij op /auth/callback terecht, niet op /login. Hoe redirecten we dan naar checkout?"
Lead Dev: "Goed punt. We moeten de auth callback handler checken. Als die een redirect parameter heeft, moeten we die gebruiken. Epic 6: testing. Ik zie manual smoke tests. Zijn er specifieke test accounts nodig?"
Backend Dev: "Ja, we hebben nodig:
Een test account met 'inactive' status
Een test account met 'expired' status
Een test account met 'active' status (voor negatieve tests)
Mollie test mode credentials"
Frontend Dev: "En voor de registratie flow testen we zowel met als zonder email confirmation. Hoe controleren we of email confirmation aan of uit staat?"
Lead Dev: "Dat moet in Supabase dashboard gecheckt worden. Laten we dat toevoegen aan de test checklist. Nog andere vragen?"
Backend Dev: "Epic 4: webhook. Wat als Mollie de webhook niet kan bereiken? Of als onze server down is tijdens betaling?"
Lead Dev: "Mollie heeft een retry mechanisme. Als de webhook faalt, probeert Mollie opnieuw. Maar we moeten wel zorgen dat onze webhook idempotent is, wat we al hebben met de subscription exists check."
Frontend Dev: "Epic 3: checkout auth check. De code example gebruikt useEffect met dependencies. Maar supabase is niet in de dependencies. Moet dat niet?"
Backend Dev: "Goed punt. En router ook niet eigenlijk, want die komt uit useRouter(). Maar Next.js router is stabiel, dus dat zou geen probleem moeten zijn. Wel goed om te vermelden."
Lead Dev: "Oké, samenvattend: het plan is over het algemeen helder, maar er zijn een paar punten die verduidelijkt moeten worden:
Bestaande trial users blijven trial (niet automatisch inactive)
Auth callback handler moet redirect parameter ondersteunen
Database error handling in Epic 5 (fallback strategie)
Test accounts en email confirmation status checken
Webhook idempotency voor profile update
Zijn jullie het eens dat we kunnen starten, of zijn er nog blockers?"
Frontend Dev: "Ik kan starten met Epic 2 en 3. Alleen de auth callback vraag moet eerst beantwoord worden."
Backend Dev: "Ik kan starten met Epic 1 en 4. Epic 4 heeft wel de transactie vraag, maar we kunnen beginnen met de huidige aanpak en later optimaliseren."
Lead Dev: "Prima. Laten we beginnen en deze punten tijdens implementatie oplossen. Plan is goedgekeurd voor implementatie."
Conclusie
Het plan is grotendeels helder, maar deze punten verdienen aandacht:
Auth callback redirect handling
Database error fallback strategie (Epic 5)
Bestaande trial users blijven trial
Test setup (accounts + email confirmation status)
Webhook idempotency voor profile update
Zal ik deze punten toevoegen aan het plan?