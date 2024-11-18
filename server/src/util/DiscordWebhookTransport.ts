import axios from 'axios';
import TransportStream from 'winston-transport';
import config from '../config/config'


interface DiscordWebhookTransportOptions {
    webhookUrl: string;
    level?: string;
}

interface LogInfo {
    level: string;
    message: string;
    timestamp?: string;
    meta?: Record<string, unknown>;
}

export class DiscordWebhookTransport extends TransportStream {
    private readonly webhookUrl: string;

    constructor(opts: DiscordWebhookTransportOptions) {
        super(opts);
        this.webhookUrl = opts.webhookUrl;
        this.level = opts.level || 'info';
    }

    log(info: LogInfo, callback: () => void): void {
        const {level, message, timestamp, meta = {} } = info;
        const logTimestamp = timestamp || new Date().toISOString();

        const logMessage = {
            username: `Logger Bot by ${config.USER}`,
            content: `**Level**: ${level.toUpperCase()}\n**Timestamp**: ${logTimestamp}\n**Message**: ${message}\n**Meta**: \`\`\`json\n${JSON.stringify(meta, null, 2)}\`\`\``
        };

        axios.post(this.webhookUrl, logMessage)
            .then(() => {
                callback();
            })
            .catch(() => {
                callback();
            });
    }
}
