const checkBrowser = () => typeof window != 'undefined';

export const isBrowser: boolean = checkBrowser();
