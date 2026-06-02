const axios = require('axios');

class TelegramNotifier {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
  }

  async send(message) {
    if (!this.token || !this.chatId) return false;
    try {
      await axios.post(`https://api.telegram.org/bot${this.token}/sendMessage`, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
      return true;
    } catch (err) {
      console.error('Telegram send error:', err.message);
      return false;
    }
  }

  async notifyJobCreated(job) {
    await this.send(`📥 <b>Nouveau job</b> (${job.id.slice(0, 8)}...)\nQueue: ${job.queueId.slice(0, 8)}...\nStatus: pending`);
  }

  async notifyJobCompleted(job) {
    await this.send(`✅ <b>Job complété</b> (${job.id.slice(0, 8)}...)`);
  }

  async notifyJobFailed(job) {
    await this.send(`❌ <b>Job échoué</b> (${job.id.slice(0, 8)}...)\nErreur: ${job.error}`);
  }
}

module.exports = new TelegramNotifier();
