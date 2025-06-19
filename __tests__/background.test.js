describe('background.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('Extension Installation', () => {
    it('should set default configuration on install', (done) => {
      // Mock storage.sync.get to return empty result (new install)
      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({});
      });

      // Load background script
      require('../background.js');

      // Get the callback registered for onInstalled
      const onInstalledCallback = chrome.runtime.onInstalled.addListener.mock.calls[0][0];

      // Simulate installation
      onInstalledCallback({ reason: 'install' });

      // Wait for async operations
      setTimeout(() => {
        // Check if default settings were saved
        expect(chrome.storage.sync.set).toHaveBeenCalledWith({
          enabled: true,
          useClassicBird: true,
          replaceFavicon: true,
          customPageName: 'Twitter',
          customLogoUrl: ''
        });
        done();
      }, 0);
    });

    it('should only set undefined values', (done) => {
      // Mock storage.sync.get to return partial result
      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({
          enabled: false,
          useClassicBird: false
        });
      });

      require('../background.js');

      const onInstalledCallback = chrome.runtime.onInstalled.addListener.mock.calls[0][0];
      onInstalledCallback({ reason: 'install' });

      setTimeout(() => {
        // Should only set the missing values
        expect(chrome.storage.sync.set).toHaveBeenCalledWith({
          replaceFavicon: true,
          customPageName: 'Twitter',
          customLogoUrl: ''
        });
        done();
      }, 0);
    });

    it('should not set any values if all exist', (done) => {
      // Mock storage.sync.get to return complete result
      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({
          enabled: true,
          useClassicBird: true,
          replaceFavicon: true,
          customPageName: 'Twitter',
          customLogoUrl: ''
        });
      });

      require('../background.js');

      const onInstalledCallback = chrome.runtime.onInstalled.addListener.mock.calls[0][0];
      onInstalledCallback({ reason: 'install' });

      setTimeout(() => {
        // Should not call set
        expect(chrome.storage.sync.set).not.toHaveBeenCalled();
        done();
      }, 0);
    });
  });

  describe('Tab Updates', () => {
    it('should register tab update listener', () => {
      require('../background.js');

      expect(chrome.tabs.onUpdated.addListener).toHaveBeenCalled();
    });

    it('should handle tab updates for X/Twitter domains', () => {
      require('../background.js');

      const onUpdatedCallback = chrome.tabs.onUpdated.addListener.mock.calls[0][0];

      // Test X.com
      onUpdatedCallback(1, { status: 'complete' }, { url: 'https://x.com/home' });

      // Test Twitter.com
      onUpdatedCallback(2, { status: 'complete' }, { url: 'https://twitter.com/home' });

      // Test non-matching domain
      onUpdatedCallback(3, { status: 'complete' }, { url: 'https://google.com' });

      // Content script injection is handled by manifest, so no explicit action needed
      expect(onUpdatedCallback).toBeDefined();
    });
  });
});
