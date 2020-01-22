"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prepare_1 = require("./prepare");
exports.createConsLogger = (output) => (prep) => __awaiter(this, void 0, void 0, function* () {
    const { severity, message, merged } = prep;
    const fn = selectFn(output, severity);
    if (merged) {
        fn.call(output, prep.severity, message, merged);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc2xvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25zbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSx1Q0FBa0Q7QUFTckMsUUFBQSxnQkFBZ0IsR0FBRyxDQUFDLE1BQWMsRUFBYyxFQUFFLENBQUMsQ0FBTyxJQUFpQixFQUFFLEVBQUU7SUFDeEYsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQzNDLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEMsSUFBSSxNQUFNLEVBQUU7UUFDUixFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNuRDtTQUFNO1FBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUMzQztJQUNELE9BQU87UUFDSCxRQUFRLEVBQUUsQ0FBQztLQUNkLENBQUM7QUFDTixDQUFDLENBQUEsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBYyxFQUFFLFFBQWtCLEVBQUUsRUFBRTtJQUNwRCxRQUFRLFFBQVEsRUFBRTtRQUNkLEtBQUssa0JBQVEsQ0FBQyxLQUFLO1lBQ2YsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3hCLEtBQUssa0JBQVEsQ0FBQyxLQUFLO1lBQ2YsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3hCLEtBQUssa0JBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3RCLEtBQUssa0JBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLEtBQUssa0JBQVEsQ0FBQyxLQUFLO1lBQ2YsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO0tBQzNCO0FBQ0wsQ0FBQyxDQUFDIn0=