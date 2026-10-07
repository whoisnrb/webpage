import { prisma } from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
        return new Response("Érvénytelen leiratkozási kérés (hiányzó e-mail cím).", {
            status: 400,
            headers: { "Content-Type": "text/html; charset=utf-8" },
        });
    }

    try {
        await prisma.newsletterSubscriber.updateMany({
            where: { email: email.trim().toLowerCase() },
            data: { active: false },
        });

        const html = `<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sikeres leiratkozás - BacklineIT</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #030712;
            color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .card {
            background-color: #0b1120;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 40px;
            max-width: 480px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }
        .icon {
            font-size: 48px;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 12px 0;
            color: #ffffff;
        }
        p {
            font-size: 15px;
            line-height: 1.6;
            color: #94a3b8;
            margin: 0 0 24px 0;
        }
        .email {
            color: #38bdf8;
            font-weight: 600;
        }
        a.btn {
            display: inline-block;
            background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
            color: #020617;
            font-weight: 700;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 10px;
            font-size: 14px;
            transition: opacity 0.2s;
        }
        a.btn:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">✉️</div>
        <h1>Sikeres leiratkozás</h1>
        <p>A(z) <span class="email">${escapeHtml(email)}</span> e-mail címet sikeresen eltávolítottuk a heti hírlevél listánkról. A jövőben nem küldünk számodra hírleveleket.</p>
        <a href="https://backlineit.hu" class="btn">Vissza a főoldalra</a>
    </div>
</body>
</html>`;

        return new Response(html, {
            status: 200,
            headers: { "Content-Type": "text/html; charset=utf-8" },
        });
    } catch (error) {
        console.error("Leiratkozási hiba:", error);
        return new Response("Hiba történt a leiratkozás feldolgozása során.", {
            status: 500,
            headers: { "Content-Type": "text/html; charset=utf-8" },
        });
    }
}

function escapeHtml(text: string) {
    return text.replace(/[&<>"']/g, (m) => {
        switch (m) {
            case "&": return "&amp;";
            case "<": return "&lt;";
            case ">": return "&gt;";
            case '"': return "&quot;";
            case "'": return "&#039;";
            default: return m;
        }
    });
}
