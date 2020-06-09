import net from 'net';
import { AddressInfo } from 'net';
import { createLogger, Compliance, Options } from '../src/index';

export interface MockServerOpts {
    timeout?: number;
    disconnectFirst?: boolean;
}

const FORCE_DISCONNECT = new Error("Force disconnect as part of test");

const mockSyslogServer = (opts: MockServerOpts = {}) =>
  new Promise<{ port: number, msg: Promise<string> }>(resolvePort => {
    const msg = new Promise<string>((resolveMsg, rejectMsg) => {
        let firstDisconnected = false;
        const server = net.createServer(c => {
            c.on('error', (e) => {
                if (e === FORCE_DISCONNECT) {
                    // that's fine
                } else {
                    console.error(e);
                    process.exit(-1);
                }
            });
            if (opts.disconnectFirst && !firstDisconnected) {
                firstDisconnected = true;
                c.destroy(FORCE_DISCONNECT);
                return;
            }
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
        }, opts.timeout || 500);
        server.listen(0, () => {
            const port = (<AddressInfo>server.address()).port;
            resolvePort({ port, msg });
        });
    });
});

const DEFAULT_MOCK_OPTS: Options = {
    logHost: '127.0.0.1',
    logPort: -1,
    host: 'testhost',
    appName: 'test-app',
    appVersion: '2.11',
    apiKeyId: 'u',
    apiKey: 'apikey',
    env: 'testing',
    compliance: Compliance.Full,
    disableTls: true,
    disableUuid: true,
};

export const createMockLogger = async (opts?: MockServerOpts, overrideOpts?: Partial<Options>) => {
    const { port, msg } = await mockSyslogServer(opts);
    const log = createLogger({
        ...DEFAULT_MOCK_OPTS,
        ...overrideOpts,
        logPort: port,
    });
    return { msg, log };
};
