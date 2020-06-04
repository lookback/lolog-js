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
Object.defineProperty(exports, "__esModule", { value: true });
const prepare_1 = require("./prepare");
const is_browser_1 = __importDefault(require("is-browser"));
exports.createConsLogger = (output) => (prep) => __awaiter(void 0, void 0, void 0, function* () {
    const { severity, message, merged } = prep;
    const fn = selectFn(output, severity);
    if (merged) {
        if (process.env.IS_BROWSER || is_browser_1.default) {
            fn.call(output, prep.severity, message, merged);
        }
        else {
            const util = require('util');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc2xvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsdUNBQWtEO0FBQ2xELDREQUFtQztBQVN0QixRQUFBLGdCQUFnQixHQUFHLENBQUMsTUFBYyxFQUFjLEVBQUUsQ0FBQyxDQUFPLElBQWlCLEVBQUUsRUFBRTtJQUN4RixNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDM0MsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxJQUFJLE1BQU0sRUFBRTtRQUNSLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksb0JBQVMsRUFBRTtZQUNyQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNuRDthQUFNO1lBQ0gsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdCLE1BQU0sWUFBWSxHQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO2dCQUN2QyxPQUFPLEVBQUUsS0FBSztnQkFDZCxNQUFNLEVBQUUsSUFBSTtnQkFDWixXQUFXLEVBQUUsRUFBRTtnQkFDZixLQUFLLEVBQUUsSUFBSTthQUNkLENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQ3pEO0tBQ0o7U0FBTTtRQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDM0M7SUFDRCxPQUFPO1FBQ0gsUUFBUSxFQUFFLENBQUM7S0FDZCxDQUFDO0FBQ04sQ0FBQyxDQUFBLENBQUM7QUFFRixNQUFNLFFBQVEsR0FBRyxDQUFDLE1BQWMsRUFBRSxRQUFrQixFQUFFLEVBQUU7SUFDcEQsUUFBUSxRQUFRLEVBQUU7UUFDZCxLQUFLLGtCQUFRLENBQUMsS0FBSztZQUNmLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN4QixLQUFLLGtCQUFRLENBQUMsS0FBSztZQUNmLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN4QixLQUFLLGtCQUFRLENBQUMsSUFBSTtZQUNkLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUN0QixLQUFLLGtCQUFRLENBQUMsSUFBSTtZQUNkLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQztRQUN2QixLQUFLLGtCQUFRLENBQUMsS0FBSztZQUNmLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztLQUMzQjtBQUNMLENBQUMsQ0FBQyJ9