"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a websocket transport for syslog messages.
 */
exports.connectWebsocket = (copts) => new Promise((rs, rj) => {
    const proto = copts.useTls ? 'wss' : 'ws';
    const url = `${proto}://${copts.host}:${copts.port}`;
    try {
        const ws = new WebSocket(url);
        // tslint:disable-next-line:no-let
        let timeout = {
            ms: 0,
            cb: () => { },
        };
        // tslint:disable-next-line:no-let
        let timer = setTimeout(() => { }, 0);
        // reset the timeout to happen later
        const resetTimeout = () => {
            clearTimeout(timer);
            timer = setTimeout(timeout.cb, timeout.ms);
        };
        // all added listeners, so we can remove them
        const listeners = [];
        // shim over the websocket to adapt to a node net.Socket
        const sock = {
            setTimeout: (ms, cb) => {
                timeout = { ms, cb };
                resetTimeout();
            },
            end: () => {
                clearTimeout(timer);
                ws.close();
            },
            on: (n, cb) => {
                const l = (ev) => {
                    if (n == 'error') {
                        cb(new Error("Websocket error: " + ev));
                    }
                    else {
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
                }
                catch (e) {
                    cb(e);
                }
            },
        };
        // wait for open event before relasing the connection
        ws.addEventListener('open', () => rs(sock));
    }
    catch (e) {
        rj(e);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vic29jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJzb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBT0E7O0dBRUc7QUFDVSxRQUFBLGdCQUFnQixHQUFHLENBQUMsS0FBaUIsRUFBc0IsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0lBRTlGLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsS0FBSyxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRXJELElBQUk7UUFDQSxNQUFNLEVBQUUsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU5QixrQ0FBa0M7UUFDbEMsSUFBSSxPQUFPLEdBQUc7WUFDVixFQUFFLEVBQUUsQ0FBQztZQUNMLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1NBQ2hCLENBQUM7UUFDRixrQ0FBa0M7UUFDbEMsSUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVyQyxvQ0FBb0M7UUFDcEMsTUFBTSxZQUFZLEdBQUcsR0FBRyxFQUFFO1lBQ3RCLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixLQUFLLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQztRQUVGLDZDQUE2QztRQUM3QyxNQUFNLFNBQVMsR0FBZSxFQUFFLENBQUM7UUFFakMsd0RBQXdEO1FBQ3hELE1BQU0sSUFBSSxHQUFjO1lBQ3BCLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFDbkIsT0FBTyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO2dCQUNyQixZQUFZLEVBQUUsQ0FBQztZQUNuQixDQUFDO1lBQ0QsR0FBRyxFQUFFLEdBQUcsRUFBRTtnQkFDTixZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNmLENBQUM7WUFDRCxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBQ1YsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFTLEVBQUUsRUFBRTtvQkFDcEIsSUFBSSxDQUFDLElBQUksT0FBTyxFQUFFO3dCQUNkLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUMzQzt5QkFBTTt3QkFDSCxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUNoQjtnQkFDTCxDQUFDLENBQUM7Z0JBQ0YsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN6QixFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlCLENBQUM7WUFDRCxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7Z0JBQ3JCLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLENBQUM7WUFDRCxLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBQ2YsWUFBWSxFQUFFLENBQUM7Z0JBQ2YsSUFBSTtvQkFDQSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNoQjtnQkFBQyxPQUFPLENBQUMsRUFBRTtvQkFDUixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ1Q7WUFDTCxDQUFDO1NBQ0osQ0FBQztRQUVGLHFEQUFxRDtRQUNyRCxFQUFFLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQy9DO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDUixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDVDtBQUNMLENBQUMsQ0FBQyxDQUFDIn0=