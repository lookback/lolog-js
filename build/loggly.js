"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const declareLoggly = require('./loggly-2019-01-10.js');
/**
 * Helper to create a loggly tracker, and hide it behind some typing.
 */
const createLogglyTracker = (logglyKey) => {
    // only do this once, it injects LogglyTracker on window.
    if (!window.LogglyTracker) {
        declareLoggly();
    }
    // instantiate a tracker
    const logger = new window.LogglyTracker();
    // init by pushing a first message (strange)
    logger.push({
        logglyKey,
        // sendConsoleErrors patches console.err, we don't want that
        sendConsoleErrors: false,
        // why not "utf"?
        useUtfEncoding: true,
    });
    return logger;
};
/**
 * Create a loggly loggler from options.
 */
exports.createLogglyLogger = (opts) => {
    // the apiKey is the loggly api key.
    const loggly = createLogglyTracker(opts.apiKey);
    return (prep) => {
        // seems we can't communicate severity to loggly through this api.
        const m = `${prep.message}`;
        const json = Object.assign({ env: opts.env, appName: prep.appName, severity: prep.severity, text: m }, (prep.merged || {}));
        loggly.push(json);
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2x5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dseS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBU3hEOztHQUVHO0FBQ0gsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLFNBQWlCLEVBQWlCLEVBQUU7SUFDN0QseURBQXlEO0lBQ3pELElBQUksQ0FBRSxNQUFjLENBQUMsYUFBYSxFQUFFO1FBQ2hDLGFBQWEsRUFBRSxDQUFDO0tBQ25CO0lBRUQsd0JBQXdCO0lBQ3hCLE1BQU0sTUFBTSxHQUFrQixJQUFLLE1BQWMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUVsRSw0Q0FBNEM7SUFDM0MsTUFBYyxDQUFDLElBQUksQ0FBQztRQUNqQixTQUFTO1FBQ1QsNERBQTREO1FBQzVELGlCQUFpQixFQUFFLEtBQUs7UUFDeEIsaUJBQWlCO1FBQ2pCLGNBQWMsRUFBRSxJQUFJO0tBQ3ZCLENBQUMsQ0FBQztJQUVILE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMsQ0FBQztBQUdGOztHQUVHO0FBQ1UsUUFBQSxrQkFBa0IsR0FBRyxDQUFDLElBQWEsRUFBYyxFQUFFO0lBQzVELG9DQUFvQztJQUNwQyxNQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFaEQsT0FBTyxDQUFDLElBQWlCLEVBQUUsRUFBRTtRQUN6QixrRUFBa0U7UUFDbEUsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDNUIsTUFBTSxJQUFJLG1CQUNOLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUNiLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUNyQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFDdkIsSUFBSSxFQUFFLENBQUMsSUFDSixDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQ3pCLENBQUM7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyJ9