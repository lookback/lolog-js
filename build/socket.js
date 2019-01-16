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
        const isLogglySSl = copts.host === 'logs-01.loggly.com' && copts.port == 6514;
        // options for all things
        const basic = {
            host: copts.host,
            port: copts.port,
            family,
        };
        // add certificate for loggly (it's self signed)
        const extra = isLogglySSl ? {
            rejectUnauthorized: false,
        } : {};
        // merged params
        const o = Object.assign({}, basic, extra);
        if (copts.useTls) {
            const conn = tls.connect(o, () => rs(conn));
        }
        else {
            const conn = net.createConnection(o, () => rs(conn));
        }
    }
    catch (e) {
        rj(e);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NvY2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztHQUVHO0FBQ1UsUUFBQSxhQUFhLEdBQUcsQ0FBQyxLQUFpQixFQUFzQixFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7SUFDM0YsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsSUFBSTtRQUNBLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssb0JBQW9CLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7UUFFOUUseUJBQXlCO1FBQ3pCLE1BQU0sS0FBSyxHQUFHO1lBQ1YsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixNQUFNO1NBQ1QsQ0FBQztRQUVGLGdEQUFnRDtRQUNoRCxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLGtCQUFrQixFQUFFLEtBQUs7U0FDNUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRVAsZ0JBQWdCO1FBQ2hCLE1BQU0sQ0FBQyxxQkFBUSxLQUFLLEVBQUssS0FBSyxDQUFFLENBQUM7UUFDakMsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2QsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDL0M7YUFBTTtZQUNILE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDeEQ7S0FDSjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ1Q7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9