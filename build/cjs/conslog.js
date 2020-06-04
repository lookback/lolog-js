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
Object.defineProperty(exports, "__esModule", { value: true });
const prepare_1 = require("./prepare");
const is_browser_1 = require("./is-browser");
exports.createConsLogger = (output) => (prep) => __awaiter(void 0, void 0, void 0, function* () {
    const { severity, message, merged } = prep;
    const fn = selectFn(output, severity);
    if (merged) {
        if (is_browser_1.isBrowser) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc2xvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsdUNBQWtEO0FBQ2xELDZDQUF5QztBQVM1QixRQUFBLGdCQUFnQixHQUFHLENBQUMsTUFBYyxFQUFjLEVBQUUsQ0FBQyxDQUFPLElBQWlCLEVBQUUsRUFBRTtJQUN4RixNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDM0MsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxJQUFJLE1BQU0sRUFBRTtRQUNSLElBQUksc0JBQVMsRUFBRTtZQUNYLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ25EO2FBQU07WUFDSCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0IsTUFBTSxZQUFZLEdBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7Z0JBQ3ZDLE9BQU8sRUFBRSxLQUFLO2dCQUNkLE1BQU0sRUFBRSxJQUFJO2dCQUNaLFdBQVcsRUFBRSxFQUFFO2dCQUNmLEtBQUssRUFBRSxJQUFJO2FBQ2QsQ0FBQyxDQUFDO1lBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDekQ7S0FDSjtTQUFNO1FBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUMzQztJQUNELE9BQU87UUFDSCxRQUFRLEVBQUUsQ0FBQztLQUNkLENBQUM7QUFDTixDQUFDLENBQUEsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBYyxFQUFFLFFBQWtCLEVBQUUsRUFBRTtJQUNwRCxRQUFRLFFBQVEsRUFBRTtRQUNkLEtBQUssa0JBQVEsQ0FBQyxLQUFLO1lBQ2YsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3hCLEtBQUssa0JBQVEsQ0FBQyxLQUFLO1lBQ2YsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3hCLEtBQUssa0JBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3RCLEtBQUssa0JBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLEtBQUssa0JBQVEsQ0FBQyxLQUFLO1lBQ2YsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO0tBQzNCO0FBQ0wsQ0FBQyxDQUFDIn0=