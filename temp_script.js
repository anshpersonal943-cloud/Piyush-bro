if (!window.confetti) {
  window.confetti = function () { console.warn('confetti not available'); };
}

const FEATURED_PHOTO_COUNT = 6;
const INTRO_PETAL_COUNT = 20;
const FINAL_VIDEO_SRC = 'videos/final-frame.mp4';
const INTRO_FALLBACK_IMAGES = [
  '/uploads/photo%20piyush/6086972023381890029.jpg',
  '/uploads/photo%20piyush/6086972023381890030.jpg',
  '/uploads/photo%20piyush/6086972023381890031.jpg',
  '/uploads/photo%20piyush/6086972023381890032.jpg',
  '/uploads/photo%20piyush/6086972023381890033.jpg',
  '/uploads/photo%20piyush/6086972023381890034.jpg',
  '/uploads/photo%20piyush/6086972023381890035.jpg',
  '/uploads/photo%20piyush/6086972023381890036.jpg',
  '/uploads/photo%20piyush/6086972023381890037.jpg',
  '/uploads/photo%20piyush/6086972023381890038.jpg',
  '/uploads/photo%20piyush/6086972023381890039.jpg',
  '/uploads/photo%20piyush/6086972023381890040.jpg'
];

let modal, modalBackdrop, modalClose, modalPhoto, modalVideo, finalVideo, modalTitle, modalCaption, openFinalBtn, popupEl, surpriseBtn, introOpenBtn;
let sunflowerIntroStarted = false;
let introClosing = false;

function openPhoto(title, caption, src) {
  if (!modal) return;
  modal.classList.remove('hidden');
  if (modalPhoto) modalPhoto.classList.remove('hidden');
  if (modalVideo) modalVideo.classList.add('hidden');
  if (finalVideo) finalVideo.pause();
  if (modalPhoto) {
    const safeUrl = src ? src.replace(/"/g, '\\"') : '';
    modalPhoto.style.backgroundImage = src ? `url("${safeUrl}")` : 'radial-gradient(circle, rgba(255,255,255,0.16), rgba(255,255,255,0.02))';
  }
  if (modalTitle) modalTitle.textContent = title || 'Memory';
  if (modalCaption) modalCaption.textContent = caption || 'A cinematic view of the photo.';
  if (window.gsap) {
    gsap.fromTo('.modal-shell', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
  }
}

function openFinalVideo() {
  if (!modal) return;
  modal.classList.remove('hidden');
  if (modalPhoto) {
    modalPhoto.classList.add('hidden');
    modalPhoto.style.backgroundImage = '';
  }
  if (modalVideo) modalVideo.classList.remove('hidden');
  if (finalVideo) {
    if (modalVideo) modalVideo.classList.remove('has-video');
    const source = finalVideo.querySelector('source');
    if (source && source.getAttribute('src') !== FINAL_VIDEO_SRC) {
      source.setAttribute('src', FINAL_VIDEO_SRC);
    }
    finalVideo.load();
  }
  if (modalTitle) modalTitle.textContent = 'Last Video';
  if (modalCaption) modalCaption.textContent = 'This frame is ready for the video you will add later.';
  if (window.gsap) {
    gsap.fromTo('.modal-shell', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
  }
}

function closePhoto() {
  if (!modal) return;
  if (finalVideo) finalVideo.pause();
  if (window.gsap) {
    gsap.to('.modal-shell', { y: 30, opacity: 0, duration: 0.28, ease: 'power3.in', onComplete() { modal.classList.add('hidden'); } });
  } else {
    modal.classList.add('hidden');
  }
}

function triggerConfettiBurst() {
  try {
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 }, colors: ['#ffb4df', '#ffd37d', '#ff8fc3', '#ffffff'] });
  } catch (e) { }
}

function applyTilt(card) {
  if (!card) return;
  const originalTransform = card.style.transform || getComputedStyle(card).transform || '';
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * -10;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = originalTransform;
  });
}

