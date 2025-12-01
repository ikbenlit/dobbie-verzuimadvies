### <📅 20251201> | Cyber Monday Free Access Mode

**Focus:** Payment flow tijdelijk uitschakelen voor gratis toegang actie
**Commits:** `e6f6aeb`, `75c07f6`, `785156a`, `74b8357`, `356296f`, `73122e9`, `5361176`

**Wijzigingen:**

| Bestand | Actie |
|---------|-------|
| `app/api/auth/activate-free/route.ts` | **Nieuw** - API voor gratis activatie |
| `app/(auth)/register/page.tsx` | Banner + skip checkout in free mode |
| `app/(auth)/login/page.tsx` | Banner + auto-activatie bestaande users |
| `app/(auth)/email-confirmed/page.tsx` | Auto-activatie na email confirm |
| `app/auth/callback/page.tsx` | Redirect naar /chat ipv checkout |
| `app/chat/layout.tsx` | Fallback auto-activatie |

**Flow:**
```
Register/Login → activateFreeAccess() → /chat (skip checkout)
```

**Bugfixes:**
- Duplicate subscription error: check voor bestaande subscription toegevoegd
- `billing_period` column verwijderd (bestaat niet in schema)
- Email confirmation success message fix
- Redirect naar checkout gefixed → nu naar /chat

**Hardcoded FREE_ACCESS_MODE (commit `5361176`):**

Vercel env vars werkten niet betrouwbaar bij builds. Oplossing: hardcode `FREE_ACCESS_MODE = true` direct in code.

```typescript
// In alle 6 bestanden:
const FREE_ACCESS_MODE = true; // Cyber Monday actie - zet op false om uit te schakelen
```

**Uitschakelen na actie:** Verander `true` naar `false` in alle bestanden en deploy opnieuw.

---
