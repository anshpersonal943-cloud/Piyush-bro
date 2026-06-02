const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARE
========================= */

// CORS - Allow requests from all origins
app.use(cors());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files - Serve public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

/* =========================
   CREATE FILES IF MISSING
========================= */

// Create memories.json if it doesn't exist
const memoriesPath = path.join(__dirname, 'memories.json');
if (!fs.existsSync(memoriesPath)) {
  fs.writeFileSync(memoriesPath, '[]');
  console.log('✅ Created memories.json');
}

// Create uploads folder if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'public/uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'public/uploads'), { recursive: true });
  console.log('✅ Created uploads folder');
}

// Create default upload folders for direct image grouping
const defaultUploadFolders = ['investiture-ceremony', 'jaipur-trip', 'sunflower-rayban'];
defaultUploadFolders.forEach((folder) => {
  const folderPath = path.join(__dirname, 'public/uploads', folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`✅ Created default upload folder: ${folder}`);
  }
});

// Helper: load memories safely
function loadMemories() {
  try {
    const raw = fs.readFileSync(memoriesPath, 'utf-8').trim();
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load memories, resetting file:', error.message);
    fs.writeFileSync(memoriesPath, '[]');
    return [];
  }
}

function scanUploadFiles(dirPath, baseUrl = '/uploads') {
  const images = [];
  if (!fs.existsSync(dirPath)) return images;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      images.push(...scanUploadFiles(fullPath, `${baseUrl}/${encodeURIComponent(entry.name)}`));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if (!allowed.includes(ext)) continue;

    const urlPath = `${baseUrl}/${encodeURIComponent(entry.name)}`;
    const stats = fs.statSync(fullPath);
    images.push({
      image: urlPath,
      title: path.basename(entry.name, ext).replace(/[-_]/g, ' '),
      message: '',
      createdAt: stats.mtime.toISOString(),
      updatedAt: stats.mtime.toISOString(),
      isScanOnly: true
    });
  }

  return images;
}

/* =========================
   MULTER STORAGE CONFIGURATION
========================= */

function formatFolderName(rawFolder) {
  return (rawFolder || '')
    .trim()
    .replace(/[^a-zA-Z0-9-_ ]+/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const safeFolder = formatFolderName(req.body.folderName);
    const uploadDir = safeFolder
      ? path.join(__dirname, 'public/uploads', safeFolder)
      : path.join(__dirname, 'public/uploads');

    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max size
  }
});

/* =========================
   HOME ROUTE
========================= */

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

/* =========================
   UPLOAD MEMORY ENDPOINT
========================= */

app.post('/upload', upload.single('photo'), (req, res) => {
  try {
    // Validate inputs
    if (!req.body.title || !req.body.message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Photo is required'
      });
    }

    const title = req.body.title.substring(0, 100); // Limit title length
    const message = req.body.message.substring(0, 1000); // Limit message length
    const safeFolder = formatFolderName(req.body.folderName);
    const image = safeFolder
      ? '/uploads/' + safeFolder + '/' + req.file.filename
      : '/uploads/' + req.file.filename;

    // Create new memory object
    const newMemory = {
      id: Date.now(),
      title: title,
      message: message,
      image: image,
      createdAt: new Date()
    };

    // Read existing memories
    const memoriesPath = path.join(__dirname, 'memories.json');
    const oldData = JSON.parse(fs.readFileSync(memoriesPath, 'utf-8'));

    // Add new memory
    oldData.push(newMemory);

    // Save to file
    fs.writeFileSync(memoriesPath, JSON.stringify(oldData, null, 2));

    res.json({
      success: true,
      message: 'Memory Uploaded ❤️',
      memory: newMemory
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload Failed ❌: ' + error.message
    });
  }
});

/* =========================
   GET ALL MEMORIES ENDPOINT
========================= */

app.get('/memories', (req, res) => {
  try {
    const memories = loadMemories();
    const scanned = scanUploadFiles(path.join(__dirname, 'public/uploads'));

    const memoryMap = new Map();
    memories.forEach(memory => memoryMap.set(memory.image, memory));
    scanned.forEach(fileMemory => {
      if (!memoryMap.has(fileMemory.image)) {
        memoryMap.set(fileMemory.image, fileMemory);
      }
    });

    const merged = Array.from(memoryMap.values());
    merged.sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));

    res.json(merged);
  } catch (error) {
    console.error('Error loading memories:', error);
    res.status(500).json({
      success: false,
      message: 'Error Loading Memories',
      data: []
    });
  }
});

