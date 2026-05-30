import { WebhookBody, GOOGLE_SHEET_IDS } from './config';
import { appendToSheet, sendEmail, generateAIResponse, analyzeSentiment } from './services';

const SYSTEM_PROMPTS = {
    POSITIVE_RESPONSE: (locale: string) => locale === 'hu' ?
        `Te egy ügyfélszolgálati munkatárs vagy az It services.hu-nál, ami egy MI automatizációs ügynökség. Írj egy barátságos választ az alábbi visszajelzésre magyarul. Formázd HTML e-mailként és írd alá Marc névében az It services.hu-tól. Csak a HTML kódot add vissza.` :
        `You are a customer support representative for an AI Automation Agency known as It services.hu specialized in helping SME implement AI Agents and AI Automation solutions. Write a friendly response to the customer feedback below. Format as HTML email and sign from Marc at It services.hu. Return only HTML code.`,
    APOLOGY_RESPONSE: (locale: string) => locale === 'hu' ?
        `Te egy ügyfélszolgálati munkatárs vagy az It services.hu-nál. Írj egy barátságos és rövid választ az alábbi visszajelzésre magyarul. Az e-mailben köszönd meg a visszajelzést, ismerd el a problémát, és tájékoztasd az ügyfelet, hogy továbbítottuk a vezetőségnek. Ajánld fel, hogy egy extra MI ágens integrációval bővítjük a jelenlegi csomagjukat díjmentesen. Formázd HTML e-mailként és írd alá Marc névében az It services.hu-tól. Csak a HTML kódot add vissza.` :
        `You are a customer support representative for an AI Automation Agency known as It services.hu. Write a friendly and concise response to the following customer feedback. The email should thank the client for their feedback, acknowledge their concerns, and inform that this has been escalated to our management. Offer to extend their current automation package with one additional AI Agent integration at no extra charge. Format as HTML email and sign from Marc at It services.hu. Return only HTML code.`,
    SUGGEST_IMPROVEMENTS: `You are a customer support representative for an AI Automation Agency known as It services.hu. A client just submitted feedback about our services. Please provide a concise suggestion on what It services.hu can do to address their concerns and improve client satisfaction in the future.`,
    CHAT_ALVIN: `Te Alvin vagy, a BacklineIT automatizációs és rendszerüzemeltetési szakértő AI asszisztense.
Célod: Segíteni a látogatóknak eligazodni a szolgáltatások között, és megválaszolni a technikai vagy üzleti kérdéseiket.
Stílusod: Professzionális, de barátságos, segítőkész és lényegretörő.
Ha nem tudod a választ, javasold a "Kapcsolat" menüpontot.`
};

import { prisma } from "@/lib/db";

export async function processFeedback(body: WebhookBody) {
    const { email, name, feedback, locale = 'hu' } = body;
    if (!email || !feedback) throw new Error('Missing email or feedback');

    const sentiment = await analyzeSentiment(feedback);
    console.log(`[Feedback] Sentiment determined: ${sentiment}`);

    // Save to Database
    try {
        await prisma.review.create({
            data: {
                name: name || 'Anonymous',
                email: email,
                content: feedback,
                rating: sentiment === 'Positive' ? 5 : 3,
                locale: locale,
                approved: false // Require manual approval
            }
        });
        console.log(`[Feedback] Saved to database as Review`);
    } catch (dbError) {
        console.error(`[Feedback] Error saving to database:`, dbError);
    }

    if (sentiment === 'Positive') {
        // 1. Add to Sheet
        await appendToSheet(GOOGLE_SHEET_IDS.POSITIVE_FEEDBACK, [name || '', email, feedback]);

        const subject = locale === 'hu' ? 'Köszönjük értékes visszajelzését' : 'Thank you for your valuable feedback';
        // 2. Generate Response
        const aiResponse = await generateAIResponse(
            `Customer Name: ${name}\nFeedback: ${feedback}`,
            SYSTEM_PROMPTS.POSITIVE_RESPONSE(locale)
        );

        // 3. Send Email
        await sendEmail(email, subject, aiResponse);

    } else {
        // ... (remaining negative logic stays same)
        // Negative
        // 1. Suggest Improvements (Internal)
        const suggestion = await generateAIResponse(
            `Feedback: ${feedback}`,
            SYSTEM_PROMPTS.SUGGEST_IMPROVEMENTS
        );

        // 2. Add to Sheet (with suggestion)
        await appendToSheet(GOOGLE_SHEET_IDS.NEGATIVE_FEEDBACK, [name || '', email, feedback, suggestion]);

        const apologySubject = locale === 'hu' ? 'Sajnáljuk a kellemetlenséget - íme a megoldásunk' : "We're sorry - here's how we'll fix this";
        // 3. Generate Apology Email
        const apologyEmail = await generateAIResponse(
            `Customer Name: ${name}\nFeedback: ${feedback}`,
            SYSTEM_PROMPTS.APOLOGY_RESPONSE(locale)
        );

        // 4. Send Email
        await sendEmail(email, apologySubject, apologyEmail);
    }

    return { success: true, sentiment };
}

