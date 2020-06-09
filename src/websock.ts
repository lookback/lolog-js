import { ClientOpts, Transport } from './driver';

interface Listener {
    n: string;
    l: (ev: Event) => void;
}

/**
 * Create a websocket transport for syslog messages.
 */
export const connectWebsocket = (copts: ClientOpts): Promise<Transport> => new Promise((rs, rj) => {

    const proto = copts.useTls ? 'wss' : 'ws';
    const url = `${proto}://${copts.host}:${copts.port}`;

    try {
        const ws = new WebSocket(url);

        let timeout = {
            ms: 0,
            cb: () => { },
        };
        let timer = setTimeout(() => { }, 0);

        // reset the timeout to happen later
        const resetTimeout = () => {
            clearTimeout(timer);
            timer = setTimeout(timeout.cb, timeout.ms);
        };

        // all added listeners, so we can remove them
        const listeners: Listener[] = [];

        // shim over the websocket to adapt to a node net.Socket
        const sock: Transport = {
            setTimeout: (ms, cb) => {
                timeout = { ms, cb };
                resetTimeout();
            },
            end: () => {
                clearTimeout(timer);
                ws.close();
            },
            on: (n, cb) => {
                const l = (ev: Event) => {
                    if (n == 'error') {
                        cb(new Error("Websocket error: " + ev));
                    } else {
                        cb(null, ev);
                    }
                };
                listeners.push({ n, l });
                ws.addEventListener(n, l);
            },
            removeAllListeners: () => {
                listeners.forEach(({ n, l }) => ws.removeEventListener(n, l));
            },
            write: (msg, cb) => {
                resetTimeout();
                try {
                    ws.send(msg);
                } catch (e) {
                    cb(e);
                }
            },
        };

        // wait for open event before relasing the connection
        ws.addEventListener('open', () => rs(sock));
    } catch (e) {
        rj(e);
    }
});
