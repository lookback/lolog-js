import * as net from 'net';
import { AddressInfo } from 'net';
import { createLogger, Compliance } from '../src/index';

const mockSyslogServer = () => new Promise<{ port: number, msg: Promise<string> }>(resolvePort => {
    const msg = new Promise<string>((resolveMsg, rejectMsg) => {
        const server = net.createServer(c => {
            c.on('data', (data) => {
                clearTimeout(timer);
                const s = data.toString();
                resolveMsg(s);
                server.close();
            });
        });
        const timer = setTimeout(() => {
            rejectMsg(new Error("timeout"));
            server.close();
        }, 500);
        server.listen(0, () => {
            const port = (<AddressInfo>server.address()).port;
            resolvePort({ port, msg });
        });
    });
});

export const createMockLogger = async () => {
    const { port, msg } = await mockSyslogServer();
    const log = createLogger({
        logHost: '127.0.0.1',
        logPort: port,
        host: 'testhost',
        appName: 'test-app',
        appVersion: '2.11',
        apiKey: 'apikey',
        env: 'testing',
        compliance: Compliance.Full,
        disableTls: true,
        disableUuid: true,
    });
    return { msg, log };
};
