import client from 'amqplib';
import {ConsumeMessage} from 'amqplib/properties';
import {Result} from 'ts-results';

export type OnMessageFunction = (msg: ConsumeMessage | null) => any;

export abstract class EventService {
    abstract connect(): Promise<void>;

    abstract send<T extends object>(queueName: string, msg: T, options?: client.Options.Publish): Promise<Result<void, Error>>;

    abstract consume(queueName: string, onMessage: OnMessageFunction): Promise<Result<any, Error>>;
}
