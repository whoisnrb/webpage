# Next.js SaaS Boilerplate 🚀

A leggyorsabb út az ötlettől a bevételig. Ez a boilerplate tartalmaz mindent, ami egy modern SaaS-hoz kell.

## ✨ Funkciók

- ✅ **Next.js 14 App Router** - SEO-optimalizált, server-side rendering
- ✅ **Authentication & User Management** - NextAuth.js v5 teljes felhasználókezeléssel
- ✅ **Subscription Payments** - Stripe & SimplePay integráció
- ✅ **Database (Prisma ORM)** - PostgreSQL / MySQL / SQLite support
- ✅ **UI Components** - shadcn/ui + Tailwind CSS
- ✅ **Admin Dashboard** - Komplett admin felület
- ✅ **Email küldés** - Resend integráció
- ✅ **Multi-tenancy** - Több ügyfél/szervezet kezelése
- ✅ **Role-based Access Control** - Szerepkör alapú jogosultságok
- ✅ **Webhooks** - Stripe/SimplePay webhook kezelés
- ✅ **Dark Mode** - Sötét/világos téma váltás
- ✅ **Internationalization** - Több nyelv támogatás (next-intl)
- ✅ **API Routes** - RESTful API végpontok
- ✅ **TypeScript** - Teljes típusbiztonság

## 🚀 Gyors Start

### 1. Telepítés

```bash
# Függőségek telepítése
npm install

# Környezeti változók beállítása
cp .env.example .env
```

### 2. Adatbázis Setup

```bash
# Prisma migrációk futtatása
npx prisma generate
npx prisma db push

# (Opcionális) Seed data létrehozása
npm run db:seed
```

### 3. Indítás

```bash
npm run dev
```

Nyisd meg a böngésződben: `http://localhost:3000`

## 📁 Projekt Struktúra

```
nextjs-saas-boilerplate/
├── app/
│   ├── (auth)/              # Authentication routes
│   ├── (dashboard)/         # Protected dashboard routes
│   ├── (marketing)/         # Public marketing pages
│   ├── admin/               # Admin panel
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── auth/                # Auth componentsek
│   ├── dashboard/           # Dashboard komponensek
│   └── marketing/           # Marketing komponensek
├── lib/
│   ├── auth.ts              # NextAuth config
│   ├── db.ts                # Prisma client
│   ├── stripe.ts            # Stripe config
│   └── email.ts             # Email config
├── prisma/
│   └── schema.prisma        # Database schema
└── public/
    └── assets/              # Static assets
```

## 🔐 Authentikáció

### Támogatott Providers

- Email/Password
- Google OAuth
- GitHub OAuth
- Magic Link (passwordless)

### Példa használat

```tsx
import { auth } from "@/lib/auth"

export default async function Page() {
  const session = await auth()
  
  if (!session) {
    return <div>Please sign in</div>
  }
  
  return <div>Welcome {session.user.name}</div>
}
```

## 💳 Fizetési Integráció

### Stripe Subscription

```tsx
import { createCheckoutSession } from "@/lib/stripe"

// Checkout session létrehozása
const session = await createCheckoutSession({
  priceId: "price_xxx",
  userId: user.id,
})

// Átirányítás Stripe Checkout-ra
redirect(session.url)
```

### Subscription státusz ellenőrzése

```tsx
import { checkSubscription } from "@/lib/subscription"

const isPro = await checkSubscription(user.id)
```

## 📊 Admin Dashboard

Az admin dashboard a következő funkciókat tartalmazza:

- **User Management** - Felhasználók kezelése, tiltás, szerepkörök
- **Subscription Management** - Előfizetések monitorozása
- **Analytics** - Valós idejű statisztikák
- **Settings** - Rendszer beállítások
- **Audit Logs** - Tevékenységi naplók

Elérhető: `/admin` (csak admin szerepkörrel)

## 📧 Email Küldés

### Resend Setup

```tsx
import { sendEmail } from "@/lib/email"

await sendEmail({
  to: "customer@example.com",
  subject: "Welcome!",
  template: "welcome",
  data: { name: "John" }
})
```

### Email Templates

- `welcome.tsx` - Üdvözlő email
- `reset-password.tsx` - Jelszó visszaállítás
- `invoice.tsx` - Számla
- `subscription-renewal.tsx` - Előfizetés megújítás

## 🎨 UI Testreszabás

### Tailwind Theme

Szerkeszd a `tailwind.config.ts` fájlt:

```ts
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "#yourcolor",
        // ...
      }
    }
  }
}
```

### shadcn/ui Komponensek

Új komponens hozzáadása:

```bash
npx shadcn-ui@latest add button
```

## 🌍 Többnyelvűség

A boilerplate támogatja a `next-intl`-t:

```tsx
import { useTranslations } from 'next-intl'

export default function Page() {
  const t = useTranslations('HomePage')
  
  return <h1>{t('title')}</h1>
}
```

## 🔒 Jogosultságkezelés

### Role-based Middleware

```tsx
import { withAuth } from "@/lib/auth"

export default withAuth({
  roles: ["ADMIN", "MANAGER"]
})
```

### Komponens szintű védelem

```tsx
import { Can } from "@/components/auth/can"

<Can perform="delete" on="User">
  <DeleteButton />
</Can>
```

## 📦 Deployment

### Vercel (Ajánlott)

```bash
# Vercel CLI telepítése
npm i -g vercel

# Deploy
vercel
```

### Környezeti változók

Állítsd be a következőket a deployment platformon:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
```

## 🧪 Tesztelés

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## 📚 Dokumentáció

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Stripe Docs](https://stripe.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/)

## 🤝 Support

- Email: support@backlineit.hu
- Discord: [Join our community](#)
- Docs: [Full documentation](#)

## 📄 Licenc

Ez a boilerplate **Commercial License** alatt érhető el.

- ✅ Korlátlan projekt használat
- ✅ Forráskód módosítása
- ✅ Kereskedelmi célú használat
- ❌ Újraeladás template-ként

## 🎯 Roadmap

- [ ] v2.0 - AI Features
- [ ] Multi-workspace support
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

---

**Made with ❤️ by BacklineIT**
