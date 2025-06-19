/**
 * @jest-environment jsdom
 */

// Mock MutationObserver to prevent memory leaks in tests
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
const mockTakeRecords = jest.fn(() => []);

global.MutationObserver = jest.fn(() => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
  takeRecords: mockTakeRecords
}));

describe('content.js', () => {
  let mockConfig;
  let originalLocation;

  beforeEach(() => {
    // Clear module cache
    jest.resetModules();

    // Reset DOM
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    document.title = '';

    // Reset mocks
    jest.clearAllMocks();

    // Mock config
    mockConfig = {
      enabled: true,
      useClassicBird: true,
      replaceFavicon: true,
      customLogoUrl: ''
    };

    // Mock chrome.storage.sync.get to return our config
    chrome.storage.sync.get.mockImplementation((keys, callback) => {
      if (callback) callback(mockConfig);
      return Promise.resolve(mockConfig);
    });

    // Clear any timeouts
    jest.clearAllTimers();
    jest.useFakeTimers();

    // Store original location
    originalLocation = window.location;
  });

  afterEach(() => {
    jest.useRealTimers();
    // Restore location
    window.location = originalLocation;
    // Clear all observers
    mockDisconnect();
  });

  describe('Logo Replacement', () => {
    it('should replace X logo SVGs with bird image', () => {
      // Create mock X logo
      document.body.innerHTML = `
        <svg aria-label="X" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </svg>
      `;

      // Load content script
      require('../content.js');

      // Run timers to execute debounced functions
      jest.runAllTimers();

      const img = document.querySelector('img');
      expect(img).toBeTruthy();
      expect(img.src).toContain('twitter-bird.svg');
      expect(img.dataset.birdReplaced).toBe('true');
    });

    it('should use custom logo URL when configured', () => {
      mockConfig.useClassicBird = false;
      mockConfig.customLogoUrl = 'https://example.com/custom-logo.png';

      document.body.innerHTML = `
        <svg aria-label="X"><path d="..."></path></svg>
      `;

      require('../content.js');
      jest.runAllTimers();

      const img = document.querySelector('img');
      expect(img).toBeTruthy();
      expect(img.src).toBe('https://example.com/custom-logo.png');
    });

    it('should not replace when extension is disabled', () => {
      mockConfig.enabled = false;

      document.body.innerHTML = `
        <svg aria-label="X"><path d="..."></path></svg>
      `;

      require('../content.js');
      jest.runAllTimers();

      const svg = document.querySelector('svg');
      const img = document.querySelector('img');
      expect(svg).toBeTruthy();
      expect(img).toBeFalsy();
    });
  });

  describe('Document Title Replacement', () => {
    it('should replace X with Twitter in title', () => {
      document.title = 'X';

      require('../content.js');
      jest.runAllTimers();

      expect(document.title).toBe('Twitter');
    });

    it('should replace "X Pro" with "Twitter Pro"', () => {
      document.title = 'X Pro';

      require('../content.js');
      jest.runAllTimers();

      expect(document.title).toBe('Twitter Pro');
    });

    it('should replace "X /" pattern', () => {
      document.title = 'X / Home';

      require('../content.js');
      jest.runAllTimers();

      expect(document.title).toBe('Twitter / Home');
    });

    it('should replace "/ X" pattern', () => {
      document.title = 'Home / X';

      require('../content.js');
      jest.runAllTimers();

      expect(document.title).toBe('Home / Twitter');
    });
  });

  describe('Favicon Replacement', () => {
    it('should replace favicon when enabled', () => {
      // Add existing favicon
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.href = 'https://x.com/favicon.ico';
      document.head.appendChild(favicon);

      require('../content.js');
      jest.runAllTimers();

      const newFavicons = document.querySelectorAll('link[rel*="icon"]');
      expect(newFavicons.length).toBeGreaterThan(0);

      // Check at least one has the bird icon
      const birdFavicon = Array.from(newFavicons).find((f) => f.href.includes('twitter-bird.svg'));
      expect(birdFavicon).toBeTruthy();
    });

    it('should not replace favicon when disabled', () => {
      mockConfig.replaceFavicon = false;

      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.href = 'https://x.com/favicon.ico';
      document.head.appendChild(favicon);

      require('../content.js');
      jest.runAllTimers();

      const favicons = document.querySelectorAll('link[rel*="icon"]');
      expect(favicons[0].href).toBe('https://x.com/favicon.ico');
    });
  });

  describe('Message Handling', () => {
    it('should update config on message', () => {
      require('../content.js');

      const messageCallback = chrome.runtime.onMessage.addListener.mock.calls[0][0];
      const sendResponse = jest.fn();

      messageCallback({
        action: 'updateConfig',
        enabled: false,
        useClassicBird: false,
        replaceFavicon: false,
        customLogoUrl: 'https://example.com/new-logo.png'
      }, {}, sendResponse);

      expect(sendResponse).toHaveBeenCalledWith({ success: true });
    });

    it('should handle disabled state without reload in test environment', () => {
      require('../content.js');

      const messageCallback = chrome.runtime.onMessage.addListener.mock.calls[0][0];
      const sendResponse = jest.fn();

      messageCallback({
        action: 'updateConfig',
        enabled: false
      }, {}, sendResponse);

      // In test environment, reload is skipped
      expect(sendResponse).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('MutationObserver Setup', () => {
    it('should set up observers for dynamic content', () => {
      require('../content.js');

      // Should create MutationObserver instances
      expect(global.MutationObserver).toHaveBeenCalled();
      expect(mockObserve).toHaveBeenCalled();
    });
  });
});