/* =========================
   GET FEATURED FOLDERS ENDPOINT
========================= */

function getFolderPreviewImage(folderName) {
  const folderPath = path.join(__dirname, 'public/uploads', folderName);
  if (!fs.existsSync(folderPath)) return null;

  const files = fs.readdirSync(folderPath)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    })
    .sort((a, b) => {
      const aTime = fs.statSync(path.join(folderPath, a)).mtime;
      const bTime = fs.statSync(path.join(folderPath, b)).mtime;
      return bTime - aTime;
    });

  if (!files.length) return null;
  return '/uploads/' + encodeURIComponent(folderName) + '/' + encodeURIComponent(files[0]);
}

app.get('/featured-folders', (req, res) => {
  try {
    const folders = ['investiture-ceremony', 'jaipur-trip', 'sunflower-rayban'];
    const previews = folders.map((folder) => ({
      folder,
      image: getFolderPreviewImage(folder)
    }));
    res.json(previews);
  } catch (error) {
    console.error('Error loading featured folders:', error);
    res.status(500).json({
      success: false,
      message: 'Error Loading Featured Folders',
      data: []
    });
  }
});

/* =========================
   GET PIYUSH PHOTOS ENDPOINT
========================= */

app.get('/piyush-photos', (req, res) => {
  try {
    const piyushDir = path.join(__dirname, 'public/uploads/photo piyush');
    
    if (!fs.existsSync(piyushDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(piyushDir)
      .filter(f => {
        const ext = path.extname(f).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      })
      .sort()
      .map((file, index) => {
        const fullPath = path.join(piyushDir, file);
        const stats = fs.statSync(fullPath);
        return {
          id: index,
          image: '/uploads/photo%20piyush/' + encodeURIComponent(file),
          title: 'Memory #' + (index + 1),
          message: 'A cherished moment captured',
          createdAt: stats.mtime.toISOString(),
          updatedAt: stats.mtime.toISOString()
        };
      });

    res.json(files);
  } catch (error) {
    console.error('Error loading piyush photos:', error);
    res.status(500).json({
      success: false,
      message: 'Error Loading Photos',
      data: []
    });
  }
});

/* =========================
   GET SINGLE MEMORY ENDPOINT
========================= */

app.get('/memory/:id', (req, res) => {
  try {
    const memoryId = parseInt(req.params.id);
    const memories = loadMemories();
    const memory = memories.find(m => m.id === memoryId);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Memory Not Found'
      });
    }

    res.json(memory);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching memory'
    });
  }
});

/* =========================
   DELETE MEMORY ENDPOINT
========================= */

app.delete('/memory/:id', (req, res) => {
  try {
    const memoryId = parseInt(req.params.id);

    // Read memories
    let memories = loadMemories();

    // Find memory to delete
    const memoryToDelete = memories.find(memory => memory.id === memoryId);

    if (!memoryToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Memory Not Found'
      });
    }

    // Delete image file
    const imagePath = path.join(__dirname, 'public', memoryToDelete.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log('✅ Deleted image:', imagePath);
    }

    // Remove memory from array
    memories = memories.filter(memory => memory.id !== memoryId);

    // Save updated memories
    fs.writeFileSync(memoriesPath, JSON.stringify(memories, null, 2));

    res.json({
      success: true,
      message: 'Memory Deleted 🗑️'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Delete Failed ❌: ' + error.message
    });
  }
});

/* =========================
   UPDATE/EDIT MEMORY ENDPOINT
========================= */

app.put('/memory/:id', (req, res) => {
  try {
    const memoryId = parseInt(req.params.id);
    const { title, message, folderName } = req.body;

    // Validate inputs
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    // Read memories
    let memories = loadMemories();

    // Find and update memory
    const memoryIndex = memories.findIndex(m => m.id === memoryId);

    if (memoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Memory Not Found'
      });
    }

    memories[memoryIndex].title = title.substring(0, 100);
    memories[memoryIndex].message = message.substring(0, 1000);
    memories[memoryIndex].updatedAt = new Date();

    // If a folder assignment was provided, store the sanitized folder name
    if (typeof folderName === 'string') {
      const safeFolder = formatFolderName(folderName);
      memories[memoryIndex].folder = safeFolder || undefined;

      // If folder exists and has images, pick the newest file as the memory image
      if (safeFolder) {
        const folderPath = path.join(__dirname, 'public/uploads', safeFolder);
        if (fs.existsSync(folderPath)) {
          const files = fs.readdirSync(folderPath).filter(f => {
            const ext = path.extname(f).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
          }).sort((a, b) => {
            const ta = fs.statSync(path.join(folderPath, a)).mtime;
            const tb = fs.statSync(path.join(folderPath, b)).mtime;
            return tb - ta;
          });
          if (files.length) {
            memories[memoryIndex].image = '/uploads/' + encodeURIComponent(safeFolder) + '/' + encodeURIComponent(files[0]);
          }
        }
      }
    }

    // Save updated memories
    fs.writeFileSync(memoriesPath, JSON.stringify(memories, null, 2));

    res.json({
      success: true,
      message: 'Memory Updated ✨',
      memory: memories[memoryIndex]
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Update Failed ❌: ' + error.message
    });
  }
});

