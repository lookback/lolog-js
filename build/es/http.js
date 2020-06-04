/**
 * Create a websocket transport for syslog messages.
 */
export const connectHttp = (endpoint) => (copts) => new Promise((rs) => {
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
                throw new Error(msg);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9odHRwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLENBQUMsUUFBZ0IsRUFBRSxFQUFFLENBQzVDLENBQUMsS0FBaUIsRUFBc0IsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDMUQsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDOUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxLQUFLLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxHQUFHLFFBQVEsRUFBRSxDQUFDO0lBRWhFLGdDQUFnQztJQUNoQyxNQUFNLElBQUksR0FBVyxFQUFFLENBQUM7SUFFeEIsa0NBQWtDO0lBQ2xDLElBQUksWUFBWSxHQUFRLElBQUksQ0FBQztJQUU3QixvREFBb0Q7SUFDcEQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtRQUM5QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztRQUMzQyxZQUFZLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM3QyxDQUFDLENBQUM7SUFFRixNQUFNLE1BQU0sR0FBRyxHQUFHLEVBQUU7UUFDaEIsdURBQXVEO1FBQ3ZELGdDQUFnQztRQUVoQyxpQ0FBaUM7UUFDakMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQ2pCLE9BQU87U0FDVjtRQUVELDBDQUEwQztRQUMxQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU5Qyw4QkFBOEI7UUFDOUIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFpQixFQUFFLEVBQUU7WUFDN0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUM7UUFFRiw0QkFBNEI7UUFDNUIsS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUNQLE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJO1NBQ1AsQ0FBQzthQUNHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNSLHVCQUF1QjtZQUN2QixJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUN0QyxNQUFNLEdBQUcsR0FBRyxRQUFRLEdBQUcsS0FBSyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDM0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN4QjtZQUNELEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNULE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzdCLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNQLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQzthQUNELE9BQU8sQ0FBQyxHQUFHLEVBQUU7WUFDViwrREFBK0Q7WUFDL0QsK0RBQStEO1lBQy9ELGNBQWM7WUFDZCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2IsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMxQjtpQkFBTTtnQkFDSCx5REFBeUQ7Z0JBQ3pELFlBQVksR0FBRyxJQUFJLENBQUM7YUFDdkI7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUMsQ0FBQztJQUVGLGdEQUFnRDtJQUNoRCxNQUFNLElBQUksR0FBYztRQUNwQixVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDdkIsQ0FBQztRQUNELEdBQUcsRUFBRSxHQUFHLEVBQUU7WUFDTixJQUFJLFlBQVksRUFBRTtnQkFDZCxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzNCLFlBQVksR0FBRyxJQUFJLENBQUM7YUFDdkI7UUFDTCxDQUFDO1FBQ0QsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ2QsQ0FBQztRQUNELGtCQUFrQixFQUFFLEdBQUcsRUFBRTtRQUN6QixDQUFDO1FBQ0QsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBQ2YsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDZixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbEI7UUFDTCxDQUFDO0tBQ0osQ0FBQztJQUVGLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNiLENBQUMsQ0FBQyxDQUFDIn0=