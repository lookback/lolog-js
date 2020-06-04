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
                reject && reject(`${f} is not an expected field in ${JSON.stringify(t)}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdhLFFBQUEsV0FBVyxHQUFHLENBQUksU0FBb0IsRUFBRSxRQUFtQixFQUFFLEVBQUU7SUFDeEUsT0FBTyxDQUFDLENBQU0sRUFBRSxNQUE4QixFQUFVLEVBQUU7UUFDdEQsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUNKLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDMUMsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxLQUFLLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ1AsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUMxRSxPQUFPLEtBQUssQ0FBQzthQUNoQjtZQUNELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDeEIsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUMxQyxPQUFPLEtBQUssQ0FBQzthQUNoQjtTQUNKO1FBQ0QsSUFBSSxRQUFRLEVBQUU7WUFDVixLQUFLLE1BQU0sQ0FBQyxJQUFJLFFBQVEsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDUCxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO29CQUM3QyxPQUFPLEtBQUssQ0FBQztpQkFDaEI7YUFDSjtTQUNKO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDIn0=