export async function processNewsletter(body: WebhookBody) {
    const { email } = body;
    if (!email) throw new Error('Missing email');

    // 1. Save to Sheet
    await appendToSheet(GOOGLE_SHEET_IDS.NEWSLETTER, [email]);

    // 2. Send Welcome Email
    await sendEmail(
        email,
        'Sikeres feliratkozás! 🚀',
        `Kedves Feliratkozó!<br><br>Köszönjük, hogy feliratkoztál hírlevelünkre. Hamarosan küldjük a legfrissebb IT tippeket.<br><br>Üdvözlettel,<br>BacklineIT Csapata`
    );

    return { success: true };
}

export async function processBooking(body: WebhookBody) {
    const { name, email, date, topic, time, message } = body;

    // 1. Save to Sheet
    await appendToSheet(GOOGLE_SHEET_IDS.BOOKING, [name || '', email || '', date || '', time || '', topic || '', message || '']);

    // 2. Save to Database
    try {
        await prisma.contactMessage.create({
            data: {
                name: name || 'Anonymous',
                email: email || 'no-email@backlineit.hu',
                phone: null,
                subject: topic ? `Időpontfoglalás: ${topic}` : 'Kapcsolatfelvétel',
                message: `Időpontfoglalási kérés:\nDátum: ${date || '-'}\nIdő: ${time || '-'}\n\nÜzenet:\n${message || '-'}`
            }
        });
        console.log(`[processBooking] Saved to database as ContactMessage`);
    } catch (dbError) {
        console.error(`[processBooking] Error saving to database:`, dbError);
    }

    const formattedDT = formatDateTime(date, time);
    const bookingTopic = topic || 'Kapcsolatfelvétel';

    // 3. Notify Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'whoisnrb@gmail.com';
    const adminHtml = getAdminNotificationEmailHtml(
        name || 'Anonymous',
        email || 'no-email@backlineit.hu',
        formattedDT,
        bookingTopic,
        message || ''
    );
    await sendEmail(
        adminEmail,
        'Új Időpontfoglalás Érkezett',
        adminHtml
    );

    // 4. Confirm to User
    if (email) {
        const clientHtml = getClientConfirmationEmailHtml(
            name || 'Ügyfelünk',
            formattedDT,
            bookingTopic,
            false
        );
        await sendEmail(
            email,
            'Időpontfoglalás Visszaigazolása',
            clientHtml
        );
    }

    return { success: true };
}

export async function processTicket(body: WebhookBody) {
    const { ticketNumber, subject, userName, userEmail, description } = body;

    // 1. Notify Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'whoisnrb@gmail.com';
    await sendEmail(
        adminEmail,
        `Új Support Ticket: ${ticketNumber}`,
        `Új ticket érkezett!<br><br>Szám: ${ticketNumber}<br>Tárgy: ${subject}<br>Felhasználó: ${userName} (${userEmail})<br><br>Leírás:<br>${description}`
    );

    return { success: true, ticketNumber };
}

