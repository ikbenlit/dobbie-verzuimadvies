### <📅 20251201> | Cyber Monday Free Access Mode

**Focus:** Payment flow tijdelijk uitschakelen voor gratis toegang actie
**Commits:** `e6f6aeb`, `75c07f6`

**Wijzigingen:**

| Bestand | Actie |
|---------|-------|
| `app/api/auth/activate-free/route.ts` | **Nieuw** - API voor gratis activatie |
| `app/(auth)/register/page.tsx` | Banner + skip checkout in free mode |
| `app/(auth)/login/page.tsx` | Banner + auto-activatie bestaande users |
| `app/(auth)/email-confirmed/page.tsx` | Auto-activatie na email confirm |
| `app/auth/callback/page.tsx` | Redirect naar /chat ipv checkout |
| `app/chat/layout.tsx` | Fallback auto-activatie |
| `.env.local` | `NEXT_PUBLIC_FREE_ACCESS_MODE=false` |

**Activeren:** `NEXT_PUBLIC_FREE_ACCESS_MODE=true` + rebuild

**Flow:**
```
Register/Login → activateFreeAccess() → /chat (skip checkout)
```

---
