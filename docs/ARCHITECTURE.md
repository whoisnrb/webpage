# Architecture Documentation

## System Overview

This project is a modern web application built with **Next.js 16**, designed for high performance, internationalization, and seamless integration with various external services for business automation.

### Core Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Radix UI, Framer Motion
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: NextAuth.js (v5)
- **Internationalization**: next-intl

## Architecture Diagram

```mermaid
graph TD
    subgraph Client ["Client Layer (Browser)"]
        UI[User Interface]
        ClientComp[Client Components]
        Forms[Forms & Interactions]
    end

    subgraph CDN ["Edge / CDN"]
        Vercel[Vercel Edge Network]
        Middleware[Proxy/Middleware (Auth & i18n)]
    end

    subgraph AppServer ["Application Server (Next.js)"]
        Page[Server Pages (RSC)]
        API[API Routes]
        Actions[Server Actions]
        
        subgraph Logic ["Business Logic"]
            Auth[NextAuth.js]
            Prisma[Prisma ORM]
            EmailService[Email Service]
            PaymentService[SimplePay Service]
            BillingService[Számlázz.hu Service]
        end
    end

    subgraph Data ["Data Layer"]
        DB[(Database)]
    end

    subgraph External ["External Services"]
        SimplePay[SimplePay Gateway]
        Szamlazz[Számlázz.hu]
        N8N[n8n Automation]
        Google[Google APIs (Recaptcha, Analytics)]
        SMTP[SMTP Server]
    end

    %% Flows
    UI --> |Requests| Vercel
    Vercel --> Middleware
    Middleware --> Page
    Middleware --> API
    
    Page --> |Renders| UI
    ClientComp --> |Server Actions| Actions
    Forms --> |API Calls| API
    
    API --> Prisma
    Actions --> Prisma
    Prisma --> DB
    
    %% Integrations
    PaymentService --> |Initiate Payment| SimplePay
    BillingService --> |Generate Invoice| Szamlazz
    EmailService --> |Send Email| SMTP
    Actions --> |Trigger Workflow| N8N
    ClientComp --> |Verify| Google
    
    %% Webhooks
    SimplePay -.-> |IPN Webhook| API
```

## Component Details

### 1. Frontend Layer
- **Pages & Layouts**: Built using React Server Components (RSC) by default for performance and SEO.
- **Interactivity**: Client components (`"use client"`) are used for interactive elements like forms, navigation, and 3D visualizations (`three.js`).
- **Internationalization**: Handled by `next-intl`, routing localized content via `[locale]` directories.

### 2. Application Layer
- **Middleware (`proxy.ts`)**: Handles authentication routing and locale detection before requests reach the application logic.
- **Server Actions**: Used for form submissions (e.g., Contact, Booking) to execute server-side logic directly from UI components without setting up manual API endpoints.
- **API Routes**: Traditional REST endpoints (`/api/*`) used for external webhooks (e.g., SimplePay IPN) and complex data fetching.

### 3. Integrations
- **Payments**: Integrated with **SimplePay** for secure transaction processing. The flow involves a redirect to the gateway and an IPN (Instant Payment Notification) callback.
- **Invoicing**: Automatic invoice generation via **Számlázz.hu** API upon successful payment.
- **Automation**: Connects to **n8n** workflows for complex business logic, such as synchronizing bookings with calendars or handling newsletter subscriptions.
- **Communication**: Email notifications sent via NodeMailer (SMTP).
