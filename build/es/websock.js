/**
 * Create a websocket transport for syslog messages.
 */
export const connectWebsocket = (copts) => new Promise((rs, rj) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vic29jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93ZWJzb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFpQixFQUFzQixFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7SUFFOUYsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDMUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxLQUFLLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFckQsSUFBSTtRQUNBLE1BQU0sRUFBRSxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTlCLGtDQUFrQztRQUNsQyxJQUFJLE9BQU8sR0FBRztZQUNWLEVBQUUsRUFBRSxDQUFDO1lBQ0wsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7U0FDaEIsQ0FBQztRQUNGLGtDQUFrQztRQUNsQyxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXJDLG9DQUFvQztRQUNwQyxNQUFNLFlBQVksR0FBRyxHQUFHLEVBQUU7WUFDdEIsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLEtBQUssR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDO1FBRUYsNkNBQTZDO1FBQzdDLE1BQU0sU0FBUyxHQUFlLEVBQUUsQ0FBQztRQUVqQyx3REFBd0Q7UUFDeEQsTUFBTSxJQUFJLEdBQWM7WUFDcEIsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUNuQixPQUFPLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7Z0JBQ3JCLFlBQVksRUFBRSxDQUFDO1lBQ25CLENBQUM7WUFDRCxHQUFHLEVBQUUsR0FBRyxFQUFFO2dCQUNOLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEIsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2YsQ0FBQztZQUNELEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFDVixNQUFNLENBQUMsR0FBRyxDQUFDLEVBQVMsRUFBRSxFQUFFO29CQUNwQixJQUFJLENBQUMsSUFBSSxPQUFPLEVBQUU7d0JBQ2QsRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLG1CQUFtQixHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQzNDO3lCQUFNO3dCQUNILEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7cUJBQ2hCO2dCQUNMLENBQUMsQ0FBQztnQkFDRixTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3pCLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUIsQ0FBQztZQUNELGtCQUFrQixFQUFFLEdBQUcsRUFBRTtnQkFDckIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEUsQ0FBQztZQUNELEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFDZixZQUFZLEVBQUUsQ0FBQztnQkFDZixJQUFJO29CQUNBLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2hCO2dCQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNSLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDVDtZQUNMLENBQUM7U0FDSixDQUFDO1FBRUYscURBQXFEO1FBQ3JELEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDL0M7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNSLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNUO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==