export async function processChat(body: WebhookBody) {
    const { message, systemPrompt, history } = body;

    // Construct prompt with history if available
    let fullPrompt = message || '';
    if (history && Array.isArray(history)) {
        const historyText = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
        fullPrompt = `History:\n${historyText}\n\nUser: ${message}`;
    }

    const response = await generateAIResponse(
        fullPrompt,
        systemPrompt || 'You are Alvin, the AI assistant of BacklineIT. Help specifically with IT services, automation and development questions.'
    );

    return { output: response };
}

export async function processConsultation(body: WebhookBody) {
    const { name, email, company, phone, description, productName, packageName } = body;

    // 1. Save to Sheet (using BOOKING sheet as fallback for now)
    const topic = `Konzultáció: ${productName || 'Általános'} ${packageName ? `(${packageName})` : ''}`;
    const date = new Date().toLocaleDateString('hu-HU');
    const time = new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
    const fullMessage = `Cég: ${company || '-'}, Tel: ${phone || '-'}\n\nLeírás:\n${description}`;

    await appendToSheet(GOOGLE_SHEET_IDS.BOOKING, [name || '', email || '', date, time, topic, fullMessage]);

    const formattedDT = `${date} ${time}`;

    // 2. Notify Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'whoisnrb@gmail.com';
    const extraFields = [
        { label: 'Cég', value: company || '-' },
        { label: 'Telefon', value: phone || '-' }
    ];
    const adminHtml = getAdminNotificationEmailHtml(
        name || 'Anonymous',
        email || 'no-email@backlineit.hu',
        formattedDT,
        topic,
        description || '',
        extraFields
    );
    await sendEmail(
        adminEmail,
        'Új Konzultációs Igény',
        adminHtml
    );

    // 3. Confirm to User
    if (email) {
        const clientHtml = getClientConfirmationEmailHtml(
            name || 'Ügyfelünk',
            formattedDT,
            productName || 'Automatizációs megoldások',
            true
        );
        await sendEmail(
            email,
            'Konzultációs igényét fogadtuk',
            clientHtml
        );
    }

    return { success: true };
}

// --- Helper Functions for Email Templating & Formatting ---

function formatDateTime(dateStr?: string, timeStr?: string): string {
    if (!dateStr) return 'Nincs megadva';
    try {
        let formattedDate = dateStr;
        if (dateStr.includes('T')) {
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                formattedDate = `${year}. ${month}. ${day}.`;
            }
        } else {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                formattedDate = `${parts[0]}. ${parts[1]}. ${parts[2]}.`;
            }
        }
        return timeStr ? `${formattedDate} - ${timeStr}` : formattedDate;
    } catch (e) {
        return dateStr + (timeStr ? ` ${timeStr}` : '');
    }
}

