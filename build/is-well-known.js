"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("./validator");
// keep in sync with interface definition
const WellKnown = {
    timestamp: 'number',
    appName: 'string',
    recordingId: 'string',
    userId: 'string',
    teamId: 'string',
    userIp: 'string',
    sessionId: 'string',
    metricGroup: 'string',
    disableConsole: 'boolean',
};
/**
 * Check if the given argument is a `LogWellKnown`. Every single field must be well known.
 */
exports.isWellKnown = validator_1.mkValidator(WellKnown);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtd2VsbC1rbm93bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pcy13ZWxsLWtub3duLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQTBDO0FBRzFDLHlDQUF5QztBQUN6QyxNQUFNLFNBQVMsR0FBcUQ7SUFDaEUsU0FBUyxFQUFFLFFBQVE7SUFDbkIsT0FBTyxFQUFFLFFBQVE7SUFDakIsV0FBVyxFQUFFLFFBQVE7SUFDckIsTUFBTSxFQUFFLFFBQVE7SUFDaEIsTUFBTSxFQUFFLFFBQVE7SUFDaEIsTUFBTSxFQUFFLFFBQVE7SUFDaEIsU0FBUyxFQUFFLFFBQVE7SUFDbkIsV0FBVyxFQUFFLFFBQVE7SUFDckIsY0FBYyxFQUFFLFNBQVM7Q0FDNUIsQ0FBQztBQUVGOztHQUVHO0FBQ1UsUUFBQSxXQUFXLEdBQ2xCLHVCQUFXLENBQUMsU0FBUyxDQUFDLENBQUMifQ==