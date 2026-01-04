export const GOOGLE_SHEET_IDS = {
    POSITIVE_FEEDBACK: '1Tu7ykUwoy2ED5al4HM--z5GxNKtdul24UHeVpVf2-Vs',
    NEGATIVE_FEEDBACK: '187zRwoGwlJ_x91FIS_hZqOoiti8frH9bYJMjsY78NjU',
    NEWSLETTER: '1_BNHRpBFvOIWaHy6xg-AZcMp_eMOzR2C1dA9p65fynM',
    BOOKING: '1IYnHe39sbJfGtFIKQdz1H3UrOgv2bLaNYHB2YNrcyk4',
    EMAIL_LOG: '1ZYMXt7lPR8pgq5EI9v1FgTCEjojj-l6qG_6yiempiDE',
};

export type WebhookAction =
    | 'feedback'
    | 'newsletter'
    | 'booking'
    | 'purchase'
    | 'verification'
    | 'chat'
    | 'crm_sync'
    | 'incoming_email'
    | 'ticket_created'
    | 'ticket';

export interface WebhookBody {
    action: WebhookAction;
    email?: string;
    name?: string;
    feedback?: string;
    date?: string;
    topic?: string;
    message?: string;
    ticketNumber?: string;
    subject?: string;
    description?: string;
    userName?: string;
    userEmail?: string;
    products?: any[]; // For purchase
    history?: any[]; // For chat
    [key: string]: any;
}
