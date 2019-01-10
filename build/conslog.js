"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prepare_1 = require("./prepare");
exports.consLogger = (prep, output) => {
    const { severity, message, merged } = prep;
    const fn = selectFn(output, severity);
    const time = new Date(prep.timestamp);
    if (merged) {
        fn.call(output, time, prep.severity, message, merged);
    }
    else {
        fn.call(output, time, prep.severity, message);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc2xvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25zbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQWtEO0FBU3JDLFFBQUEsVUFBVSxHQUFHLENBQUMsSUFBaUIsRUFBRSxNQUFjLEVBQUUsRUFBRTtJQUM1RCxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDM0MsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdEMsSUFBSSxNQUFNLEVBQUU7UUFDUixFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDekQ7U0FBTTtRQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ2pEO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFjLEVBQUUsUUFBa0IsRUFBRSxFQUFFO0lBQ3BELFFBQVEsUUFBUSxFQUFFO1FBQ2QsS0FBSyxrQkFBUSxDQUFDLEtBQUs7WUFDZixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDeEIsS0FBSyxrQkFBUSxDQUFDLEtBQUs7WUFDZixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDeEIsS0FBSyxrQkFBUSxDQUFDLElBQUk7WUFDZCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDdEIsS0FBSyxrQkFBUSxDQUFDLElBQUk7WUFDZCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDdkIsS0FBSyxrQkFBUSxDQUFDLEtBQUs7WUFDZixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUM7S0FDM0I7QUFDTCxDQUFDLENBQUMifQ==