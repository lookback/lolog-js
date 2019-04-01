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