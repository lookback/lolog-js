"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prepare_1 = require("./prepare");
exports.createConsLogger = (output) => (prep) => {
    const { severity, message, merged } = prep;
    const fn = selectFn(output, severity);
    if (merged) {
        fn.call(output, prep.severity, message, merged);
    }
    else {
        fn.call(output, prep.severity, message);
    }
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc2xvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25zbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQWtEO0FBVXJDLFFBQUEsZ0JBQWdCLEdBQUcsQ0FBQyxNQUFjLEVBQWMsRUFBRSxDQUFDLENBQUMsSUFBaUIsRUFBRSxFQUFFO0lBQ2xGLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztJQUMzQyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLElBQUksTUFBTSxFQUFFO1FBQ1IsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDbkQ7U0FBTTtRQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDM0M7QUFDTCxDQUFDLENBQUM7QUFFRixNQUFNLFFBQVEsR0FBRyxDQUFDLE1BQWMsRUFBRSxRQUFrQixFQUFFLEVBQUU7SUFDcEQsUUFBUSxRQUFRLEVBQUU7UUFDZCxLQUFLLGtCQUFRLENBQUMsS0FBSztZQUNmLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN4QixLQUFLLGtCQUFRLENBQUMsS0FBSztZQUNmLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN4QixLQUFLLGtCQUFRLENBQUMsSUFBSTtZQUNkLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUN0QixLQUFLLGtCQUFRLENBQUMsSUFBSTtZQUNkLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQztRQUN2QixLQUFLLGtCQUFRLENBQUMsS0FBSztZQUNmLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztLQUMzQjtBQUNMLENBQUMsQ0FBQyJ9