/* =========================
   ERROR HANDLING
========================= */

// Error handler for multer and general errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        message: 'File is too large (max 10MB)'
      });
    }
  }

  if (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/* =========================
   SERVER STARTUP
========================= */

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  🎂 BRO MEMORY VAULT - SERVER RUNNING ❤️   ║
╠════════════════════════════════════════════╣
║                                            ║
║  🌐 Website: http://localhost:${PORT}         ║
║  📸 Uploads: public/uploads/               ║
║  💾 Database: memories.json                ║
║  🎨 Theme: Cinematic & Premium             ║
║                                            ║
╠════════════════════════════════════════════╣
║  Features:                                 ║
║  ✅ Birthday celebration animations       ║
║  ✅ Memory upload with images             ║
║  ✅ Countdown timer to school end         ║
║  ✅ Friendship quotes generator           ║
║  ✅ Cake cutting with confetti            ║
║  ✅ Surprise messages                     ║
║  ✅ Fully responsive design               ║
║  ✅ Premium glassmorphism UI              ║
║                                            ║
╠════════════════════════════════════════════╣
║  Made with ❤️ for your brother ✨          ║
╚════════════════════════════════════════════╝
  `);

  console.log('Server is ready! Open http://localhost:' + PORT + ' in your browser 🚀');
});

/* =========================
   UPLOAD FOLDERS LISTING
========================= */

app.get('/upload-folders', (req, res) => {
  try {
    const uploadsRoot = path.join(__dirname, 'public/uploads');
    if (!fs.existsSync(uploadsRoot)) return res.json([]);
    const entries = fs.readdirSync(uploadsRoot, { withFileTypes: true });
    const folders = entries.filter(e => e.isDirectory()).map(d => d.name);
    res.json(folders);
  } catch (error) {
    console.error('Error listing upload folders:', error);
    res.status(500).json({ success: false, message: 'Failed to list folders' });
  }
});

app.get('/folders/:folder/images', (req, res) => {
  try {
    const raw = req.params.folder || '';
    const safe = formatFolderName(raw);
    if (!safe) return res.json([]);
    const folderPath = path.join(__dirname, 'public/uploads', safe);
    if (!fs.existsSync(folderPath)) return res.json([]);
    const files = fs.readdirSync(folderPath).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    }).sort((a, b) => {
      const ta = fs.statSync(path.join(folderPath, a)).mtime;
      const tb = fs.statSync(path.join(folderPath, b)).mtime;
      return tb - ta;
    }).map(f => '/uploads/' + encodeURIComponent(safe) + '/' + encodeURIComponent(f));

    res.json(files);
  } catch (error) {
    console.error('Error listing images for folder:', error);
    res.status(500).json({ success: false, message: 'Failed to list images' });
  }
});

/* =========================
   CREATE MEMORY FROM EXISTING IMAGE
========================= */

app.post('/memories', (req, res) => {
  try {
    const { image, title, message, folderName } = req.body || {};
    if (!image || !title) {
      return res.status(400).json({ success: false, message: 'Image and title are required' });
    }

    // Validate image path references our uploads
    if (!image.startsWith('/uploads/')) {
      return res.status(400).json({ success: false, message: 'Invalid image path' });
    }

    const memories = loadMemories();
    const newMemory = {
      id: Date.now(),
      title: String(title).substring(0, 100),
      message: String(message || '').substring(0, 1000),
      image: image,
      folder: formatFolderName(folderName) || undefined,
      createdAt: new Date()
    };

    memories.push(newMemory);
    fs.writeFileSync(memoriesPath, JSON.stringify(memories, null, 2));

    res.json({ success: true, memory: newMemory });
  } catch (error) {
    console.error('Error creating memory:', error);
    res.status(500).json({ success: false, message: 'Failed to create memory' });
  }
});

// 404 handler (move to end so all routes above are checked first)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});