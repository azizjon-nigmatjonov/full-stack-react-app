/**
 * Telegram Bot Integration for sending notifications
 */

/**
 * Send message to Telegram channel
 * @param {string} message - Message to send
 * @param {string} botToken - Telegram bot token
 * @param {string} channelId - Telegram channel ID or username (e.g., "@yourchannel" or "-1001234567890")
 * @returns {Promise<Object>} - Telegram API response
 */
export const sendTelegramMessage = async (message, botToken, channelId) => {
    try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: channelId,
                text: message,
                parse_mode: 'HTML', // Enables HTML formatting
                disable_web_page_preview: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Telegram API error: ${errorData.description || response.statusText}`);
        }

        const data = await response.json();
        console.log('Telegram message sent successfully:', data);
        return data;
    } catch (error) {
        console.error('Error sending Telegram message:', error);
        throw error;
    }
};

/**
 * Send blog post notification to Telegram
 * @param {string} blogUrl - Full URL of the blog post
 * @param {string} title - Blog post title
 * @param {string} excerpt - Blog post excerpt
 * @returns {Promise<Object>} - Telegram API response
 */
export const sendBlogPostNotification = async (blogUrl, title, excerpt) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;

    if (!botToken || !channelId) {
        console.warn('Telegram credentials not configured. Skipping notification.');
        return null;
    }
    // 🚀 <b>New Blog Post Published!</b>
    // 📝 
    const message = `
<b>${title}</b>

${excerpt}

🔗 <a href="${blogUrl}">Read more on my website→</a>
    `.trim();

    return await sendTelegramMessage(message, botToken, channelId);
};
