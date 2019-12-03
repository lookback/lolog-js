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
            if (copts.useTls) {
                return tls.connect(o);
            }
            else {
                return net.connect(o);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NvY2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztHQUVHO0FBQ1UsUUFBQSxhQUFhLEdBQUcsQ0FBQyxLQUFpQixFQUFzQixFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7SUFDM0YsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsSUFBSTtRQUNBLHlCQUF5QjtRQUN6QixNQUFNLEtBQUssR0FBRztZQUNWLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsTUFBTTtTQUNULENBQUM7UUFFRixnQkFBZ0I7UUFDaEIsTUFBTSxDQUFDLHFCQUFRLEtBQUssQ0FBRSxDQUFDO1FBRXZCLDZCQUE2QjtRQUM3QixNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUNmLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtnQkFDZCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekI7aUJBQU07Z0JBQ0gsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pCO1FBQ0wsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUVMLDZCQUE2QjtRQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEMsaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FFbEQ7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNSLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNUO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==