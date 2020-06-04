var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Severity } from './prepare';
import { isBrowser } from './is-browser';
export const createConsLogger = (output) => (prep) => __awaiter(void 0, void 0, void 0, function* () {
    const { severity, message, merged } = prep;
    const fn = selectFn(output, severity);
    if (merged) {
        if (isBrowser) {
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
        case Severity.Trace:
            return output.debug;
        case Severity.Debug:
            return output.debug;
        case Severity.Info:
            return output.log;
        case Severity.Warn:
            return output.warn;
        case Severity.Error:
            return output.error;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc2xvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBLE9BQU8sRUFBZSxRQUFRLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQVN6QyxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLE1BQWMsRUFBYyxFQUFFLENBQUMsQ0FBTyxJQUFpQixFQUFFLEVBQUU7SUFDeEYsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQzNDLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEMsSUFBSSxNQUFNLEVBQUU7UUFDUixJQUFJLFNBQVMsRUFBRTtZQUNYLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ25EO2FBQU07WUFDSCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0IsTUFBTSxZQUFZLEdBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7Z0JBQ3ZDLE9BQU8sRUFBRSxLQUFLO2dCQUNkLE1BQU0sRUFBRSxJQUFJO2dCQUNaLFdBQVcsRUFBRSxFQUFFO2dCQUNmLEtBQUssRUFBRSxJQUFJO2FBQ2QsQ0FBQyxDQUFDO1lBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDekQ7S0FDSjtTQUFNO1FBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUMzQztJQUNELE9BQU87UUFDSCxRQUFRLEVBQUUsQ0FBQztLQUNkLENBQUM7QUFDTixDQUFDLENBQUEsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBYyxFQUFFLFFBQWtCLEVBQUUsRUFBRTtJQUNwRCxRQUFRLFFBQVEsRUFBRTtRQUNkLEtBQUssUUFBUSxDQUFDLEtBQUs7WUFDZixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDeEIsS0FBSyxRQUFRLENBQUMsS0FBSztZQUNmLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN4QixLQUFLLFFBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3RCLEtBQUssUUFBUSxDQUFDLElBQUk7WUFDZCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDdkIsS0FBSyxRQUFRLENBQUMsS0FBSztZQUNmLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztLQUMzQjtBQUNMLENBQUMsQ0FBQyJ9