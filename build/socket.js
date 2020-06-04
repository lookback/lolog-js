"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a (nodejs) TCP/TLS socket to send syslog messages over.
 */
exports.connectSocket = (copts) => new Promise((rs, rj) => __awaiter(void 0, void 0, void 0, function* () {
    const net = yield Promise.resolve().then(() => __importStar(require('net')));
    const tls = yield Promise.resolve().then(() => __importStar(require('tls')));
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
        const conn = copts.useTls ? tls.connect(o) : net.connect(o);
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
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NvY2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7R0FFRztBQUNVLFFBQUEsYUFBYSxHQUFHLENBQUMsS0FBaUIsRUFBc0IsRUFBRSxDQUNuRSxJQUFJLE9BQU8sQ0FBQyxDQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtJQUM3QixNQUFNLEdBQUcsR0FBRyx3REFBYSxLQUFLLEdBQUMsQ0FBQztJQUNoQyxNQUFNLEdBQUcsR0FBRyx3REFBYSxLQUFLLEdBQUMsQ0FBQztJQUNoQyxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsSUFBSTtRQUNBLHlCQUF5QjtRQUN6QixNQUFNLEtBQUssR0FBRztZQUNWLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsTUFBTTtTQUNULENBQUM7UUFFRixnQkFBZ0I7UUFDaEIsTUFBTSxDQUFDLHFCQUFRLEtBQUssQ0FBRSxDQUFDO1FBRXZCLDZCQUE2QjtRQUM3QixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVELDZCQUE2QjtRQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBaUIsQ0FBQyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXRDLGlCQUFpQjtRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFpQixDQUFDLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUVsRDtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ1Q7QUFDTCxDQUFDLENBQUEsQ0FBQyxDQUFDIn0=