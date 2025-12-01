# IT Services & Automation Platform

Modern, conversion-focused website for selling IT services, scripts, and automation solutions. Built with Next.js, Tailwind CSS, and TypeScript.

## 🚀 Features

-   **Service Pages**: Detailed landing pages for Scripts, Web Development, DevOps, and Security.
-   **E-commerce**: Digital product store with cart, checkout, and license management.
-   **Client Portal**: User dashboard for managing purchases, licenses, and support tickets.
-   **Blog/Knowledge Base**: Content hub for articles and tutorials.
-   **SEO Optimized**: Dynamic sitemap, metadata, and OpenGraph support.
-   **Responsive Design**: Mobile-first approach using Tailwind CSS.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Radix UI](https://www.radix-ui.com/) + [Lucide Icons](https://lucide.dev/)
-   **Animation**: [Framer Motion](https://www.framer.com/motion/)
-   **Language**: TypeScript

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/it-services-platform.git
    cd it-services-platform
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the site.

## 🏗️ Build & Deploy

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
1.  Push your code to a GitHub repository.
2.  Import the project in [Vercel](https://vercel.com).
3.  Vercel will automatically detect Next.js and configure the build settings.
4.  Click **Deploy**.

## 📂 Project Structure

```
src/
├── app/                    # App Router pages
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── szolgaltatasok/    # Service pages
│   ├── termekek/          # Product pages
│   ├── dashboard/         # Client portal
│   ├── blog/              # Blog
│   ├── checkout/          # Checkout
│   ├── login/             # Authentication
│   ├── sitemap.ts         # Dynamic sitemap
│   ├── robots.ts          # Robots.txt
│   └── not-found.tsx      # 404 page
├── components/
│   ├── ui/                # Reusable UI atoms
│   ├── layout/            # Header, Footer
│   ├── sections/          # Page sections
│   ├── ecommerce/         # Cart, Products
│   ├── dashboard/         # Dashboard components
│   └── templates/         # Page templates
└── lib/                   # Utilities
```

## 🔑 Key Pages

-   **Homepage**: `/`
-   **Services**: `/szolgaltatasok/scriptek`, `/szolgaltatasok/webfejlesztes`, etc.
-   **Products**: `/termekek`
-   **Blog**: `/blog`
-   **Client Portal**: `/dashboard`
-   **Login**: `/login`

## 📄 License

This project is proprietary and intended for commercial use.
