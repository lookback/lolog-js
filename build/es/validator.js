export const mkValidator = (validator, required) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsQ0FBSSxTQUFvQixFQUFFLFFBQW1CLEVBQUUsRUFBRTtJQUN4RSxPQUFPLENBQUMsQ0FBTSxFQUFFLE1BQThCLEVBQVUsRUFBRTtRQUN0RCxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQ0osTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUMxQyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELEtBQUssTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM1QixNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDUCxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzFFLE9BQU8sS0FBSyxDQUFDO2FBQ2hCO1lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUN4QixNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQzFDLE9BQU8sS0FBSyxDQUFDO2FBQ2hCO1NBQ0o7UUFDRCxJQUFJLFFBQVEsRUFBRTtZQUNWLEtBQUssTUFBTSxDQUFDLElBQUksUUFBUSxFQUFFO2dCQUN0QixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUNQLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7b0JBQzdDLE9BQU8sS0FBSyxDQUFDO2lCQUNoQjthQUNKO1NBQ0o7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDLENBQUM7QUFDTixDQUFDLENBQUMifQ==