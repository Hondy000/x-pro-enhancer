# X Pro Enhancer

*Read this in other languages: [日本語](README.ja.md)*

Enhance your X Pro experience with custom features including the classic Twitter bird logo, column management, and custom CSS styling. Take control of your X Pro interface!

## Features

- 🐦 Replace all X logos with the classic Twitter blue bird
- 🔖 Replace the favicon with the blue bird icon
- 📝 Automatically replace "X" with "Twitter" in document titles
- 🎨 Support for custom logos if you prefer something different
- ⚡ Real-time updates without page reload
- 🌐 Works on all X.com/Twitter.com domains including X Pro
- 📊 **Coming Soon**: Column management for X Pro
- 🎨 **Coming Soon**: Custom CSS injection

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
3. Click "Save Settings" to apply changes

Note: Document title replacement ("X" → "Twitter") is always active when the extension is enabled.

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

X Pro Enhancer is designed to give users more control over their X Pro experience. Starting with the beloved blue bird logo restoration, we're building a comprehensive suite of enhancement features for power users.

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
2. Visit X.com, Twitter.com, or pro.x.com
3. Test all toggle options
4. Check that settings persist after browser restart

### Development Commands
```bash
# Run linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Create Chrome Web Store package
npm run package

# Run tests
npm test
```

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Support

If you encounter any issues:
1. Make sure the extension is enabled
2. Try refreshing the page
3. Check that you're on X.com or Twitter.com
4. Report issues on the GitHub repository

## Roadmap

- ✅ Classic Twitter bird logo replacement
- ✅ Favicon replacement
- ✅ Document title replacement
- 🚧 Column folding/management for X Pro
- 🚧 Custom CSS injection
- 🚧 Theme presets
- 🚧 Export/import settings

---

Made with ❤️ for X Pro power users