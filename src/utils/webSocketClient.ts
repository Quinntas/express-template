import {WebSocket} from 'ws';
import {InternalError} from '../core/errors';

/**
 * A WebSocket service class for establishing and managing WebSocket connections.
 */
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

    /**
     * Sends a message through the WebSocket connection.
     *
     * @param {T} message - The message to be sent.
     *
     * @throws {InternalError} Throws an InternalError if the WebSocket is not open.
     */
    public sendMessage<T>(message: T) {
        if (this.socket.readyState !== WebSocket.OPEN) throw new InternalError('WebSocket is not open');
        this.socket.send(JSON.stringify(message), (err: any) => {
            if (err) console.log('[WS] Error sending message', err);
        });
    }

    /**
     * Connects to the server using a socket connection.
     *
     * @return {Promise<void>} A promise that resolves when the connection is successfully established.
     */
    public connect() {
        return new Promise<void>((resolve) => {
            this.socket.on('open', () => {
                resolve();
            });
        });
    }
}
