import client, {Channel} from 'amqplib';
import {ConsumeMessage} from 'amqplib/properties';
import {Err, Ok} from 'ts-results';
import {EventService, OnMessageFunction} from '../../../lib/services/eventService';

export class RabbitMQClient extends EventService {
    private channel!: Channel;
    private connected: boolean = false;
    private readonly mqUrl: string;

    constructor(uri: string) {
        super();
        this.mqUrl = uri;
        this.connected = false;
    }

    async connect() {
        if (this.connected && this.channel) return;
        const rmqClient = await client.connect(this.mqUrl);
        this.channel = await rmqClient.createChannel();
        this.connected = true;
    }

    async send<T extends object>(queueName: string, msg: T, options?: client.Options.Publish) {
        if (!this.connected) return Err(new Error('Not connected to RabbitMQ'));

        const res = this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)), options);

        if (!res) return Err(new Error('Failed to send message'));

        return Ok.EMPTY;
    }

    async consume(queueName: string, onMessage: OnMessageFunction, options: client.Options.Consume = {}) {
        if (!this.connected) return Err(new Error('Not connected to RabbitMQ'));

        await this.channel.assertQueue(queueName, {
            durable: true,
        });

        return Ok(
            await this.channel.consume(
                queueName,
                (msg: ConsumeMessage | null) => {
                    {
                        onMessage(msg);
                        if (msg) this.channel.ack(msg);
                    }
                },
                {
                    ...options,
                    noAck: false,
                },
            ),
        );
    }
}
