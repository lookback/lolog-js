"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prepare_1 = require("./prepare");
exports.consLogger = (prep) => {
    const { severity, message, merged } = prep;
    switch (severity) {
        case prepare_1.Severity.Trace:
            console.debug(prepare_1.Severity.Trace, message, merged);
            break;
        case prepare_1.Severity.Debug:
            console.debug(prepare_1.Severity.Debug, message, merged);
            break;
        case prepare_1.Severity.Info:
            console.log(prepare_1.Severity.Info, message, merged);
            break;
        case prepare_1.Severity.Warn:
            console.warn(prepare_1.Severity.Warn, message, merged);
            break;
        case prepare_1.Severity.Error:
            console.error(prepare_1.Severity.Error, message, merged);
            break;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc2xvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25zbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQWtEO0FBRXJDLFFBQUEsVUFBVSxHQUFHLENBQUMsSUFBaUIsRUFBRSxFQUFFO0lBQzVDLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztJQUMzQyxRQUFRLFFBQVEsRUFBRTtRQUNkLEtBQUssa0JBQVEsQ0FBQyxLQUFLO1lBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQkFBUSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDL0MsTUFBTTtRQUNWLEtBQUssa0JBQVEsQ0FBQyxLQUFLO1lBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQkFBUSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDL0MsTUFBTTtRQUNWLEtBQUssa0JBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBUSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDNUMsTUFBTTtRQUNWLEtBQUssa0JBQVEsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBUSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDN0MsTUFBTTtRQUNWLEtBQUssa0JBQVEsQ0FBQyxLQUFLO1lBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQkFBUSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDL0MsTUFBTTtLQUNiO0FBQ0wsQ0FBQyxDQUFDIn0=