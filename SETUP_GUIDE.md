# 🎂 Brother Memory Vault - Complete Setup Guide

## ✅ Step-by-Step Installation for VS Code

### 🔧 Prerequisites
1. **Visual Studio Code** installed
2. **Node.js v14+** installed ([Download](https://nodejs.org))
3. **npm** (comes with Node.js)

---

## 📋 Installation Steps

### Step 1️⃣: Open Terminal in VS Code

1. Open VS Code
2. Open the project folder: `File → Open Folder`
3. Select your `zip for card piyush` folder
4. Open Terminal: `Terminal → New Terminal` (or Ctrl+`)

### Step 2️⃣: Install Dependencies

```bash
npm install
```

**What this does:**
- Installs `express` (web server)
- Installs `multer` (file upload)
- Installs `cors` (security)
- Creates `node_modules/` folder

**Wait for completion** - You should see:
```
✅ added 56 packages in 15s
```

### Step 3️⃣: Start the Server

```bash
npm start
```

**Expected Output:**
```
╔════════════════════════════════════════════╗
║  🎂 BRO MEMORY VAULT - SERVER RUNNING ❤️   ║
╠════════════════════════════════════════════╣
║  🌐 Website: http://localhost:3000        ║
║  📸 Uploads: public/uploads/              ║
║  💾 Database: memories.json               ║
║  ✅ All features active                   ║
╚════════════════════════════════════════════╝
```

If you see this, **Success!** ✅

### Step 4️⃣: Open in Browser

1. Open **Chrome**, **Firefox**, or **Edge**
2. Visit: `http://localhost:3000`
3. You should see the beautiful memory vault website! 🎉

---

## 🎨 Customization Guide

### 📝 Change Names & Messages

**Edit Hero Title:**
1. Open `public/index.html`
2. Find: `Happy Birthday Bro 🎂` (around line 30)
3. Replace with your text
4. Save (Ctrl+S)
5. Refresh browser (F5)

### 🖼️ Change Hero Image

In `public/index.html` (around line 50):
```html
<img src="https://via.placeholder.com/400x400/ff2f92/ffffff?text=Brother+Photo" alt="Brother Photo">
```

**Replace with:**
```html
<img src="https://your-image-url.jpg" alt="Brother Photo">
```

**How to get image URL:**
- Upload image to: [imgur.com](https://imgur.com)
- Copy the URL
- Paste in HTML

### 🎵 Add Background Music

In `public/index.html` (around line 130):
```html
<source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3">
```

**Replace with your music URL**

### 📖 Edit Farewell Letter

In `public/index.html` (around line 170-180):
```html
<p>Bro, as I write this, I realize how grateful I am...</p>
```

Replace with your personal letter.

### 🎓 Change School End Date

In `public/script.js` (around line 21):
```javascript
const schoolEndDate = new Date('2026-06-01').getTime();
```

**Change the date to when school ends:**
```javascript
const schoolEndDate = new Date('2025-06-15').getTime(); // June 15, 2025
```

### 🌈 Change Color Theme

In `public/style.css`:
- Primary pink: `#ff2f92` → Change to your color
- Light pink: `#ff6cb4` → Change to your color
- Search and replace throughout the file

**Popular color combinations:**
- Romantic: `#ff2f92` to `#ff69b4`
- Purple: `#7b2cbf` to `#c77dff`
- Blue: `#0077b6` to `#00b4d8`
- Gold: `#d4a574` to `#f4d35e`

---

## 🎮 Features Guide

### 📸 Upload Your First Memory

1. Scroll down to **"Add A New Memory"**
2. Enter:
   - **Title:** e.g., "Funny Lunch Moment"
   - **Story:** e.g., "Remember when you spilled..."
   - **Photo:** Click to select an image from your computer
3. Click **"Upload Memory ❤️"**
4. Watch it appear in "Saved Memories Vault" below!

### 🎂 Cut The Cake

1. Scroll to **"Cut The Cake"** section
2. Click **"Cut The Cake ✨"**
3. Watch the animation!
4. See confetti and a surprise message

### 💬 View Quotes

1. Scroll to **"Brotherhood Quotes"**
2. Click **"Next Quote ✨"**
3. See different friendship quotes

### ⏳ Countdown Timer

Shows how many days until school ends!
- Change the date in `script.js` (line 21)

### 🎁 Surprise

1. Scroll to **"Final Surprise"**
2. Click **"Open Surprise"**
3. See a heartfelt message

---

## 🔧 Troubleshooting

### ❌ "Port 3000 already in use"

**Solution:**
```bash
# Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

Then run `npm start` again.

### ❌ "npm command not found"

**Solution:**
1. Download and install [Node.js](https://nodejs.org)
2. Restart VS Code
3. Run `npm install` again

### ❌ Styles not loading (page looks plain)

**Solution:**
1. Hard refresh browser: **Ctrl+Shift+R**
2. Clear cache: **Settings → Privacy → Clear Cache**
3. Check browser console (F12) for errors

### ❌ Images not showing

**Solution:**
- Use absolute URLs (starting with http://)
- Check the image URL works in a browser
- Use supported formats: JPG, PNG, GIF

### ❌ File upload not working

**Solution:**
1. Check file is an image (JPG, PNG, GIF, WebP)
2. Check file size < 10MB
3. Check browser console (F12) for errors
4. Restart server: `npm start`

### ❌ Memories not loading after refresh

**Solution:**
1. Check `memories.json` file is not deleted
2. Verify server is still running
3. Check browser console for errors
4. Restart server

---

## 📁 Project File Guide

```
zip for card piyush/
├── 📄 index.html          ← Root file (backup)
├── 📄 style.css           ← Root CSS (backup)
├── 📄 server.js           ← Express server
├── 📄 package.json        ← Dependencies
├── 📄 memories.json       ← Database
├── 📄 README.md           ← Full documentation
├── 📄 SETUP_GUIDE.md      ← This file
├── 📄 .env.example        ← Config template
├── 📄 .gitignore          ← Git ignore rules
│
└── 📁 public/             ← Website files
    ├── 📄 index.html      ← Main page ✅
    ├── 📄 style.css       ← Styles ✅
    ├── 📄 script.js       ← JavaScript ✅
    │
    └── 📁 uploads/        ← User uploaded images
        ├── 1691234567890-photo.jpg
        ├── 1691234567891-photo.jpg
        └── ...
```

---

## 🚀 Development Tips

### Auto-reload on file changes

**Option 1: Use nodemon**
```bash
npm install -D nodemon
```

Update `package.json`:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Run: `npm run dev`

**Option 2: Manual restart**
1. Stop server (Ctrl+C)
2. Run `npm start` again

### Enable Browser DevTools

Press **F12** to open:
- **Console** - See errors and logs
- **Network** - See API calls
- **Elements** - Inspect HTML/CSS
- **Application** - Check localStorage

### View Server Logs

Terminal shows all activity:
```
🎂 BRO MEMORY VAULT - SERVER RUNNING ❤️
✅ Created memories.json
✅ Created uploads folder
💾 Memory uploaded
🗑️ Memory deleted
```

---

## 📱 Test on Mobile

### Using Local Network

1. Find your computer's IP:
   - **Windows:** Open Command Prompt: `ipconfig`
   - **Mac/Linux:** Terminal: `ifconfig`

2. Look for IPv4 address (e.g., `192.168.1.100`)

3. On your phone, visit:
   ```
   http://192.168.1.100:3000
   ```

4. Test features on your phone!

---

## ✨ Features You Can Test

1. ✅ Hero animation
2. ✅ Countdown timer
3. ✅ Cake cutting with confetti
4. ✅ Quote carousel
5. ✅ Upload a memory (with image)
6. ✅ Edit a memory
7. ✅ Delete a memory
8. ✅ Surprise button
9. ✅ Responsive design (resize browser)
10. ✅ Keyboard shortcuts (C, Q, S)

---

## 🎓 Learning Resources

### Express.js
- [Express Documentation](https://expressjs.com)
- [REST API Tutorial](https://www.restapitutorial.com)

### Multer (File Upload)
- [Multer Documentation](https://github.com/expressjs/multer)

### CSS Animations
- [CSS Tricks](https://css-tricks.com)
- [Web.dev](https://web.dev)

### JavaScript
- [MDN Web Docs](https://developer.mozilla.org)
- [JavaScript.info](https://javascript.info)

---

## 🎉 Next Steps

1. ✅ Complete installation
2. ✅ Start the server
3. ✅ Test all features
4. ✅ Customize content
5. ✅ Upload memories
6. ✅ Share with friends!

---

## 📞 Getting Help

If you encounter issues:

1. **Check Terminal Output** - Look for error messages
2. **Check Browser Console** - Press F12
3. **Read Error Messages** - They usually tell you what's wrong
4. **Check File Paths** - Make sure files are in correct folders
5. **Restart Everything** - Close and reopen VS Code

---

## 🎂 Final Notes

- **Save files** with Ctrl+S after editing
- **Hard refresh browser** with Ctrl+Shift+R when changing CSS
- **Restart server** if changes don't appear (Ctrl+C, then `npm start`)
- **Use absolute URLs** for images (http://...)

---

## 🌟 Enjoy Creating Memories!

This website is designed to celebrate your friendship and create lasting digital memories. Have fun uploading, sharing, and celebrating together! ❤️

---

**Made with ❤️ for your brother**
**Last Updated:** 2026
**Version:** 1.0.0 ✅
