// Content script for X to Bird - Bring Back the Blue Bird

// Configuration
const config = {
  enabled: true,
  useClassicBird: true,
  replaceFavicon: true,
  replaceUrl: false,
  customLogoUrl: ''
};

// Default blue bird image (data URL)
const DEFAULT_BIRD_SVG = chrome.runtime.getURL('images/twitter-bird.svg');

// Load configuration from storage
chrome.storage.sync.get(['enabled', 'useClassicBird', 'replaceFavicon', 'replaceUrl', 'customLogoUrl'], (result) => {
  config.enabled = result.enabled !== false;
  config.useClassicBird = result.useClassicBird !== false;
  config.replaceFavicon = result.replaceFavicon !== false;
  config.replaceUrl = result.replaceUrl === true; // false by default
  config.customLogoUrl = result.customLogoUrl || '';

  if (config.enabled) {
    replaceLogo();
    replaceFavicon();
    replaceDocumentTitle(); // Always replace title
    if (config.replaceUrl) {
      replaceUrlDisplay();
    }
    observeChanges();
  }
});

// Function to replace X logos with blue bird
function replaceLogo() {
  // Target various logo selectors that X might use
  const logoSelectors = [
    'svg[aria-label*="X"]',
    'svg[aria-label*="Twitter"]',
    'svg[aria-label="X"]',
    'svg[aria-label="Twitter"]',
    'img[alt*="X"]',
    '[data-testid="Logo"]',
    'a[href="/home"] svg',
    'a[aria-label="X"] svg',
    'header svg[viewBox="0 0 24 24"]',
    'div[aria-label="Loading..."] svg', // Loading spinner logo
    '.r-13v1u17.r-4qtqp9.r-yyyyoo.r-16y2uox.r-lwhw9o.r-dnmrzs.r-bnwqim.r-1plcrui.r-lrvibr',
    '.r-1cvl2hr.r-4qtqp9.r-yyyyoo.r-16y2uox.r-lwhw9o.r-dnmrzs.r-bnwqim.r-1plcrui.r-lrvibr',
    'h1[role="heading"] svg' // Mobile header logo
  ];

  logoSelectors.forEach((selector) => {
    const logos = document.querySelectorAll(selector);
    logos.forEach((logo) => {
      // Skip if already replaced
      if (logo.dataset.birdReplaced === 'true') return;

      // Get the logo source
      const logoUrl = config.useClassicBird ? DEFAULT_BIRD_SVG : (config.customLogoUrl || DEFAULT_BIRD_SVG);

      // Replace with bird image
      const img = document.createElement('img');
      img.src = logoUrl;
      img.className = logo.className || '';

      // Preserve original size
      const rect = logo.getBoundingClientRect();
      img.style.width = rect.width + 'px' || '32px';
      img.style.height = rect.height + 'px' || '32px';
      img.style.objectFit = 'contain';

      // Mark as replaced
      img.dataset.birdReplaced = 'true';

      // Handle error
      img.onerror = function() {
        this.style.display = 'none';
      };

      if (logo.parentNode) {
        logo.parentNode.replaceChild(img, logo);
      }
    });
  });
}

// Function to replace favicons
function replaceFavicon() {
  if (!config.replaceFavicon) return;

  const faviconUrl = config.useClassicBird ? DEFAULT_BIRD_SVG : (config.customLogoUrl || DEFAULT_BIRD_SVG);

  // Remove existing favicons
  const existingIcons = document.querySelectorAll('link[rel*="icon"]');
  existingIcons.forEach((icon) => icon.remove());

  // Add new favicon
  const newIcon = document.createElement('link');
  newIcon.rel = 'icon';
  newIcon.type = 'image/svg+xml';
  newIcon.href = faviconUrl;
  document.head.appendChild(newIcon);

  // Also add as shortcut icon for compatibility
  const shortcutIcon = document.createElement('link');
  shortcutIcon.rel = 'shortcut icon';
  shortcutIcon.href = faviconUrl;
  document.head.appendChild(shortcutIcon);
}

// Function to show URL replacement info
function replaceUrlDisplay() {
  // Note: Actually changing the URL can break the page functionality
  // Instead, we'll show a subtle notification about the classic domain
  if (window.location.hostname.includes('x.com') && !document.querySelector('#classic-domain-info')) {
    const info = document.createElement('div');
    info.id = 'classic-domain-info';
    info.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(29, 155, 240, 0.9);
      color: white;
      padding: 10px 15px;
      border-radius: 20px;
      font-size: 12px;
      z-index: 9999;
      cursor: pointer;
      transition: opacity 0.3s;
    `;
    info.textContent = '🐦 Classic Twitter domain: ' + window.location.href.replace(/x\.com/g, 'twitter.com');
    info.onclick = () => {
      info.style.opacity = '0';
      setTimeout(() => info.remove(), 300);
    };
    document.body.appendChild(info);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (info.parentNode) {
        info.style.opacity = '0';
        setTimeout(() => info.remove(), 300);
      }
    }, 5000);
  }
}

// Function to replace document title only
function replaceDocumentTitle() {
  // Replace "X Pro" or "X" in title with "Twitter"
  if (document.title.includes('X Pro')) {
    document.title = document.title.replace(/X Pro/g, 'Twitter Pro');
  } else if (document.title.includes('X / ')) {
    document.title = document.title.replace(/X \/ /g, 'Twitter / ');
  } else if (document.title.includes(' / X')) {
    document.title = document.title.replace(/ \/ X/g, ' / Twitter');
  } else if (document.title.includes('X')) {
    document.title = document.title.replace(/\bX\b/g, 'Twitter');
  }
}

// Observe DOM changes to handle dynamically loaded content
function observeChanges() {
  // Observe for title changes
  const titleObserver = new MutationObserver(() => {
    replaceDocumentTitle();
  });

  const titleElement = document.querySelector('title');
  if (titleElement) {
    titleObserver.observe(titleElement, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  // Observe for favicon changes in head
  const headObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'LINK' && node.rel && node.rel.includes('icon')) {
            replaceFavicon();
          } else if (node.nodeName === 'TITLE') {
            // New title element added, observe it
            titleObserver.observe(node, {
              childList: true,
              characterData: true,
              subtree: true
            });
            replaceDocumentTitle();
          }
        });
      }
    });
  });

  if (document.head) {
    headObserver.observe(document.head, {
      childList: true,
      subtree: true
    });
  }

  // Observe for logo changes in body
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Debounce to avoid excessive processing
        clearTimeout(window.logoReplacerTimeout);
        window.logoReplacerTimeout = setTimeout(() => {
          replaceLogo();
          replaceDocumentTitle(); // Always check title
        }, 100);
      }
    });
  });

  if (document.body) {
    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    // If body doesn't exist yet, wait for it
    const bodyWaitObserver = new MutationObserver((mutations, observer) => {
      if (document.body) {
        observer.disconnect();
        bodyObserver.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    });
    bodyWaitObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateConfig') {
    config.enabled = request.enabled !== false;
    config.useClassicBird = request.useClassicBird !== false;
    config.replaceFavicon = request.replaceFavicon !== false;
    config.customLogoUrl = request.customLogoUrl || '';

    if (config.enabled) {
      replaceLogo();
      replaceFavicon();
      replaceDocumentTitle(); // Always replace title
    } else {
      // Reload page to restore original content
      location.reload();
    }
    sendResponse({ success: true });
  }
});
