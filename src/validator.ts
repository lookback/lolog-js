
export type Validator = { [key: string]: string };

export const mkValidator = <T>(validator: Validator, required?: string[]) => {
    return (t: any, reject?: (msg: string) => void): t is T => {
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
