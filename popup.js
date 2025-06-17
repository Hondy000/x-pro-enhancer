// Popup script for X to Bird - Bring Back the Blue Bird

document.addEventListener('DOMContentLoaded', () => {
  const enabledCheckbox = document.getElementById('enabled');
  const useClassicBirdCheckbox = document.getElementById('useClassicBird');
  const replaceFaviconCheckbox = document.getElementById('replaceFavicon');
  const replaceTextCheckbox = document.getElementById('replaceText');
  const customPageNameInput = document.getElementById('customPageName');
  const customLogoUrlInput = document.getElementById('customLogoUrl');
  const logoFileInput = document.getElementById('logoFile');
  const logoPreview = document.getElementById('logoPreview');
  const saveButton = document.getElementById('saveButton');
  const statusDiv = document.getElementById('status');
  const customLogoSections = document.querySelectorAll('.custom-logo-section');
  const customTextSection = document.getElementById('customTextSection');
  
  // Load current settings
  chrome.storage.sync.get(['enabled', 'useClassicBird', 'replaceFavicon', 'replaceText', 'customPageName', 'customLogoUrl'], (result) => {
    enabledCheckbox.checked = result.enabled !== false;
    useClassicBirdCheckbox.checked = result.useClassicBird !== false;
    replaceFaviconCheckbox.checked = result.replaceFavicon !== false;
    replaceTextCheckbox.checked = result.replaceText === true;
    customPageNameInput.value = result.customPageName || 'Twitter';
    customLogoUrlInput.value = result.customLogoUrl || '';
    
    // Show/hide custom sections based on settings
    updateCustomSections();
    updateLogoPreview(result.useClassicBird !== false ? null : result.customLogoUrl);
  });
  
  // Toggle custom logo sections when classic bird is unchecked
  useClassicBirdCheckbox.addEventListener('change', () => {
    updateCustomSections();
  });
  
  // Toggle custom text section when replace text is checked
  replaceTextCheckbox.addEventListener('change', () => {
    updateCustomSections();
  });
  
  function updateCustomSections() {
    const showCustomLogo = !useClassicBirdCheckbox.checked;
    const showCustomText = replaceTextCheckbox.checked;
    
    customLogoSections.forEach(section => {
      section.style.display = showCustomLogo ? 'block' : 'none';
    });
    
    customTextSection.style.display = showCustomText ? 'block' : 'none';
    
    if (useClassicBirdCheckbox.checked) {
      updateLogoPreview(null); // Show blue bird preview
    }
  }
  
  // Handle logo file upload
  logoFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        customLogoUrlInput.value = dataUrl;
        updateLogoPreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Handle logo URL input change
  customLogoUrlInput.addEventListener('input', (event) => {
    updateLogoPreview(event.target.value);
  });
  
  // Update logo preview
  function updateLogoPreview(url) {
    if (url) {
      logoPreview.innerHTML = `<img src="${url}" alt="Logo Preview" onerror="this.style.display='none'">`;
    } else if (useClassicBirdCheckbox.checked) {
      // Show blue bird preview
      logoPreview.innerHTML = `<img src="images/twitter-bird.svg" alt="Twitter Bird" style="width: 48px; height: 48px;">`;
    } else {
      logoPreview.innerHTML = '';
    }
  }
  
  // Save settings
  saveButton.addEventListener('click', async () => {
    const settings = {
      enabled: enabledCheckbox.checked,
      useClassicBird: useClassicBirdCheckbox.checked,
      replaceFavicon: replaceFaviconCheckbox.checked,
      replaceText: replaceTextCheckbox.checked,
      customPageName: customPageNameInput.value.trim() || 'Twitter',
      customLogoUrl: useClassicBirdCheckbox.checked ? '' : customLogoUrlInput.value.trim()
    };
    
    // Save to storage
    chrome.storage.sync.set(settings, () => {
      showStatus('Settings saved successfully!', 'success');
      
      // Send message to content script
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0] && tabs[0].url && (tabs[0].url.includes('x.com') || tabs[0].url.includes('twitter.com'))) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateConfig',
            ...settings
          });
        }
      });
    });
  });
  
  // Show status message
  function showStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
});