import { ClientOpts, Transport } from './driver';

interface Todo {
    time: number;
    msg: string;
    cb: (e: Error | null) => void;
}

/**
 * Create a websocket transport for syslog messages.
 */
export const connectHttp = (endpoint: string) =>
    (copts: ClientOpts): Promise<Transport> => new Promise((rs) => {
        const proto = copts.useTls ? 'https' : 'http';
        const url = `${proto}://${copts.host}:${copts.port}${endpoint}`;

        // messages that are to be sent.
        const todo: Todo[] = [];

        // tslint:disable-next-line:no-let
        let send_timeout: any = null;

        // schedules a doSend 10_000 from a given from time.
        const schedule = (from: number) => {
            const lapsed = Date.now() - from;
            const to_go = Math.max(0, 10_000 - lapsed);
            send_timeout = setTimeout(doSend, to_go);
        };

        const doSend = () => {
            // deliberately not null send_timeout until we are sure
            // we got the current batch out.

            // take all that are in todo now.
            const to_send = todo.splice(0, todo.length);
            if (!to_send.length) {
                return;
            }

            // messages are already terminated with \n
            const body = to_send.map(t => t.msg).join('');

            // callback over all listeners
            const cb = (err: null | Error) => {
                to_send.forEach(t => t.cb(err));
            };

            // attempt to send the batch
            fetch(url, {
                method: 'POST',
                mode: 'cors',
                body,
            })
                .then(res => {
                    // res status 0 is cors
                    if (res.status != 200 && res.status != 0) {
                        const msg = `POST ${url}: ${res.status} ${res.statusText}`;
                        return Promise.reject(new Error(msg));
                    }
                    cb(null);
                    return Promise.resolve();
                })
                .catch(e => {
                    cb(e);
                })
                .finally(() => {
                    // while we were sending this batch, there might have been more
                    // events added into doSend. wait the amount remaining and then
                    // clear them.
                    if (todo.length) {
                        schedule(todo[0].time);
                    } else {
                        // this makes the next write cause another delayed batch.
                        send_timeout = null;
                    }
                });
        };

        // shim over fetch to adapt to a node net.Socket
        const sock: Transport = {
            setTimeout: (ms, cb) => {
            },
            end: () => {
                if (send_timeout) {
                    clearTimeout(send_timeout);
                    send_timeout = null;
                }
            },
            on: (n, cb) => {
            },
            removeAllListeners: () => {
            },
            write: (msg, cb) => {
                const time = Date.now();
                todo.push({ time, msg, cb });
                if (!send_timeout) {
                    schedule(time);
                }
            },
        };

        rs(sock);
    });
