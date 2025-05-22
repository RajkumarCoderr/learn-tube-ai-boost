
// Type definitions for Chrome extension API
interface Chrome {
  runtime: {
    onInstalled: {
      addListener: (callback: () => void) => void;
    };
    onMessage: {
      addListener: (callback: (message: any, sender: any, sendResponse: any) => boolean | void) => void;
    };
  };
  tabs: {
    onUpdated: {
      addListener: (callback: (tabId: number, changeInfo: {status?: string}, tab: {url?: string}) => void) => void;
    };
    sendMessage: (tabId: number, message: any) => void;
  };
}

declare const chrome: Chrome;
