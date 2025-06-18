/**
 * @jest-environment jsdom
 */

describe('popup.js', () => {
  let mockElements;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <input type="checkbox" id="enabled" />
      <input type="checkbox" id="useClassicBird" />
      <input type="checkbox" id="replaceFavicon" />
      <input type="url" id="customLogoUrl" />
      <input type="file" id="logoFile" />
      <div id="logoPreview"></div>
      <button id="saveButton">Save Settings</button>
      <div id="status"></div>
      <div class="custom-logo-section" style="display: none;"></div>
      <div class="custom-logo-section" style="display: none;"></div>
    `;

    // Reset mocks
    jest.clearAllMocks();

    // Mock DOM elements
    mockElements = {
      enabled: document.getElementById('enabled'),
      useClassicBird: document.getElementById('useClassicBird'),
      replaceFavicon: document.getElementById('replaceFavicon'),
      customLogoUrl: document.getElementById('customLogoUrl'),
      logoFile: document.getElementById('logoFile'),
      logoPreview: document.getElementById('logoPreview'),
      saveButton: document.getElementById('saveButton'),
      status: document.getElementById('status'),
      customLogoSections: document.querySelectorAll('.custom-logo-section')
    };

    // Mock chrome.tabs.query to return a valid tab
    chrome.tabs.query.mockImplementation((query, callback) => {
      callback([{
        id: 1,
        url: 'https://x.com/home'
      }]);
    });
  });

  describe('Settings Loading', () => {
    it('should load and display saved settings', (done) => {
      const mockSettings = {
        enabled: false,
        useClassicBird: false,
        replaceFavicon: true,
        customLogoUrl: 'https://example.com/logo.png'
      };

      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback(mockSettings);
      });

      // Load popup script
      require('../popup.js');

      // Simulate DOMContentLoaded
      document.dispatchEvent(new Event('DOMContentLoaded'));

      setTimeout(() => {
        expect(mockElements.enabled.checked).toBe(false);
        expect(mockElements.useClassicBird.checked).toBe(false);
        expect(mockElements.replaceFavicon.checked).toBe(true);
        expect(mockElements.customLogoUrl.value).toBe('https://example.com/logo.png');
        done();
      }, 0);
    });

    it('should use default values when no settings exist', (done) => {
      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({});
      });

      require('../popup.js');
      document.dispatchEvent(new Event('DOMContentLoaded'));

      setTimeout(() => {
        expect(mockElements.enabled.checked).toBe(true);
        expect(mockElements.useClassicBird.checked).toBe(true);
        expect(mockElements.replaceFavicon.checked).toBe(true);
        expect(mockElements.customLogoUrl.value).toBe('');
        done();
      }, 0);
    });
  });

  describe('UI Interactions', () => {
    beforeEach(() => {
      require('../popup.js');
      document.dispatchEvent(new Event('DOMContentLoaded'));
    });

    it('should show custom logo sections when classic bird is unchecked', () => {
      mockElements.useClassicBird.checked = false;
      mockElements.useClassicBird.dispatchEvent(new Event('change'));

      mockElements.customLogoSections.forEach((section) => {
        expect(section.style.display).toBe('block');
      });
    });

    it('should hide custom logo sections when classic bird is checked', () => {
      mockElements.useClassicBird.checked = true;
      mockElements.useClassicBird.dispatchEvent(new Event('change'));

      mockElements.customLogoSections.forEach((section) => {
        expect(section.style.display).toBe('none');
      });
    });

    it('should update logo preview when URL is entered', () => {
      mockElements.customLogoUrl.value = 'https://example.com/new-logo.png';
      mockElements.customLogoUrl.dispatchEvent(new Event('input'));

      const previewImg = mockElements.logoPreview.querySelector('img');
      expect(previewImg).toBeTruthy();
      expect(previewImg.src).toBe('https://example.com/new-logo.png');
    });

    it('should show blue bird preview when classic bird is selected', () => {
      mockElements.useClassicBird.checked = true;
      mockElements.useClassicBird.dispatchEvent(new Event('change'));

      const previewImg = mockElements.logoPreview.querySelector('img');
      expect(previewImg).toBeTruthy();
      expect(previewImg.src).toContain('twitter-bird.svg');
    });
  });

  describe('File Upload', () => {
    beforeEach(() => {
      require('../popup.js');
      document.dispatchEvent(new Event('DOMContentLoaded'));
    });

    it('should handle logo file upload', (done) => {
      const mockFile = new File(['fake image data'], 'logo.png', { type: 'image/png' });
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        result: 'data:image/png;base64,fake'
      };

      // Mock FileReader
      global.FileReader = jest.fn(() => mockFileReader);

      // Simulate file selection
      Object.defineProperty(mockElements.logoFile, 'files', {
        value: [mockFile],
        writable: false
      });

      mockElements.logoFile.dispatchEvent(new Event('change'));

      // Simulate FileReader onload
      setTimeout(() => {
        mockFileReader.onload({ target: { result: 'data:image/png;base64,fake' } });

        expect(mockElements.customLogoUrl.value).toBe('data:image/png;base64,fake');
        const previewImg = mockElements.logoPreview.querySelector('img');
        expect(previewImg.src).toBe('data:image/png;base64,fake');
        done();
      }, 0);
    });
  });

  describe('Settings Save', () => {
    beforeEach(() => {
      require('../popup.js');
      document.dispatchEvent(new Event('DOMContentLoaded'));
    });

    it('should save settings when save button is clicked', (done) => {
      // Set form values
      mockElements.enabled.checked = false;
      mockElements.useClassicBird.checked = false;
      mockElements.replaceFavicon.checked = true;
      mockElements.customLogoUrl.value = 'https://example.com/logo.png';

      // Click save button
      mockElements.saveButton.click();

      setTimeout(() => {
        expect(chrome.storage.sync.set).toHaveBeenCalledWith({
          enabled: false,
          useClassicBird: false,
          replaceFavicon: true,
          customLogoUrl: 'https://example.com/logo.png'
        }, expect.any(Function));

        // Check if message was sent to content script
        expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, {
          action: 'updateConfig',
          enabled: false,
          useClassicBird: false,
          replaceFavicon: true,
          customLogoUrl: 'https://example.com/logo.png'
        });

        done();
      }, 0);
    });

    it('should show success message after saving', (done) => {
      chrome.storage.sync.set.mockImplementation((data, callback) => {
        callback();
      });

      mockElements.saveButton.click();

      setTimeout(() => {
        expect(mockElements.status.textContent).toBe('Settings saved successfully!');
        expect(mockElements.status.style.display).toBe('block');
        done();
      }, 0);
    });

    it('should not send message if not on X/Twitter domain', (done) => {
      chrome.tabs.query.mockImplementation((query, callback) => {
        callback([{
          id: 1,
          url: 'https://google.com'
        }]);
      });

      mockElements.saveButton.click();

      setTimeout(() => {
        expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
        done();
      }, 0);
    });
  });
});
