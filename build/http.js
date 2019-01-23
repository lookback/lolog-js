"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a websocket transport for syslog messages.
 */
exports.connectHttp = (endpoint) => (copts) => new Promise((rs) => {
    const proto = copts.useTls ? 'https' : 'http';
    const url = `${proto}://${copts.host}:${copts.port}${endpoint}`;
    // messages that are to be sent.
    const todo = [];
    // tslint:disable-next-line:no-let
    let send_timeout = null;
    // schedules a doSend 10_000 from a given from time.
    const schedule = (from) => {
        const lapsed = Date.now() - from;
        const to_go = Math.max(0, 10000 - lapsed);
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
        const cb = (err) => {
            to_send.forEach(t => t.cb(err));
        };
        // attempt to send the batch
        fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            body,
        })
            .then(res => {
            if (res.status != 200) {
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
            }
            else {
                // this makes the next write cause another delayed batch.
                send_timeout = null;
            }
        });
    };
    // shim over fetch to adapt to a node net.Socket
    const sock = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9odHRwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUUE7O0dBRUc7QUFDVSxRQUFBLFdBQVcsR0FBRyxDQUFDLFFBQWdCLEVBQUUsRUFBRSxDQUM1QyxDQUFDLEtBQWlCLEVBQXNCLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQzFELE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQzlDLE1BQU0sR0FBRyxHQUFHLEdBQUcsS0FBSyxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksR0FBRyxRQUFRLEVBQUUsQ0FBQztJQUVoRSxnQ0FBZ0M7SUFDaEMsTUFBTSxJQUFJLEdBQVcsRUFBRSxDQUFDO0lBRXhCLGtDQUFrQztJQUNsQyxJQUFJLFlBQVksR0FBUSxJQUFJLENBQUM7SUFFN0Isb0RBQW9EO0lBQ3BELE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBWSxFQUFFLEVBQUU7UUFDOUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNqQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDM0MsWUFBWSxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUcsR0FBRyxFQUFFO1FBQ2hCLHVEQUF1RDtRQUN2RCxnQ0FBZ0M7UUFFaEMsaUNBQWlDO1FBQ2pDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsT0FBTyxD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