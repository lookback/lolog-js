export declare type Validator = {
    [key: string]: string;
};
export declare const mkValidator: <T>(validator: Validator, required?: string[] | undefined) => (t: any, reject?: ((msg: string) => void) | undefined) => t is T;