function mapPhotoItems() {
  document.querySelectorAll('.photo-card').forEach(card => {
    card.style.willChange = 'transform';
    function mapMomentCards() {
      document.querySelectorAll('.moment-card').forEach(card => {
        if (card.dataset.mapped === 'true') return;
        card.dataset.mapped = 'true';

        const titleEl = card.querySelector('.moment-copy h3');
        const captionEl = card.querySelector('.moment-copy p');

        card.addEventListener('click', async () => {
          const title = titleEl ? titleEl.textContent.trim() : '';
          const caption = captionEl ? captionEl.textContent.trim() : '';

          // Prefer an explicit data-src (set by loadFolderPreviewImages), otherwise read computed background-image
          let src = card.dataset.src || '';
          if (!src) {
            const imageEl = card.querySelector('.moment-image');
            const bg = imageEl ? getComputedStyle(imageEl).backgroundImage : '';
            const m = bg && bg.match(/url\((?:"|')?(.*?)(?:"|')?\)/);
            if (m && m[1]) src = m[1];
          }

          // Normalize empty or gradient backgrounds to empty string
          if (src && src.includes('gradient(')) src = '';

          triggerConfettiBurst();
          openPhoto(title, caption, src || '');
        });

        applyTilt(card);
      });
    }
    if (card.dataset.mapped !== 'true') {
      card.dataset.mapped = 'true';
      card.addEventListener('click', () => {
        const title = card.dataset.title || '';
        const caption = card.dataset.caption || '';
        const src = card.dataset.src || card.querySelector('img')?.src || '';
        triggerConfettiBurst();
        openPhoto(title, caption, src);
      });
      applyTilt(card);
    }
  });
}

function initHeroAnimations() {
  if (!window.gsap) return;
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.from('.intro-shell', { opacity: 0, scale: 0.98, duration: 1.2 });

  gsap.to('.hero-hexagon', { rotation: 360, duration: 60, ease: 'none', repeat: -1 });
  gsap.to('.background-layer', { y: '7%', duration: 32, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.bokeh-layer', { x: '5%', duration: 26, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.floating-hearts', { y: '-4%', duration: 28, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.fromTo('.photo-card', { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 1.2 });

  const cards = document.querySelectorAll('.photo-card');
  cards.forEach((card, index) => {
    gsap.to(card, {
      y: `+=${Math.sin(index * 0.8) * 10}px`,
      x: `+=${Math.cos(index * 1.1) * 10}px`,
      rotation: `+=${index % 2 === 0 ? 3 : -3}`,
      duration: 8 + index,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  });
}

function initCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!window.gsap || !track) return;
  gsap.to(track, { xPercent: -33, duration: 24, ease: 'none', repeat: -1 });
}

function initParallax() {
  const bg = document.querySelector('.background-layer');
  const bokeh = document.querySelector('.bokeh-layer');
  if (!bg && !bokeh) return;
  let latestScroll = 0;
  let ticking = false;
  window.addEventListener('scroll', () => {
    latestScroll = window.scrollY;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        const s = latestScroll;
        if (bg) bg.style.transform = `translateY(${s * 0.02}px)`;
        if (bokeh) bokeh.style.transform = `translateY(${s * -0.03}px)`;
        ticking = false;
      });
    }
  }, { passive: true });
}

function initFinalButton() {
  if (!openFinalBtn) return;
  openFinalBtn.addEventListener('click', () => {
    triggerConfettiBurst();
    openFinalVideo();
  });
}

function openPopup() {
  if (!popupEl) return;
  popupEl.classList.remove('hidden');
  triggerConfettiBurst();
  if (window.gsap) gsap.fromTo('#popup .popup-content', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
}

function openIntro(event) {
  // Allow real user interactions (clicks and keydowns). Block only untrusted programmatic clicks.
  if (event && event.type === 'click' && !event.isTrusted) return;
  if (introClosing) return;
  introClosing = true;
  const intro = document.getElementById('sunflowerIntro');
  if (intro) intro.classList.add('intro-closed');
  document.body.classList.remove('not-loaded');
  revealMainContent();
  triggerConfettiBurst();
}

window.openIntro = openIntro;

function closePopup() {
  if (!popupEl) return;
  if (window.gsap) {
    gsap.to('#popup .popup-content', { y: 20, opacity: 0, duration: 0.28, ease: 'power3.in', onComplete() { popupEl.classList.add('hidden'); } });
  } else {
    popupEl.classList.add('hidden');
  }
}

window.closePopup = closePopup;

function initAudioAutoplay() {
  const audio = document.querySelector('audio');
  if (!audio) return;
  audio.volume = 0.55;
  audio.loop = true;
  audio.autoplay = true;
  audio.playsInline = true;

  const attemptPlay = () => {
    const playPromise = audio.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {
        const resumePlayback = () => {
          document.removeEventListener('click', resumePlayback, true);
          document.removeEventListener('keydown', resumePlayback, true);
          audio.play().catch(() => { });
        };
        document.addEventListener('click', resumePlayback, { once: true, capture: true });
        document.addEventListener('keydown', resumePlayback, { once: true, capture: true });
      });
    }
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    attemptPlay();
  } else {
    document.addEventListener('DOMContentLoaded', attemptPlay, { once: true });
  }
}

function setSectionObserver() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.section, .photo-card, .memory-item, .timeline-card, .moment-card, .audio-card, .finale-panel, .upload-form').forEach(el => observer.observe(el));
}

function revealMainContent() {
  const mainFrame = document.querySelector('.page-frame');
  if (mainFrame) {
    mainFrame.style.opacity = '1';
    if (window.gsap) {
      gsap.fromTo('.page-frame', { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' });
    }
  }
}

function getFallbackIntroMemories() {
  const cardMemories = Array.from(document.querySelectorAll('.photo-card')).map((card, index) => ({
    image: card.dataset.src || card.querySelector('img')?.getAttribute('src') || '',
    title: card.dataset.title || `Memory #${index + 1}`,
    message: card.dataset.caption || 'A cherished moment captured'
  })).filter(memory => memory.image);
  const directFallbacks = INTRO_FALLBACK_IMAGES.map((image, index) => ({
    image,
    title: `Memory #${index + 1}`,
    message: 'A cherished moment captured'
  }));
  return [...cardMemories, ...directFallbacks];
}

function renderSunflowerIntro(memories) {
  const petalContainer = document.getElementById('sunflowerPetals');
  if (!petalContainer || !Array.isArray(memories) || memories.length === 0) return;

  const existingPetals = petalContainer.querySelectorAll('.sunflower-petal');
  const introMemories = shuffleArray(memories);

  if (existingPetals.length) {
    existingPetals.forEach((petal, index) => {
      const memory = introMemories[index % introMemories.length];
      const img = petal.querySelector('img');
      if (img && memory?.image) {
        img.src = memory.image;
        img.alt = memory.title || `Memory petal ${index + 1}`;
      }
      petal.classList.add('bloomed');
    });
    return;
  }

  petalContainer.innerHTML = '';
  const sourceMemories = introMemories.slice(0, INTRO_PETAL_COUNT);
  const generatedMemories = Array.from({ length: INTRO_PETAL_COUNT }, (_, index) => sourceMemories[index % sourceMemories.length]);
  generatedMemories.forEach((memory, index) => {
    const angle = (360 / generatedMemories.length) * index;
    const radians = (angle - 90) * Math.PI / 180;
    const radius = 34;
    const depth = index % 2 === 0 ? '1.8rem' : '-0.6rem';
    const petal = document.createElement('div');
    petal.className = 'sunflower-petal bloomed';
    petal.style.setProperty('--petal-left', `${(50 + Math.cos(radians) * radius).toFixed(2)}%`);
    petal.style.setProperty('--petal-top', `${(50 + Math.sin(radians) * radius).toFixed(2)}%`);
    petal.style.setProperty('--angle', `${angle.toFixed(3)}deg`);
    petal.style.setProperty('--delay', `${index * 0.08}s`);
    petal.style.setProperty('--float-delay', `${index * -0.18}s`);
    petal.style.setProperty('--depth', depth);
    petal.innerHTML = `<img src="${escapeHtml(memory.image)}" alt="${escapeHtml(memory.title || `Memory petal ${index + 1}`)}" />`;
    petalContainer.appendChild(petal);
  });
}

function bloomSunflowerPetals() {
  document.querySelectorAll('.sunflower-petal').forEach((petal, index) => {
    setTimeout(() => petal.classList.add('bloomed'), index * 75);
  });
}

function startSunflowerIntro() {
  if (sunflowerIntroStarted) return;
  sunflowerIntroStarted = true;

  const flower = document.getElementById('memorySunflower');

  if (flower) {
    flower.classList.add('blooming');
  }

  bloomSunflowerPetals();

  // Keep the intro open until the user chooses to enter.
}

function init() {
  modal = document.getElementById('photoModal');
  modalBackdrop = document.getElementById('modalBackdrop');
  modalClose = document.getElementById('modalClose');
  modalPhoto = document.querySelector('.modal-photo');
  modalVideo = document.querySelector('.modal-video');
  finalVideo = document.getElementById('finalVideo');
  modalTitle = document.getElementById('modalTitle');
  modalCaption = document.getElementById('modalCaption');
  openFinalBtn = document.getElementById('openFinal');
  popupEl = document.getElementById('popup');
  surpriseBtn = document.getElementById('surpriseBtn');
  introOpenBtn = document.getElementById('introOpen');

  if (finalVideo && modalVideo) {
    finalVideo.addEventListener('canplay', () => modalVideo.classList.add('has-video'));
    finalVideo.addEventListener('error', () => modalVideo.classList.remove('has-video'));
  }

  initHeroAnimations();
  initCarousel();
  setSectionObserver();
  initParallax();
  loadFolderPreviewImages().then(mapMomentCards).catch(() => mapMomentCards());

  // Ensure Enter/Space keyboard activates the intro button when focused
  if (introOpenBtn) {
    introOpenBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        // Let openIntro validate isTrusted and proceed
        openIntro(e);
      }
    });
  }

  // Fallback: allow Enter/Space to open intro even if focus isn't on the button
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const intro = document.getElementById('sunflowerIntro');
    if (!intro) return;
    // Only trigger when intro is still open (not yet closed)
    if (intro.classList.contains('intro-closed')) return;
    openIntro(e);
  });
  renderSunflowerIntro(getFallbackIntroMemories());
  startSunflowerIntro();
  mapPhotoItems();
  initFinalButton();
  initAudioAutoplay();

  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const title = document.getElementById('memoryTitle').value.trim();
      const message = document.getElementById('memoryMessage').value.trim();
      const folderName = document.getElementById('memoryFolder').value.trim();
      const photo = document.getElementById('memoryPhoto').files[0];
      if (!title || !message || !photo) {
        alert('Please complete all fields and select a photo.');
        return;
      }
      const fd = new FormData();
      fd.append('title', title);
      fd.append('message', message);
      if (folderName) fd.append('folderName', folderName);
      fd.append('photo', photo);
      try {
        const res = await fetch('/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success) {
          alert('Memory uploaded successfully!');
          uploadForm.reset();
          loadMemoriesFromServer();
          triggerConfettiBurst();
        } else {
          alert(data.message || 'Upload failed.');
        }
      } catch (error) {
        console.error(error);
        alert('Upload error.');
      }
    });
  }

  loadMemoriesFromServer();

  if (modalBackdrop) modalBackdrop.addEventListener('click', closePhoto);
  if (modalClose) modalClose.addEventListener('click', closePhoto);
  if (introOpenBtn) introOpenBtn.addEventListener('click', openIntro);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePhoto();
      closePopup();
    }
  });
}

