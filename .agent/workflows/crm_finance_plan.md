# Implementation Plan - CRM & Financial Management Systems

This plan outlines the design and implementation of a custom CRM and Financial/Admin system for the BacklineIT platform.

## 1. Database Schema Updates (Prisma)

We will add new models to `schema.prisma` to handle CRM and Financial data.

### CRM Models
- **`CRMLead`**:
    - `id`, `companyName`, `contactPerson`, `email`, `status` (LEAD, PROPOSAL, ACTIVE, INACTIVE), `source`, `lastContactedAt`, `notes`, `createdAt`, `updatedAt`.

### Financial Models
- **`Transaction`**:
    - `id`, `type` (INCOME, EXPENSE), `category` (AD, SUBSCRIPTION, TAX, SALE, etc.), `amount`, `currency` (HUF/EUR), `taxAmount`, `date`, `description`.
- **`FinancialSubscription`**:
    - `id`, `name`, `provider`, `amount`, `currency`, `billingCycle`, `nextBillingDate`, `status`.

## 2. Admin UI Additions

### CRM Dashboard (`/admin/crm`)
- **Lead Table**: Searchable and filterable list of leads.
- **Status Management**: Ability to update lead status (Lead -> Promotion -> Active -> Inactive).
- **Detail View**: Dialog or side panel for editing company info, contact person, and notes.
- **Visuals**: Status-coded badges and "Last Contact" relative time.

### Financial Dashboard (`/admin/finance`)
- **Overview Cards**: Total Revenue, Total Expense, Net Profit, and Upcoming Taxes.
- **Charts**: Monthly comparison of Income vs Expenses.
- **Transaction Table**: Log of all financial movements with filter by type/category.
- **Subscriptions List**: Track recurring costs.

## 3. API Actions

We will use Next.js Server Actions for data management:
- `getCRMLeads`, `updateCRMLead`, `deleteCRMLead`
- `getTransactions`, `addTransaction`, `deleteTransaction`
- `getSubscriptions`, `addSubscription`, `updateSubscription`

## 4. Integration

- Map current `Lead` model entries (newsletter/contact) to the `CRMLead` system.
- Integrate `Order` successes automatically into the `Transaction` table as INCOME.

## 5. Aesthetics & UX

- **Premium Look**: Utilizing the existing UI component library (Shadcn UI) with enhanced animations and clear data visualizations.
- **Responsive Design**: Ensuring the dashboard is usable on both desktop and mobile.

---
**Next Step**: Prepare the Prisma schema migration.
