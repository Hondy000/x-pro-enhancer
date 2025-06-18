// Chrome API mocks
global.chrome = {
  runtime: {
    getURL: jest.fn((path) => `chrome-extension://fake-extension-id/${path}`),
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    },
    onInstalled: {
      addListener: jest.fn()
    }
  },
  storage: {
    sync: {
      get: jest.fn((keys, callback) => {
        // Default values for tests
        const defaults = {
          enabled: true,
          useClassicBird: true,
          replaceFavicon: true,
          customLogoUrl: ''
        };
        if (callback) {
          callback(defaults);
        }
        return Promise.resolve(defaults);
      }),
      set: jest.fn((data, callback) => {
        if (callback) {
          callback();
        }
        return Promise.resolve();
      })
    },
    local: {
      get: jest.fn(),
      set: jest.fn()
    }
  },
  tabs: {
    query: jest.fn((queryInfo, callback) => {
      const mockTabs = [{
        id: 1,
        url: 'https://x.com',
        active: true
      }];
      if (callback) {
        callback(mockTabs);
      }
      return Promise.resolve(mockTabs);
    }),
    sendMessage: jest.fn(),
    onUpdated: {
      addListener: jest.fn()
    }
  }
};

// Mock DOM methods that might not exist in jsdom
if (typeof MutationObserver === 'undefined') {
  global.MutationObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    disconnect() {}
    takeRecords() { return []; }
  };
}

// Mock FileReader
global.FileReader = class {
  readAsDataURL() {
    setTimeout(() => {
      this.onload({ target: { result: 'data:image/png;base64,fake' } });
    }, 0);
  }
};
