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

    // 3. Notify Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'whoisnrb@gmail.com';
    await sendEmail(
        adminEmail,
        'Új Időpontfoglalás Érkezett',
        `Új foglalás érkezett:<br><br>Név: ${name}<br>Email: ${email}<br>Időpont: ${date} ${time || ''}<br>Téma: ${topic}<br>Üzenet: ${message}`
    );

    // 4. Confirm to User
    if (email) {
        await sendEmail(
            email,
            'Időpontfoglalás Visszaigazolása',
            `Kedves Ügyfelünk!<br><br>Megkaptuk időpontfoglalási igényét (${date} ${time || ''}). Hamarosan felvesszük Önnel a kapcsolatot a véglegesítés miatt.<br><br>Üdvözlettel,<br>BacklineIT Csapata`
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

    // 2. Notify Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'whoisnrb@gmail.com';
    await sendEmail(
        adminEmail,
        'Új Konzultációs Igény',
        `Új konzultációs igény érkezett a weboldalról:<br><br>
        <strong>Név:</strong> ${name}<br>
        <strong>Email:</strong> ${email}<br>
        <strong>Cég:</strong> ${company || '-'}<br>
        <strong>Telefon:</strong> ${phone || '-'}<br>
        <strong>Megoldás:</strong> ${productName || '-'} ${packageName ? `(${packageName})` : ''}<br>
        <br>
        <strong>Leírás:</strong><br>${description}`
    );

    // 3. Confirm to User
    if (email) {
        await sendEmail(
            email,
            'Konzultációs igényét fogadtuk',
            `Kedves ${name}!<br><br>
            Köszönjük érdeklődését! Megkaptuk konzultációs igényét a következővel kapcsolatban: <strong>${productName || 'Automatizációs megoldások'}</strong>.<br><br>
            Kollégáink hamarosan felveszik Önnel a kapcsolatot a megadott elérhetőségeken (általában 24 órán belül).<br><br>
            Üdvözlettel,<br>
            A BacklineIT Csapata`
        );
    }

    return { success: true };
}
