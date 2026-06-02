# 🎂 Brother Memory Vault - A Cinematic Friendship Website

A premium, fully responsive fullstack friendship and birthday memory website built with HTML, CSS, JavaScript, Node.js, and Express.js.

## 🌟 Features

### 🎉 Birthday Celebration
- ✨ Animated hero section with typing animation
- 🎂 Interactive cake cutting animation
- 🎊 Confetti and fireworks effects
- 💖 Floating hearts animation
- 🎵 Background music player
- 🎁 Surprise popup messages

### 🎓 School Year Theme
- ⏳ Countdown timer to school ending
- 💌 Emotional farewell letter section
- 📖 Friendship journey timeline
- 💪 Friendship strength meter

### 📸 Memory Management
- 📤 Upload memories with images, titles, and messages
- 🖼️ Dynamic memory gallery with edit/delete features
- 🎨 Beautiful memory cards with shadows and animations
- 💾 Persistent JSON database storage
- 📱 Fully responsive grid layout

### 🎨 Premium UI/UX
- 🌈 Pink, white, and gold gradient theme
- 🔮 Glassmorphism cards with backdrop blur
- ✨ Smooth animations and transitions
- 🌟 Neon glow effects on buttons
- 📐 Perfect typography with Poppins font
- 💫 Floating particles and stars

### ⌨️ Interactive Elements
- 💬 Friendship quotes carousel generator
- 🎯 Smooth scrolling navigation
- 🎹 Keyboard shortcuts (C, Q, S, Esc)
- 🖱️ Hover effects and animations
- 📱 Touch-friendly on mobile

### 🔧 Technical Features
- 🚀 Express.js backend with RESTful APIs
- 📁 Multer file upload handling
- 💾 JSON file-based storage (upgradable to MongoDB)
- 🌍 CORS enabled
- 🔒 File validation and error handling
- 📊 Server-side logging

## 📋 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express.js
- **Database**: JSON (or MongoDB)
- **File Upload**: Multer
- **Styling**: Glassmorphism with CSS Animations
- **Libraries**: Canvas Confetti, Google Fonts

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `multer` - File upload handling
- `cors` - Cross-Origin Resource Sharing

### Step 2: Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

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

### Step 3: Open in Browser

Visit **http://localhost:3000** in your web browser

## 📁 Project Structure

```
brother-memory-vault/
├── server.js                 # Express server with API routes
├── package.json              # Dependencies
├── memories.json             # JSON database
├── public/
│   ├── index.html           # Main HTML file
│   ├── style.css            # Premium CSS styling
│   ├── script.js            # Interactive JavaScript
│   └── uploads/             # User-uploaded images
├── README.md                # This file
└── .gitignore              # Git ignore rules
```

## 🎮 How to Use

### 🎂 Cake Cutting
1. Scroll to the cake section
2. Click "Cut The Cake ✨"
3. Watch the animation, confetti, and fireworks!
4. Keyboard shortcut: Press **C**

### 📸 Upload Memories
1. Scroll to "Add A New Memory" section
2. Enter memory title (e.g., "Lunch Time Chaos")
3. Write the memory story
4. Upload an image
5. Click "Upload Memory ❤️"
6. Your memory appears in the gallery below!

### Edit/Delete Memories
- Click **Edit ✏️** to change title or message
- Click **Delete 🗑️** to remove a memory
- **Confirm** when prompted

### 💬 View Quotes
1. Scroll to Brotherhood Quotes section
2. Click "Next Quote ✨" for new quotes
3. Keyboard shortcut: Press **Q**

### 🎁 Open Surprise
1. Scroll to Final Surprise section
2. Click "Open Surprise"
3. See a heartfelt message with animations
4. Keyboard shortcut: Press **S**

### ⏳ Countdown
- Automatically updates every second
- Shows days, hours, minutes, seconds
- Change the date in `script.js` line 21

## 🛠️ Customization Guide

### 📝 Edit Hero Section
In `public/index.html` (around line 35):
```html
<h1>Happy Birthday Bro 🎂</h1>
<p>Brothers Forever • Last School Year Together 🎓</p>
```

### 🖼️ Change Hero Image
In `public/index.html` (around line 50):
```html
<img src="YOUR_IMAGE_URL" alt="Brother Photo">
```

### 🎵 Change Background Music
In `public/index.html` (around line 130):
```html
<source src="YOUR_MUSIC_URL" type="audio/mp3">
```

### ✏️ Edit Letter
In `public/index.html` (around line 170-180):
```html
<p>Your custom letter text here...</p>
```

### 🎓 Change School End Date
In `public/script.js` (line 21):
```javascript
const schoolEndDate = new Date('2026-06-01').getTime(); // Change this date
```

### 🌈 Change Color Theme
In `public/style.css`:
- Primary color: `#ff2f92` (Pink)
- Secondary color: `#ff6cb4` (Light Pink)
- Text color: `#333`
- Background: Gradient

Search and replace these colors throughout the CSS file.

### 📖 Add More Quotes
In `public/script.js` (around line 85):
```javascript
const quotes = [
  {
    text: "Your quote here",
    author: "— Author Name"
  },
  // Add more quotes...
];
```

## 📱 Responsive Design

The website is fully responsive for:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 🖥️ Laptops (1024px+)
- 🖥️ Desktop (1200px+)

All sections adapt beautifully with:
- Flexible grid layouts
- Responsive typography
- Touch-friendly buttons
- Mobile-optimized images

## 🗄️ Database Structure

### memories.json Format
```json
[
  {
    "id": 1691234567890,
    "title": "Funny Lunch Moment",
    "message": "Remember when...",
    "image": "/uploads/1691234567890-image.jpg",
    "createdAt": "2024-08-05T10:30:00.000Z"
  }
]
```

Each memory stores:
- **id**: Unique identifier (timestamp)
- **title**: Memory title (max 100 chars)
- **message**: Memory description (max 1000 chars)
- **image**: Path to uploaded image
- **createdAt**: Creation date/time

## 🔌 API Endpoints

### GET /memories
Get all memories
```bash
curl http://localhost:3000/memories
```
**Response:**
```json
[
  { id, title, message, image, createdAt },
  ...
]
```

### POST /upload
Upload new memory with image
```bash
curl -X POST http://localhost:3000/upload \
  -F "title=My Memory" \
  -F "message=Description" \
  -F "photo=@image.jpg"
```

### PUT /memory/:id
Update memory title/message
```bash
curl -X PUT http://localhost:3000/memory/1691234567890 \
  -H "Content-Type: application/json" \
  -d '{"title": "New Title", "message": "New Message"}'
```

### DELETE /memory/:id
Delete memory
```bash
curl -X DELETE http://localhost:3000/memory/1691234567890
```

## ⚙️ Advanced Configuration

### Change Server Port
Set environment variable before running:
```bash
set PORT=5000  # Windows
npm start
```

### File Upload Limits
In `server.js`, modify line 85:
```javascript
limits: {
  fileSize: 10 * 1024 * 1024 // 10MB - change this
}
```

### Allowed File Types
In `server.js`, modify line 76:
```javascript
const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
// Add more MIME types as needed
```

## 🎨 Glassmorphism Design Elements

The website uses premium design techniques:
- Backdrop blur effect (blur-filter: 20px)
- Semi-transparent backgrounds (opacity: 0.7)
- Border: 1px solid rgba(255, 255, 255, 0.5)
- Drop shadows for depth
- Gradient text colors
- Smooth animations (0.3s - 0.8s)

## 🔒 Security Best Practices

Current implementation includes:
- ✅ CORS protection
- ✅ File type validation
- ✅ File size limits (10MB)
- ✅ Filename sanitization
- ✅ Input length validation
- ✅ Error handling

For production deployment:
- Add authentication (JWT)
- Use HTTPS
- Implement rate limiting
- Add database backups
- Use environment variables
- Enable compression middleware

## 🚀 Deployment Options

### Heroku
```bash
npm install -g heroku-cli
heroku create your-app-name
git push heroku main
```

### Netlify/Vercel (Frontend only)
```bash
npm install -D netlify-cli
netlify deploy --prod
```

### AWS/Azure/Google Cloud
Deploy as Node.js application with:
- Persistent storage for uploads
- Database (MongoDB Atlas)
- CDN for static files

## 🐛 Troubleshooting

### Port already in use
```bash
# Windows: Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :3000
kill -9 <PID>
```

### Uploads not working
- Check `public/uploads/` folder exists
- Verify file permissions
- Check file size (max 10MB)
- Use supported image formats (JPG, PNG, GIF, WebP)

### Memories not loading
- Verify `memories.json` exists
- Check server logs for errors
- Clear browser cache (Ctrl+Shift+Delete)
- Restart server

### Styles not loading
- Verify `public/style.css` exists
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for errors
- Verify paths are correct

## 📞 Support & Feedback

- Check browser console for errors
- Enable server logging
- Verify all files are in correct folders
- Ensure Node.js and npm are installed

## 📜 License

This project is open source and free to use for personal projects.

---

## 🎓 Made with ❤️ for my brother

This website celebrates friendship, memories, and the special bond between brothers during their final school year together.

**Enjoy creating memories!** ✨

---

**Last Updated:** 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
