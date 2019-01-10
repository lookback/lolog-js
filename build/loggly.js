"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper to create a loggly tracker, and hide it behind some typing.
 */
const createLogglyTracker = (logglyKey) => {
    // only require this if we really are in a browser context, since
    // it needs window/document globals to be defined
    require('./loggly-2019-01-10.js')(window, document);
    // instantiate a tracker
    const logger = new window.LogglyTracker();
    // init by pushing a first message (strange)
    // sendConsoleErrors patches console.err, we don't want that
    logger.push({ logglyKey, sendConsoleErrors: false });
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
        const m = `${prep.severity} ${prep.message}`;
        if (prep.merged) {
            loggly.push(m, prep.merged);
        }
        else {
            loggly.push(m);
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2x5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dseS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVdBOztHQUVHO0FBQ0gsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLFNBQWlCLEVBQWlCLEVBQUU7SUFDN0QsaUVBQWlFO0lBQ2pFLGlEQUFpRDtJQUNqRCxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFcEQsd0JBQXdCO0lBQ3hCLE1BQU0sTUFBTSxHQUFrQixJQUFLLE1BQWMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUVsRSw0Q0FBNEM7SUFDNUMsNERBQTREO0lBQzNELE1BQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUU5RCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUM7QUFHRjs7R0FFRztBQUNVLFFBQUEsa0JBQWtCLEdBQUcsQ0FBQyxJQUFhLEVBQWMsRUFBRTtJQUM1RCxvQ0FBb0M7SUFDcEMsTUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWhELE9BQU8sQ0FBQyxJQUFpQixFQUFFLEVBQUU7UUFDekIsa0VBQWtFO1FBQ2xFLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDN0MsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9CO2FBQU07WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCO0lBQ0wsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDIn0=