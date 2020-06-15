const checkBrowser = new Function('try {return this===window;}catch(e){ return false;}');

export const isBrowser: boolean = checkBrowser();