function getClientConfirmationEmailHtml(name: string, formattedDateTime: string, topic: string, isConsultation: boolean = false): string {
    const title = isConsultation ? 'Konzultációs Igény Regisztrálva' : 'Időpontfoglalás Visszaigazolása';
    const mainMessage = isConsultation
        ? `Köszönjük érdeklődését! Megkaptuk konzultációs igényét a következővel kapcsolatban: <strong>${topic}</strong>.`
        : `Köszönjük megkeresését! Örömmel értesítjük, hogy időpontfoglalási igényét sikeresen regisztráltuk a rendszerünkben.`;
    
    const detailsLabel = isConsultation ? 'Konzultáció részletei' : 'Foglalás adatai';
    const timeLabel = isConsultation ? 'Igénylés időpontja' : 'Kért időpont';

    return `
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #1E293B;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" max-width="600px" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);">
                    <!-- Header Accent Bar -->
                    <tr>
                        <td height="6" style="background: linear-gradient(90deg, #06B6D4 0%, #3B82F6 50%, #8B5CF6 100%);"></td>
                    </tr>
                    
                    <!-- Header Branding -->
                    <tr>
                        <td style="padding: 32px 40px 24px 40px; text-align: left; border-bottom: 1px solid #F1F5F9;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td>
                                        <div style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #0F172A;">
                                            <span style="color: #06B6D4;">Backline</span>IT
                                        </div>
                                    </td>
                                    <td style="text-align: right;">
                                        <span style="display: inline-block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #06B6D4; background-color: #ECFDF5; border: 1px solid #A7F3D0; padding: 4px 10px; border-radius: 9999px;">
                                            Igény fogadva
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Main Body Content -->
                    <tr>
                        <td style="padding: 40px 40px 32px 40px;">
                            <h1 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0; line-height: 1.3;">Kedves ${name}!</h1>
                            <p style="font-size: 15px; color: #475569; margin: 0 0 24px 0; line-height: 1.6;">
                                ${mainMessage}
                            </p>
                            
                            <!-- Booking Details Card -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0; margin-bottom: 32px;">
                                <tr>
                                    <td style="padding: 20px 24px;">
                                        <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748B; margin-bottom: 12px;">${detailsLabel}</div>
                                        
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                            <!-- Date and Time -->
                                            <tr style="border-bottom: 1px solid #E2E8F0;">
                                                <td style="padding: 8px 0; font-size: 14px; color: #64748B;" width="40%">${timeLabel}</td>
                                                <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #0F172A;">${formattedDateTime}</td>
                                            </tr>
                                            <!-- Topic -->
                                            <tr>
                                                <td style="padding: 8px 0; font-size: 14px; color: #64748B;" width="40%">Téma / Megoldás</td>
                                                <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #0F172A;">${topic}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Steps / Process Visual -->
                            <h2 style="font-size: 14px; font-weight: 700; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 16px 0;">Mi történik most?</h2>
                            
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                                <tr>
                                    <td style="vertical-align: top; padding-right: 16px;" width="36">
                                        <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #ECFDF5; border: 1px solid #A7F3D0; color: #059669; font-weight: 700; font-size: 13px; text-align: center; line-height: 26px;">1</div>
                                    </td>
                                    <td style="padding-bottom: 20px;">
                                        <div style="font-size: 14px; font-weight: 600; color: #0F172A; margin-bottom: 2px;">Igény beérkezése</div>
                                        <div style="font-size: 13px; color: #64748B; line-height: 1.4;">Igényét sikeresen rögzítettük rendszerünkben (Ez a lépés sikeresen lezárult).</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="vertical-align: top; padding-right: 16px;" width="36">
                                        <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #EFF6FF; border: 1px solid #BFDBFE; color: #2563EB; font-weight: 700; font-size: 13px; text-align: center; line-height: 26px;">2</div>
                                    </td>
                                    <td style="padding-bottom: 20px;">
                                        <div style="font-size: 14px; font-weight: 600; color: #0F172A; margin-bottom: 2px;">Visszaigazolás & Pontosítás</div>
                                        <div style="font-size: 13px; color: #64748B; line-height: 1.4;">Kollégánk 24 órán belül felveszi Önnel a kapcsolatot a megadott elérhetőségeken a részletek véglegesítése érdekében.</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="vertical-align: top; padding-right: 16px;" width="36">
                                        <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #F8FAFC; border: 1px solid #E2E8F0; color: #64748B; font-weight: 700; font-size: 13px; text-align: center; line-height: 26px;">3</div>
                                    </td>
                                    <td>
                                        <div style="font-size: 14px; font-weight: 600; color: #64748B; margin-bottom: 2px;">Szakértői egyeztetés</div>
                                        <div style="font-size: 13px; color: #64748B; line-height: 1.4;">A véglegesített időpontban megtartjuk a díjmentes online egyeztetést, ahol részletesen átbeszéljük a felmerült igényeket.</div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="font-size: 14px; color: #64748B; margin: 0 0 32px 0; line-height: 1.5; border-top: 1px solid #F1F5F9; padding-top: 24px;">
                                Ha bármilyen kérdése lenne, vagy módosítani szeretné a megadott adatokat, kérjük, válaszoljon közvetlenül erre az e-mailre.
                            </p>
                            
                            <!-- Signature -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td>
                                        <div style="font-size: 14px; color: #475569;">Üdvözlettel,</div>
                                        <div style="font-size: 16px; font-weight: 700; color: #06B6D4; margin-top: 4px;">BacklineIT Csapata</div>
                                        <div style="font-size: 12px; color: #94A3B8; margin-top: 2px;">hello@backlineit.hu | www.backlineit.hu</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer Section -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.4;">
                            Ezt az e-mailt azért kapta, mert kapcsolatfelvételi vagy konzultációs igényt küldött el a backlineit.hu weboldalon.<br>
                            &copy; 2026 BacklineIT. Minden jog fenntartva.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
}

function getAdminNotificationEmailHtml(name: string, email: string, formattedDateTime: string, topic: string, message: string, extraFields?: Array<{label: string, value: string}>): string {
    let extraRowsHtml = '';
    if (extraFields && extraFields.length > 0) {
        extraRowsHtml = extraFields.map(f => `
            <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748B;" width="35%">${f.label}</td>
                <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0F172A;">${f.value}</td>
            </tr>
        `).join('');
    }

    return `
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Új Megkeresés Érkezett</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #1E293B;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" max-width="600px" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);">
                    <!-- Header Accent Bar -->
                    <tr>
                        <td height="6" style="background: linear-gradient(90deg, #F59E0B 0%, #3B82F6 50%, #06B6D4 100%);"></td>
                    </tr>
                    
                    <!-- Header Branding -->
                    <tr>
                        <td style="padding: 32px 40px 24px 40px; text-align: left; border-bottom: 1px solid #F1F5F9;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td>
                                        <div style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #0F172A;">
                                            <span style="color: #06B6D4;">Backline</span>IT <span style="font-weight: 300; color: #64748B; font-size: 16px;">Admin</span>
                                        </div>
                                    </td>
                                    <td style="text-align: right;">
                                        <span style="display: inline-block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #D97706; background-color: #FEF3C7; border: 1px solid #FDE68A; padding: 4px 10px; border-radius: 9999px;">
                                            Új megkeresés
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Main Body Content -->
                    <tr>
                        <td style="padding: 40px 40px 32px 40px;">
                            <h1 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 8px 0; line-height: 1.3;">Szia Norbert!</h1>
                            <p style="font-size: 15px; color: #475569; margin: 0 0 24px 0; line-height: 1.6;">
                                Új megkeresés/foglalás érkezett a BacklineIT weboldaláról. Az alábbiakban találod a beérkezett adatokat:
                            </p>
                            
                            <!-- Customer and Booking Details Table -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0; margin-bottom: 24px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748B; margin-bottom: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">Megkeresés Adatai</div>
                                        
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 13px; color: #64748B;" width="35%">Név</td>
                                                <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0F172A;">${name}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 13px; color: #64748B;">E-mail</td>
                                                <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #2563EB;"><a href="mailto:${email}" style="color: #2563EB; text-decoration: none;">${email}</a></td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 13px; color: #64748B;">Időpont</td>
                                                <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0F172A;">${formattedDateTime}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 13px; color: #64748B;">Téma / Megoldás</td>
                                                <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0F172A;">
                                                    <span style="background-color: #ECFDF5; border: 1px solid #A7F3D0; color: #065F46; font-size: 12px; padding: 2px 8px; border-radius: 4px; font-weight: 600;">
                                                        ${topic}
                                                    </span>
                                                </td>
                                            </tr>
                                            ${extraRowsHtml}
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Customer Message Block -->
                            <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748B; margin-bottom: 8px; margin-left: 4px;">Leírás / Üzenet:</div>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; border-radius: 0 8px 8px 0; margin-bottom: 32px;">
                                <tr>
                                    <td style="padding: 16px 20px; font-size: 14px; line-height: 1.5; color: #451A03; font-style: italic;">
                                        "${message || 'Nem adott meg külön üzenetet.'}"
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Call to Action Button to Open Admin Dashboard -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://backlineit.hu/hu/admin" style="display: inline-block; background-color: #3B82F6; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.15); transition: background-color 0.2s;">
                                            Megnyitás az Admin Felületen
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="font-size: 13px; color: #94A3B8; text-align: center; margin: 0;">
                                A válaszadáshoz válaszolj erre az e-mailre, vagy vedd fel a kapcsolatot az ügyféllel a megadott e-mail címen.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer Section -->
                    <tr>
                        <td style="padding: 20px 40px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.4;">
                            Ez egy automatikus rendszerüzenet a BacklineIT platformról.<br>
                            &copy; 2026 BacklineIT. Minden jog fenntartva.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
}
