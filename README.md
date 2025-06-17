# X to Bird - Bring Back the Blue Bird

*Read this in other languages: [日本語](README.ja.md)*

A Chrome extension that replaces the X logo with the classic Twitter blue bird. Tired of the big "X"? Bring back the familiar blue bird that millions of users love!

## Features

- 🐦 Replace all X logos with the classic Twitter blue bird
- 🔖 Replace the favicon with the blue bird icon
- 📝 Optionally replace "X" text with "Twitter" throughout the site
- 🎨 Support for custom logos if you prefer something different
- ⚡ Real-time updates without page reload
- 🌐 Works on all X.com/Twitter.com domains

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension icon will appear in your toolbar

## Usage

1. Click the extension icon in your toolbar
2. Toggle the features you want:
   - **Enable Extension**: Turn the extension on/off
   - **Use Classic Blue Bird**: Use the classic Twitter bird logo (recommended)
   - **Replace Favicon**: Replace the browser tab icon
   - **Replace "X" with "Twitter"**: Change text throughout the site
3. Click "Save Settings" to apply changes

## Custom Logo

If you prefer a different logo instead of the blue bird:
1. Uncheck "Use Classic Blue Bird"
2. Either:
   - Enter a direct image URL
   - Upload an image file from your computer
3. Save your settings

## Privacy

This extension:
- Does not collect any user data
- Does not track your browsing
- Only runs on X.com/Twitter.com domains
- All settings are stored locally in your browser

## Why This Extension?

Many users miss the iconic Twitter blue bird that represented the platform for over a decade. This extension brings back that familiar, friendly logo that millions of users associate with the platform.

## License

MIT License - feel free to modify and share!

## File Structure

```
x-pro-logo-extension/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script for logo replacement
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── popup.css             # Popup styles
├── styles.css            # Injected styles for logo replacement
├── images/
│   └── twitter-bird.svg  # Classic Twitter bird logo
└── icons/                # Extension icons
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-48.png
    └── icon-128.png
```

## Development

### Setup
1. Clone the repository
2. Make your changes
3. Test locally by loading the unpacked extension

### Key Components
- **content.js**: Handles DOM manipulation and logo replacement
- **background.js**: Manages extension state and storage
- **popup.js**: Controls the settings interface

### Testing
1. Load the extension in developer mode
2. Visit X.com or Twitter.com
3. Test all toggle options
4. Check that settings persist after browser restart

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Support

If you encounter any issues:
1. Make sure the extension is enabled
2. Try refreshing the page
3. Check that you're on X.com or Twitter.com
4. Report issues on the GitHub repository

---

Made with ❤️ for everyone who misses the blue bird