# 🚀 Next.js SaaS Boilerplate - Setup Guide

## Előfeltételek

- Node.js 18+ telepítve
- PostgreSQL adatbázis (vagy alternatíva: MySQL, SQLite)
- Stripe account (fizetéshez)
- Resend account (email küldéshez)
- (Opcionális) Google/GitHub OAuth app

## Részletes Telepítési Lépések

### 1. Klónozás és Függőségek

```bash
cd nextjs-saas-boilerplate
npm install
```

### 2. Környezeti Változók Beállítása

Másold le az `env.example.txt` fájlt `.env` néven:

```bash
cp env.example.txt .env
```

Fill in the required values:

#### Database
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/saas"
```

#### NextAuth
Generálj egy biztonságos kulcsot:
```bash
openssl rand -base64 32
```

```env
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

#### Stripe

1. Regisztrálj a https://stripe.com oldalon
2. Dashboard → API keys menüben találod:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

3. Termékek és árak létrehozása:
   - Dashboard → Products → Add Product
   - Hozz létre 3 terméket: Starter, Pro, Enterprise
   - Másold ki a Price ID-kat:

```env
STRIPE_PRICE_ID_STARTER="price_xxx"
STRIPE_PRICE_ID_PRO="price_xxx"
STRIPE_PRICE_ID_ENTERPRISE="price_xxx"
```

4. Webhook setup (local development):
   - Telepítsd a Stripe CLI-t
   - Futtasd: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   - Másold a webhook secret-et:

```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### Resend (Email)

1. Regisztrálj a https://resend.com oldalon
2. API Keys → Create API Key

```env
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

#### Google OAuth (Opcionális)

1. https://console.cloud.google.com
2. Create Project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID:
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

#### GitHub OAuth (Opcionális)

1. https://github.com/settings/developers
2. New OAuth App
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

```env
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
```

### 3. Adatbázis Inicializálása

```bash
# Prisma Client generálása
npx prisma generate

# Adatbázis létrehozása és táblák migrálása
npx prisma db push

# (Opcionális) Teszt adatok létrehozása
npm run db:seed
```

Prisma Studio megnyitása (vizuális DB böngésző):
```bash
npm run db:studio
```

### 4. Alkalmazás Indítása

Development módban:
```bash
npm run dev
```

Nyisd meg: http://localhost:3000

### 5. Admin Felhasználó Létrehozása

Két lehetőség:

**A) UI-ból (ajánlott új felhasználóknak):**
1. Regisztrálj a /auth/signup oldalon
2. Kézileg állítsd át az adatbázisban a role-t ADMIN-ra:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'youremail@example.com';
   ```

**B) Seed script-tel:**

Hozz létre egy `prisma/seed.ts` fájlt és futtasd:
```bash
npm run db:seed
```

## 🎨 Testreszabás

### Branding

Módosítsd a következő fájlokat:
- `app/layout.tsx` - App név, meta tags
- `tailwind.config.ts` - Színséma
- `public/` - Logo és favicon

### Email Templates

Email templatek helye: `lib/email.ts`

### Pricing Plans

Módosítsd: `app/(marketing)/pricing/page.tsx`

### Funkciók Be/Kikapcsolása

Feature flags az `.env` fájlban:

```env
NEXT_PUBLIC_ENABLE_SIGNUPS="true"
NEXT_PUBLIC_ENABLE_PAYMENTS="true"
```

## 🚢 Production Deploy

### Vercel (Ajánlott)

1. Push a kódot GitHub-ra
2. https://vercel.com → Import repository
3. Add environment variables
4. Deploy!

### Stripe Production Setup

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: 
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Másold a signing secret-et `.env`-be

### Database

Production adatbázis ajánlások:
- **Neon** (serverless Postgres) - Ingyenes tier
- **Supabase** (Postgres + extra features)
- **PlanetScale** (MySQL)

## 🔧 Troubleshooting

### "Module not found: Can't resolve '@/lib/db'"

```bash
npm install
npx prisma generate
```

### "Invalid `prisma.user.create()` invocation"

Ellenőrizd a `DATABASE_URL` -t és futtasd:
```bash
npx prisma db push
```

### Stripe webhook nem működik

Local developmenthoz használd a Stripe CLI-t:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Email nem megy ki

- Ellenőrizd a `RESEND_API_KEY`-t
- Resend ingyenes tier: 100 email/nap
- Production-ben domain verification kell

## 📚 További Olvasnivaló

- [NextAuth Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe Payment Integration](https://stripe.com/docs/payments)
- [Resend Email API](https://resend.com/docs)

## 💬 Support

Ha elakadtál:
- Email: support@backlineit.hu
- Documentation: [Full Docs](#)
- Community: [Discord](#)

---

**Happy Building! 🚀**
