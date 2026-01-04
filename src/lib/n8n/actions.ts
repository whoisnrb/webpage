import { WebhookBody, GOOGLE_SHEET_IDS } from './config';
import { appendToSheet, sendEmail, generateAIResponse, analyzeSentiment } from './services';

const SYSTEM_PROMPTS = {
    POSITIVE_RESPONSE: `You are a customer support representative for an AI Automation Agency known as It services.hu specialized in helping SME implement AI Agents and AI Automation solutions. Write a friendly response to the customer feedback below. Format as HTML email and sign from Marc at It services.hu. Return only HTML code.`,
    APOLOGY_RESPONSE: `You are a customer support representative for an AI Automation Agency known as It services.hu. Write a friendly and concise response to the following customer feedback. The email should thank the client for their feedback, acknowledge their concerns, and inform that this has been escalated to our management. Offer to extend their current automation package with one additional AI Agent integration at no extra charge. Format as HTML email and sign from Marc at It services.hu. Return only HTML code.`,
    SUGGEST_IMPROVEMENTS: `You are a customer support representative for an AI Automation Agency known as It services.hu. A client just submitted feedback about our services. Please provide a concise suggestion on what It services.hu can do to address their concerns and improve client satisfaction in the future.`,
    CHAT_ALVIN: `Te Alvin vagy, a BacklineIT automatizációs és rendszerüzemeltetési szakértő AI asszisztense.
Célod: Segíteni a látogatóknak eligazodni a szolgáltatások között, és megválaszolni a technikai vagy üzleti kérdéseiket.
Stílusod: Professzionális, de barátságos, segítőkész és lényegretörő.
Ha nem tudod a választ, javasold a "Kapcsolat" menüpontot.`
};

export async function processFeedback(body: WebhookBody) {
    const { email, name, feedback } = body;
    if (!email || !feedback) throw new Error('Missing email or feedback');

    const sentiment = await analyzeSentiment(feedback);
    console.log(`[Feedback] Sentiment determined: ${sentiment}`);

    if (sentiment === 'Positive') {
        // 1. Add to Sheet
        await appendToSheet(GOOGLE_SHEET_IDS.POSITIVE_FEEDBACK, [name || '', email, feedback]);

        // 2. Generate Response
        const aiResponse = await generateAIResponse(
            `Customer Name: ${name}\nFeedback: ${feedback}`,
            SYSTEM_PROMPTS.POSITIVE_RESPONSE
        );

        // 3. Send Email
        await sendEmail(email, 'Thank you for your valuable feedback', aiResponse);

    } else {
        // Negative
        // 1. Suggest Improvements (Internal)
        const suggestion = await generateAIResponse(
            `Feedback: ${feedback}`,
            SYSTEM_PROMPTS.SUGGEST_IMPROVEMENTS
        );

        // 2. Add to Sheet (with suggestion)
        await appendToSheet(GOOGLE_SHEET_IDS.NEGATIVE_FEEDBACK, [name || '', email, feedback, suggestion]);

        // 3. Generate Apology Email
        const apologyEmail = await generateAIResponse(
            `Customer Name: ${name}\nFeedback: ${feedback}`,
            SYSTEM_PROMPTS.APOLOGY_RESPONSE
        );

        // 4. Send Email
        await sendEmail(email, "We're sorry - here's how we'll fix this", apologyEmail);
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
        `Kedves Feliratkozó!<br><br>Köszönjük, hogy feliratkoztál hírlevelünkre. Hamarosan küldjük a legfrissebb IT tippeket.<br><br>Üdvözlettel,<br>IT Services Csapat`
    );

    return { success: true };
}

export async function processBooking(body: WebhookBody) {
    const { name, email, date, topic, message } = body;

    // 1. Save to Sheet
    await appendToSheet(GOOGLE_SHEET_IDS.BOOKING, [name || '', email || '', date || '', topic || '', message || '']);

    // 2. Notify Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'whoisnrb@gmail.com';
    await sendEmail(
        adminEmail,
        'Új Időpontfoglalás Érkezett',
        `Új foglalás érkezett:<br><br>Név: ${name}<br>Email: ${email}<br>Dátum: ${date}<br>Téma: ${topic}<br>Üzenet: ${message}`
    );

    // 3. Confirm to User
    if (email) {
        await sendEmail(
            email,
            'Időpontfoglalás Visszaigazolása',
            `Kedves Ügyfelünk!<br><br>Megkaptuk időpontfoglalási igényét. Hamarosan felvesszük Önnel a kapcsolatot a véglegesítés miatt.<br><br>Üdvözlettel,<br>IT Services Csapat`
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
    const { message } = body;
    const response = await generateAIResponse(message || '', SYSTEM_PROMPTS.CHAT_ALVIN);
    return { output: response };
}

export async function processPurchase(body: WebhookBody) {
    const { email, name, products } = body;

    // Logic from n8n "Format Email" node
    const licensedProducts = (products || []).filter((p: any) => p.isLicensed);
    let emailBody = `Dear ${name || 'Customer'},<br><br>Thank you for your purchase!<br><br>`;

    if (licensedProducts.length > 0) {
        emailBody += "Here are the license keys for your products:<br><br>";
        licensedProducts.forEach((p: any) => {
            emailBody += `Product: ${p.name}<br>License Key: ${p.licenseKey}<br><br>`;
        });
    } else {
        emailBody += "Your subscription is active. No separate license keys are required for your current products.<br>";
    }

    emailBody += "Best regards,<br>Your Team";

    if (email) {
        await sendEmail(email, 'Your Purchase Confirmation & Licenses', emailBody);
    }

    return { success: true };
}
