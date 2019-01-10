const __isBrowser =
    new Function("(function(){return typeof window !== 'undefined' && this===window})();");

export const isBrowser = (): boolean => !!__isBrowser();
