# Website QA Checklist

This checklist contains all the distinct pages found in the project structure. Use this to manually verify the quality of each page.

## General Quality Standards (Apply to all pages)
- [ ] **Design/Aesthetics**: Matches the premium/modern design language (glassmorphism, animations, spacing).
- [ ] **Responsiveness**: Looks perfect on Mobile (375px), Tablet (768px), and Desktop (1440px+).
- [ ] **Functionality**: All buttons, links, inputs, and interactive elements work as expected.
- [ ] **Localization**: No hardcoded text; switching languages works correctly.
- [ ] **SEO**: Correct Title, Meta Description, and H1 hierarchy.
- [ ] **Performance**: Fast FCP/LCP, no layout shifts (CLS), images are optimized.
- [ ] **Console Errors**: No red errors in the browser developer console.

---

## Public Pages

### Main Pages
- [ ] **Home** (`/`)
- [ ] **About Us** (`/rolunk`)
- [ ] **Services** (`/szolgaltatasok`)
- [ ] **Products** (`/termekek`)
- [ ] **Blog** (`/blog`)
- [ ] **Contact** (`/kapcsolat`)
- [ ] **Pricing** (`/arak`)
- [ ] **References** (`/referenciak`)
- [ ] **Request Quote** (`/ajanlatkeres`)
- [ ] **Review/Feedback** (`/velemeny`)
- [ ] **Demo** (`/demo`)
- [ ] **Career** (`/karrier`)

### Legal & Information
- [ ] **Privacy Policy** (`/adatvedelem`)
- [ ] **Terms of Service** (`/aszf`)
- [ ] **Imprint/Impressum** (`/impresszum`)

### Services Details
- [ ] **Web Development** (`/szolgaltatasok/webfejlesztes`)
- [ ] **System Operations** (`/szolgaltatasok/rendszeruzemeltetes`)
- [ ] **Network Solutions** (`/szolgaltatasok/halozat`)
- [ ] **Integrations/Automations** (`/szolgaltatasok/integraciok`)
- [ ] **Scripts/Development** (`/szolgaltatasok/scriptek`)
- [ ] **Security** (`/szolgaltatasok/biztonsag`)

### Dynamic Pages
- [ ] **Product Details** (`/termekek/[slug]`)
- [ ] **Blog Post** (`/blog/[slug]`)
- [ ] **Landing Pages**
- [ ] **Automation Starter** (`/lp/automation-starter`)

---

## User & Customer Area

### Authentication
- [ ] **Login** (`/login`)
- [ ] **Register** (`/register`)
- [ ] **Email Verification** (`/auth/new-verification`)

### Account Management
- [ ] **My Account** (`/fiok`)
- [ ] **Dashboard Home** (`/dashboard`)
- [ ] **Affiliate** (`/dashboard/affiliate`)
- [ ] **Licenses** (`/dashboard/licenses`)
- [ ] **Purchases** (`/dashboard/purchases`)
- [ ] **Settings** (`/dashboard/settings`)
- [ ] **Support Tickets** (`/dashboard/tickets`)

### Checkout flow
- [ ] **Checkout** (`/checkout`)
- [ ] **Payment Success** (`/payment/success`)
- [ ] **Payment Cancelled** (`/payment/cancel`)
- [ ] **Payment Failed** (`/payment/fail`)
- [ ] **Payment Instructions** (`/payment/instructions`)

---

## Admin Panel
*Requires Admin Login*

- [ ] **Admin Dashboard** (`/admin/dashboard` or `/admin`)
- [ ] **Analytics** (`/admin/analytics`)
- [ ] **Audit Logs** (`/admin/audit-logs`)
- [ ] **Blog Management** (`/admin/blog`)
- [ ] **CRM** (`/admin/crm`)
- [ ] **Cron Jobs** (`/admin/cron-jobs`)
- [ ] **Feature Flags** (`/admin/features`)
- [ ] **Finance** (`/admin/finance`)
- [ ] **Leads** (`/admin/leads`)
- [ ] **Orders** (`/admin/orders`)
- [ ] **Products** (`/admin/products`)
- [ ] **Tickets** (`/admin/tickets`)

---

## System Pages
- [ ] **404 Not Found** (Test by visiting a non-existent URL)
- [ ] **Error Page** (Trigger an error to test `error.tsx`)
- [ ] **Loading States** (Verify skeletons/spinners appear correctly)
