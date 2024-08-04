import {ConsumeMessage} from 'amqplib/properties';
import {Result} from 'ts-results';
import {log} from '../../modules/shared/infra/log';
import {RabbitMQClient} from '../../services/internal/clients/rmqClient';

export interface EventDTO<T> {
    data: T;
}

export type EventFunction<T> = (payload: EventDTO<T>) => Result<any, Error> | Promise<Result<any, Error>>;

export type EventRouter = Record<string, EventFunction<any>>;

type EventExtractKeys<T extends EventRouter> = keyof T;

type EventExtractDTO<T extends EventFunction<any>> = T extends EventFunction<infer R> ? R : never;

interface InternalEventDTO<T> {
    data: T;
    name: string;
}

export class Event<R extends EventRouter> {
    private readonly queue: string;
    private readonly rmqClient: RabbitMQClient;
    private readonly eventRouter: EventRouter;

    constructor(queue: string, eventRouter: EventRouter, rmqClient: RabbitMQClient) {
        this.queue = queue;
        this.eventRouter = eventRouter;
        this.rmqClient = rmqClient;
    }

    dispatch<T extends EventExtractKeys<R>>(event: EventExtractKeys<R>, payload: EventExtractDTO<R[T]>) {
        return this.rmqClient.send<InternalEventDTO<EventExtractDTO<R[T]>>>(this.queue, {
            data: payload,
            name: event as string,
        });
    }

    private async handler(message: ConsumeMessage | null) {
        try {
            if (!message) throw new Error('Message is null');
            const payload = JSON.parse(message.content.toString()) as InternalEventDTO<any>;
            const evtHandler = this.eventRouter[payload.name];
            if (!evtHandler) throw new Error('No handler found for event');
            await evtHandler(payload.data);
        } catch (error: unknown) {
            log.error(error);
        }
    }

    async consume() {
        return await this.rmqClient.consume(this.queue, (msg) => this.handler(msg));
    }
}
