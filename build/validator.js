"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mkValidator = (validator, required) => {
    return (t, reject) => {
        if (!t) {
            reject && reject(`"${t}" is not a value`);
            return false;
        }
        for (const f of Object.keys(t)) {
            const type = validator[f];
            if (!type) {
                reject && reject(`${f} is not an expected field`);
                return false;
            }
            if ((typeof t[f]) !== type) {
                reject && reject(`${f} is not a ${type}`);
                return false;
            }
        }
        if (required) {
            for (const f of required) {
                if (!t[f]) {
                    reject && reject(`${f} is a required field`);
                    return false;
                }
            }
        }
        return true;
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3ZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdhLFFBQUEsV0FBVyxHQUFHLENBQUksU0FBb0IsRUFBRSxRQUFtQixFQUFFLEVBQUU7SUFDeEUsT0FBTyxDQUFDLENBQU0sRUFBRSxNQUE4QixFQUFVLEVBQUU7UUFDdEQsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUNKLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDMUMsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxLQUFLLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ1AsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztnQkFDbEQsT0FBTyxLQUFLLENBQUM7YUFDaEI7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ3hCLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDMUMsT0FBTyxLQUFLLENBQUM7YUFDaEI7U0FDSjtRQUNELElBQUksUUFBUSxFQUFFO1lBQ1YsS0FBSyxNQUFNLENBQUMsSUFBSSxRQUFRLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ1AsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztvQkFDN0MsT0FBTyxLQUFLLENBQUM7aUJBQ2hCO2FBQ0o7U0FDSjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyJ9