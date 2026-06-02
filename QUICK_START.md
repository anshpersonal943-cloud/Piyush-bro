# ⚡ QUICK START - 5 MINUTE SETUP

## 🚀 Get Running in 5 Steps

### Step 1: Open Terminal
- Press `Ctrl + ` ` (backtick) in VS Code
- You're in the project folder ✅

### Step 2: Install Dependencies
```bash
npm install
```
**Wait ~30 seconds**

### Step 3: Start Server
```bash
npm start
```

**You should see:**
```
🎂 BRO MEMORY VAULT - SERVER RUNNING ❤️
🌐 Website: http://localhost:3000
```

### Step 4: Open Browser
Visit: **http://localhost:3000**

### Step 5: Enjoy!
- 🎂 Cut the cake
- 📸 Upload memories
- 💬 Change quotes
- 🎁 Open surprise

---

## 🛑 Having Issues?

### Port 3000 in use?
```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### npm not found?
1. Download [Node.js](https://nodejs.org)
2. Restart VS Code
3. Try again

### Styles look broken?
- Hard refresh: **Ctrl+Shift+R**
- Clear cache: Settings → Privacy → Clear
- Restart server

---

## ✏️ Quick Customizations

### Change Title
File: `public/index.html` (line 30)
```html
<h1>Happy Birthday [NAME] 🎂</h1>
```

### Change Image
File: `public/index.html` (line 50)
```html
<img src="YOUR_IMAGE_URL" alt="Photo">
```

### Change School End Date
File: `public/script.js` (line 21)
```javascript
const schoolEndDate = new Date('2025-06-15').getTime();
```

---

## 📖 Full Guides

- 📋 **SETUP_GUIDE.md** - Complete setup
- 🎨 **CUSTOMIZATION_GUIDE.md** - Edit everything
- ✨ **FEATURES_GUIDE.md** - All features explained
- 📚 **README.md** - Full documentation

---

## 🎮 Quick Features

| Feature | Key |
|---------|-----|
| Cut Cake | **C** |
| New Quote | **Q** |
| Surprise | **S** |
| Close | **Esc** |

---

**That's it! You're ready to go!** 🚀

Questions? Check the full guides above ✅