function escapeHtml(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getMemoryKey(imagePath) {
  if (!imagePath) return '';
  const filename = imagePath.split('/').pop() || imagePath;
  try {
    return decodeURIComponent(filename);
  } catch (error) {
    return filename;
  }
}

async function loadMemoryDetails() {
  try {
    const response = await fetch('/memory-details.json', { cache: 'no-store' });
    if (!response.ok) return {};
    return await response.json();
  } catch (error) {
    console.warn('memory details not loaded', error);
    return {};
  }
}

function applyMemoryDetails(memories, details) {
  if (!Array.isArray(memories) || !details) return memories;
  return memories.map((memory) => {
    const key = getMemoryKey(memory.image);
    const custom = details[memory.image] || details[key];
    if (!custom) return memory;
    return {
      ...memory,
      title: custom.title || memory.title,
      message: custom.message || memory.message
    };
  });
}

async function loadFolderPreviewImages() {
  try {
    const response = await fetch('/featured-folders');
    if (!response.ok) return;
    const previews = await response.json();

    previews.forEach((preview) => {
      const card = document.querySelector(`.moment-card[data-folder="${preview.folder}"]`);
      if (!card || !preview.image) return;
      const imageEl = card.querySelector('.moment-image');
      if (imageEl) {
        imageEl.style.backgroundImage = `url("${preview.image}")`;
        // Make the preview image available to click handlers
        card.dataset.src = preview.image;
      }
    });
  } catch (error) {
    console.error('Failed to load folder preview images:', error);
  }
}

async function loadMemoriesFromServer() {
  try {
    const response = await fetch('/piyush-photos');
    if (!response.ok) return;
    let memories = await response.json();
    const memoryDetails = await loadMemoryDetails();
    memories = applyMemoryDetails(memories, memoryDetails);
    
    memories = shuffleArray(memories);
    renderSunflowerIntro(memories);

    const cards = document.querySelectorAll('.photo-card');
    const featuredMemories = memories.slice(0, FEATURED_PHOTO_COUNT);
    const remainingMemories = memories.slice(FEATURED_PHOTO_COUNT);

    cards.forEach((card, index) => {
      const memory = featuredMemories[index];
      if (!memory) {
        card.classList.add('hidden');
        return;
      }
      card.classList.remove('hidden');
      const src = memory.image || '';
      card.dataset.src = src;
      card.dataset.title = memory.title || `Memory #${index + 1}`;
      card.dataset.caption = memory.message || 'A cherished moment captured';
      const img = card.querySelector('img');
      if (img) {
        img.src = src;
        img.alt = card.dataset.title;
        img.onload = () => adjustImageFocus(img);
      }
    });

    await renderMemoryGallery(remainingMemories);
    mapPhotoItems();
  } catch (error) {
    console.error('loadMemories error', error);
  }
}

async function renderMemoryGallery(memories) {
  const container = document.getElementById('memoryGallery');
  if (!container) return;
  if (!Array.isArray(memories) || memories.length === 0) {
    container.innerHTML = '<div class="no-memories"><p>No extra memories yet. The current photos are all featured above.</p></div>';
    return;
  }
  container.innerHTML = '';
  memories.forEach(memory => {
    const resolvedSrc = memory.image ? memory.image : 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'1200\' height=\'800\'%3E%3Crect width=\'1200\' height=\'800\' fill=\'%23211f2a\'/%3E%3C/svg%3E';
    const card = document.createElement('div');
    card.className = 'memory-item visible';
    card.dataset.src = resolvedSrc;
    card.dataset.title = memory.title || 'Memory';
    card.dataset.caption = memory.message || 'A cherished moment captured';
    card.innerHTML = `
      <img src="${escapeHtml(resolvedSrc)}" alt="${escapeHtml(memory.title)}" />
      <h3>${escapeHtml(memory.title)}</h3>
      <p>${escapeHtml(memory.message)}</p>
    `;
    card.addEventListener('click', () => {
      triggerConfettiBurst();
      openPhoto(card.dataset.title, card.dataset.caption, resolvedSrc);
    });
    container.appendChild(card);
  });
}

async function resolveFolderImagesForMemory(memory) {
  if (!memory) return memory?.image || '';
  if (!memory.folder) return memory.image;
  try {
    const response = await fetch(`/folders/${encodeURIComponent(memory.folder)}/images`);
    if (!response.ok) return memory.image;
    const files = await response.json();
    if (Array.isArray(files) && files.length) return files[0];
  } catch (error) {
    console.error('resolveFolderImages error', error);
  }
  return memory.image;
}

async function adjustImageFocus(img) {
  if (!img || !img.complete || !img.naturalWidth) return;
  try {
    if ('FaceDetector' in window) {
      const detector = new FaceDetector({ fastMode: true, maxDetectedFaces: 5 });
      const faces = await detector.detect(img);
      if (faces && faces.length) {
        const largest = faces.reduce((a, b) => (a.boundingBox.width * a.boundingBox.height) > (b.boundingBox.width * b.boundingBox.height) ? a : b);
        const box = largest.boundingBox;
        const cx = Math.max(0, Math.min(100, ((box.x + box.width / 2) / img.naturalWidth) * 100));
        const cy = Math.max(0, Math.min(100, ((box.y + box.height / 2) / img.naturalHeight) * 100));
        img.style.objectPosition = `${cx}% ${cy}%`;
        return;
      }
    }
  } catch (error) {
    console.warn('FaceDetector failed:', error);
  }
  img.style.objectPosition = 'center';
}

document.addEventListener('DOMContentLoaded', init);

console.log('🎬 Hexa Memory Box loaded');
