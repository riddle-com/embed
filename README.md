# Riddle Embed Script - Self-Hosted Version

This repository contains the self-hosted version of the Riddle embed script for integrating Riddle content into your website.

## 🚀 Quick Start

### 1. Include the Script

Add the script once to the `<head>` section of your HTML page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page</title>
    
    <!-- Riddle Embed Script - only once in head -->
    <script src="/path/to/embedV2-riddle.min.js"></script>
</head>
<body>
    <!-- Your page content -->
</body>
</html>
```

### 2. Embed Riddle Content

Use the simplified HTML code in the body (without script tag):

```html
<div class="riddle2-wrapper" 
     data-rid-id="{your-riddle-id}" 
     data-auto-scroll="true" 
     data-is-fixed-height-enabled="false" 
     data-bg="#fff" 
     data-fg="#00205b" 
     style="margin:0 auto; max-width:100%; width:640px;">
  <iframe title="Riddle Title" 
          src="https://www.riddle.com/embed/a/{your-riddle-id}?lazyImages=false&staticHeight=false" 
          allow="autoplay" 
          referrerpolicy="strict-origin">
  </iframe>
</div>
```

## 📁 Files

- `embedV2-riddle.js` - Full version of the embed script
- `embedV2-riddle.min.js` - Minified version (recommended for production)

## ✅ Benefits of Self-Hosting

- **🔒 Full Control**: Complete control over script delivery and caching
- **📊 Compliance**: Meets strict data protection and security requirements
- **⚡ Performance**: Can be optimized for your specific infrastructure
- **🛡️ Reliability**: No dependency on external CDN availability

## 🔄 Updates

⚠️ **Important**: When self-hosting, you are responsible for keeping the script updated.

### Recommended Update Practice

- 🔍 Monitor the official repository regularly for updates
- 📅 Schedule regular update checks into your maintenance cycle
- 🧪 Test new versions before production deployment

## 📖 More Information

Comprehensive documentation and examples can be found in the [official Riddle documentation](https://www.riddle.com/examples/embed-code/load-the-riddle-embed-script-in-your-site-header).

## 🔗 Links

- [Riddle.com](https://www.riddle.com)
- [GitHub Repository](https://github.com/riddle-com/embed)

---

© Riddle Technologies AG.
