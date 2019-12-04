"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a (nodejs) TCP/TLS socket to send syslog messages over.
 */
exports.connectSocket = (copts) => new Promise((rs, rj) => {
    const net = require('net');
    const tls = require('tls');
    const family = net.isIPv6(copts.host) ? 6 : 4;
    try {
        // options for all things
        const basic = {
            host: copts.host,
            port: copts.port,
            family,
        };
        // merged params
        const o = Object.assign({}, basic);
        // connection via tls or not.
        const conn = (() => {
            try {
                if (copts.useTls) {
                    return tls.connect(o);
                }
                else {
                    return net.connect(o);
                }
            }
            catch (e) {
                rj(e);
            }
        })();
        // the non-tls socket events.
        conn.once('connect', () => rs(conn));
        conn.once('error', (e) => rj(e));
        // the tls events
        conn.once('secureConnection', () => rs(conn));
        conn.once('tlsClientError', (e) => rj(e));
    }
    catch (e) {
        rj(e);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NvY2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztHQUVHO0FBQ1UsUUFBQSxhQUFhLEdBQUcsQ0FBQyxLQUFpQixFQUFzQixFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7SUFDM0YsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsSUFBSTtRQUNBLHlCQUF5QjtRQUN6QixNQUFNLEtBQUssR0FBRztZQUNWLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsTUFBTTtTQUNULENBQUM7UUFFRixnQkFBZ0I7UUFDaEIsTUFBTSxDQUFDLHFCQUFRLEtBQUssQ0FBRSxDQUFDO1FBRXZCLDZCQUE2QjtRQUM3QixNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUNmLElBQUk7Z0JBQ0EsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO29CQUNkLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDekI7cUJBQU07b0JBQ0gsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6QjthQUNKO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ1Q7UUFDTCxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRUwsNkJBQTZCO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0QyxpQkFBaUI7UUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUVsRDtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ1Q7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9