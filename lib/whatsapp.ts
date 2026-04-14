
export const sendWhatsAppMessage = async (to: string, text: string, userId?: string) => {
    console.log(`[WhatsApp Mock] Sending to ${to}: ${text}`);
    return { success: true };
};

export const sendWhatsAppMedia = async (to: string, mediaUrl: string, caption: string, userId?: string, type: string = 'image') => {
    console.log(`[WhatsApp Mock] Sending media ${mediaUrl} to ${to}`);
    return { success: true };
};
