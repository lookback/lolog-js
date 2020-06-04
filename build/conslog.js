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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const prepare_1 = require("./prepare");
const is_browser_1 = __importDefault(require("is-browser"));
exports.createConsLogger = (output) => (prep) => __awaiter(void 0, void 0, void 0, function* () {
    const { severity, message, merged } = prep;
    const fn = selectFn(output, severity);
    if (merged) {
        if (is_browser_1.default) {
            fn.call(output, prep.severity, message, merged);
        }
        else {
            const util = yield Promise.resolve().then(() => __importStar(require('util')));
            const mergedFormat = util.inspect(merged, {
                compact: false,
                colors: true,
                breakLength: 16,
                depth: 1000,
            });
            fn.call(output, prep.severity, message, mergedFormat);
        }
    }
    else {
        fn.call(output, prep.severity, message);
    }
    return {
        attempts: 1,
    };
});
const selectFn = (output, severity) => {
    switch (severity) {
        case prepare_1.Severity.Trace:
            return output.debug;
        case prepare_1.Severity.Debug:
            return output.debug;
        case prepare_1.Severity.Info:
            return output.log;
        case prepare_1.Severity.Warn:
            return output.warn;
        case prepare_1.Severity.Error:
            return output.error;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc2xvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25zbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHVDQUFrRDtBQUNsRCw0REFBbUM7QUFTdEIsUUFBQSxnQkFBZ0IsR0FBRyxDQUFDLE1BQWMsRUFBYyxFQUFFLENBQUMsQ0FBTyxJQUFpQixFQUFFLEVBQUU7SUFDeEYsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQzNDLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEMsSUFBSSxNQUFNLEVBQUU7UUFDUixJQUFJLG9CQUFTLEVBQUU7WUFDWCxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNuRDthQUFNO1lBQ0gsTUFBTSxJQUFJLEdBQUcsd0RBQWEsTUFBTSxHQUFDLENBQUM7WUFDbEMsTUFBTSxZQUFZLEdBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7Z0JBQ3ZDLE9BQU8sRUFBRSxLQUFLO2dCQUNkLE1BQU0sRUFBRSxJQUFJO2dCQUNaLFdBQVcsRUFBRSxFQUFFO2dCQUNmLEtBQUssRUFBRSxJQUFJO2FBQ2QsQ0FBQyxDQUFDO1lBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDekQ7S0FDSjtTQUFNO1FBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUMzQztJQUNELE9BQU87UUFDSCxRQUFRLEVBQUUsQ0FBQztLQUNkLENBQUM7QUFDTixDQUFDLENBQUEsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBYyxFQUFFLFFBQWtCLEVBQUUsRUFBRTtJQUNwRCxRQUFRLFFBQVEsRUFBRTtRQUNkLEtBQUssa0JBQVEsQ0FBQyxLQUFLO1lBQ2YsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3hCLEtBQUssa0JBQVEsQ0FBQyxLQUFLO1lBQ2YsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3hCLEtBQUssa0JBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3RCLEtBQUssa0JBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLEtBQUssa0JBQVEsQ0FBQyxLQUFLO1lBQ2YsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO0tBQzNCO0FBQ0wsQ0FBQyxDQUFDIn0=