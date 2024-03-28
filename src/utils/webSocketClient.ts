import {WebSocket} from 'ws';
import {InternalError} from '../core/errors';

export class WebSocketService {
    private socket: WebSocket;

    constructor(url: string) {
        this.socket = new WebSocket(url);

        this.socket.on('open', () => {
            console.log('[WS] Connected');
        });

        this.socket.on('error', (err: any) => {
            console.log('[WS] Error', err);
        });
    }

    public sendMessage<T>(message: T) {
        if (this.socket.readyState !== WebSocket.OPEN) throw new InternalError('WebSocket is not open');
        this.socket.send(JSON.stringify(message), (err: any) => {
            if (err) console.log('[WS] Error sending message', err);
        });
    }

    public connect() {
        return new Promise<void>((resolve) => {
            this.socket.on('open', () => {
                resolve();
            });
        });
    }
}
