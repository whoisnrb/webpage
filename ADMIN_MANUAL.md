# Admin Manual - IT Services Platform

This guide explains how to manage content and maintain the IT Services website.

## 📋 Table of Contents

1. [Managing Products](#managing-products)
2. [Managing Blog Posts](#managing-blog-posts)
3. [Managing Service Pages](#managing-service-pages)
4. [Handling Orders](#handling-orders)
5. [License Management](#license-management)

---

## Managing Products

### Adding a New Product

Products are currently defined in `src/app/termekek/page.tsx`.

1. Open the file and locate the `products` array.
2. Add a new product object:

```typescript
{
  id: "unique-id",
  title: "Product Name",
  description: "Short description",
  price: 15000,
  category: "WordPress Plugin", // or "Script", "Template", etc.
  slug: "product-url-slug"
}
```

3. Create a product detail page at `src/app/termekek/[slug]/page.tsx` (copy existing and modify).

### Product Categories

Available categories:
- WordPress Plugin
- Automatizáció
- Script
- Template
- E-book

---

## Managing Blog Posts

Blog posts are defined in `src/app/blog/page.tsx`.

### Adding a Blog Post

1. Open `src/app/blog/page.tsx`
2. Add to the `posts` array:

```typescript
{
  title: "Post Title",
  excerpt: "Brief summary",
  category: "Automatizáció",
  date: "2023. Nov. 15.",
  readTime: "5 perc"
}
```

### Blog Categories

- Automatizáció
- WordPress
- DevOps
- Esettanulmányok
- Biztonság

---

## Managing Service Pages

Service pages are located in `src/app/szolgaltatasok/`.

### Editing Service Content

Each service page (e.g., `scriptek/page.tsx`) uses the `ServiceLayout` template.

**To modify:**
1. Open the service page file
2. Update the props passed to `ServiceLayout`:
   - `title`: Service name
   - `description`: Brief description
   - `features`: Array of feature objects
   - `benefits`: Array of benefit strings
   - `techStack`: Array of technologies
   - `pricing`: Pricing information

---

## Handling Orders

### Order Flow

1. Customer completes checkout at `/checkout`
2. Order data is submitted (currently mocked)
3. In production, integrate with:
   - **Payment**: Stripe/Barion
   - **Invoicing**: Számlázz.hu API
   - **Email**: SendGrid/Mailgun

### Mock Order Data

Current checkout is for demonstration. To implement real orders:

1. Set up payment gateway (Stripe recommended)
2. Create API routes in `src/app/api/`
3. Store orders in database (Supabase/PostgreSQL)
4. Send confirmation emails

---

## License Management

### License Types

- **Personal**: 1 domain
- **Commercial**: 5 domains + Priority Support
- **Developer**: Unlimited domains + Source Code

### Managing Licenses

Licenses are displayed in `/dashboard/licenses`.

**To add real license management:**

1. Create database table for licenses
2. Implement activation/deactivation logic
3. Add domain validation
4. Set up license key generation

### License Activation Flow

1. Customer purchases product
2. System generates unique license key
3. Customer activates on their domain
4. System validates and stores activation

---

## 🔧 Technical Notes

### Environment Variables

Create `.env.local` for sensitive data:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.hu
STRIPE_SECRET_KEY=sk_...
SZAMLAZZ_API_KEY=...
```

### Deployment Checklist

- [ ] Update `metadataBase` in `src/app/layout.tsx`
- [ ] Configure payment gateway
- [ ] Set up email service
- [ ] Configure database
- [ ] Test checkout flow
- [ ] Verify SEO metadata

---

## 📞 Support

For technical issues or questions, contact the development team.
