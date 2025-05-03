const axios = require('axios');

// URL of the Discord Webhook
const discordWebhookUrl = "your-webhook-url";

async function sendNotification() {
    try {
        await axios.post(discordWebhookUrl, {
            "embeds": [{
                "title": "The Backend Is Now Offline!",
                "color": 15548997 //Red
            }]
        });
        console.log("Successfully sended notify to the server.");
    } catch (error) {
        console.error("Error sending the notify:", error);
    }
}
// Calls the function for the notify
sendNotification();
