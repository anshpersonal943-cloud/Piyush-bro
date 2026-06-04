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

const deviceProfile = (() => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4;
  const lowCpu = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
  const saveData = Boolean(connection && connection.saveData);
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrowTouch = window.matchMedia && window.matchMedia('(max-width: 760px) and (pointer: coarse)').matches;
  const isMobile = window.innerWidth <= 820 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isSlowConnection = connection && (connection.effectiveType === '4g' ? false : connection.effectiveType === '3g' || connection.effectiveType === '2g');
  
  return {
    lowEnd: saveData || reducedMotion || (lowMemory && lowCpu) || (lowCpu && narrowTouch) || (isAndroid && (lowMemory || lowCpu || isSlowConnection)),
    reducedMotion,
    saveData,
    isMobile,
    isAndroid,
    isSlowConnection
  };
})();

document.documentElement.classList.toggle('low-end-device', deviceProfile.lowEnd);

// Optimize images for Android/Mobile
if (deviceProfile.isMobile || deviceProfile.isAndroid) {
  document.documentElement.style.setProperty('--image-quality', 'auto');
  // Disable will-change on mobile to save memory
  const style = document.createElement('style');
  style.textContent = '@media (max-width: 820px) { * { will-change: auto !important; } }';
  document.head.appendChild(style);
}

let modal, modalBackdrop, modalClose, modalPhoto, modalVideo, finalVideo, modalTitle, modalCaption, openFinalBtn, popupEl, surpriseBtn, introOpenBtn;
let sunflowerIntroStarted = false;
let introClosing = false;
let finalVideoLocked = false;
let finalVideoFinished = false;
let finalVideoBackLockActive = false;
let finalVideoLastTime = 0;

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
  if (window.gsap && !deviceProfile.isMobile) {
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
    lockFinalVideo();
    finalVideo.load();
    finalVideo.play().catch(() => {});
  }
  if (modalTitle) modalTitle.textContent = '😂😂😂😂';
  if (modalCaption) modalCaption.textContent = 'Bhai Video toh mujhe pata hai khatarnak hai 😂 par bhai no grudges plsss and kaam karvadiyo usme no drama 😂😂 🙏🙏🙏';
  if (window.gsap && !deviceProfile.isMobile) {
    gsap.fromTo('.modal-shell', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
  }
}

function closePhoto() {
  if (!modal) return;
  // Don't allow closing while video is playing
  if (finalVideoLocked) return;
  if (finalVideo) finalVideo.pause();
  if (window.gsap && !deviceProfile.isMobile) {
    gsap.to('.modal-shell', { y: 30, opacity: 0, duration: 0.28, ease: 'power3.in', onComplete() { modal.classList.add('hidden'); } });
  } else {
    modal.classList.add('hidden');
  }
}

function lockFinalVideo() {
  if (!finalVideo) return;
  finalVideoLocked = true;
  finalVideoFinished = false;
  finalVideoLastTime = 0;
  finalVideo.controls = false;
  finalVideo.muted = false;
  finalVideo.volume = 1;
  finalVideo.currentTime = 0;
  activateFinalVideoBackLock();
}

function unlockFinalVideo() {
  finalVideoLocked = false;
  finalVideoFinished = true;
  releaseFinalVideoBackLock();
}

function activateFinalVideoBackLock() {
  if (finalVideoBackLockActive) return;
  finalVideoBackLockActive = true;
  history.pushState({ finalVideoLocked: true }, '', window.location.href);
}

function releaseFinalVideoBackLock() {
  finalVideoBackLockActive = false;
}

function keepFinalVideoPlaying() {
  if (!finalVideo || !finalVideoLocked || finalVideoFinished) return;
  if (finalVideo.ended) {
    unlockFinalVideo();
    return;
  }
  finalVideo.muted = false;
  finalVideo.volume = 1;
  finalVideo.play().catch(() => {});
}

function handleFinalVideoSeeking() {
  if (!finalVideo || !finalVideoLocked || finalVideoFinished) return;
  if (finalVideo.currentTime < finalVideoLastTime - 0.4) {
    finalVideo.currentTime = finalVideoLastTime;
  }
}

function handleFinalVideoTimeUpdate() {
  if (!finalVideo || !finalVideoLocked || finalVideoFinished) return;
  finalVideoLastTime = Math.max(finalVideoLastTime, finalVideo.currentTime);
  finalVideo.muted = false;
  finalVideo.volume = 1;
}

function handleBrowserBackDuringFinalVideo() {
  if (!finalVideoBackLockActive || finalVideoFinished) return;
  history.pushState({ finalVideoLocked: true }, '', window.location.href);
  keepFinalVideoPlaying();
}

function triggerConfettiBurst() {
  if (deviceProfile.lowEnd) return;
  try {
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 }, colors: ['#ffb4df', '#ffd37d', '#ff8fc3', '#ffffff'] });
  } catch (e) { }
}

function applyTilt(card) {
  if (!card) return;
  if (deviceProfile.lowEnd || deviceProfile.isMobile || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const originalTransform = card.style.transform || getComputedStyle(card).transform || '';
  let ticking = false;
  let lastX = 0, lastY = 0;
  const handleMove = (event) => {
    lastX = event.clientX;
    lastY = event.clientY;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = lastX - rect.left;
        const y = lastY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * -10;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
        ticking = false;
      });
    }
  };
  card.addEventListener('pointermove', handleMove, { passive: true });
  card.addEventListener('pointerleave', () => {
    card.style.transform = originalTransform;
  });
}

function mapPhotoItems() {
  document.querySelectorAll('.photo-card').forEach(card => {
    if (!deviceProfile.lowEnd) card.style.willChange = 'transform';
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
        const m = bg && bg.match(/url\((?:(?:"|')?)(.*?)(?:(?:"|')?)\)/);
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

function initHeroAnimations() {
  if (deviceProfile.lowEnd || deviceProfile.isMobile) {
    revealMainContent();
    return;
  }
  if (!window.gsap) return;
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.from('.intro-shell', { opacity: 0, scale: 0.98, duration: 0.8 }, 0)
    .from('.hero-copy .eyebrow', { y: 20, opacity: 0, duration: 0.55 }, 0.15)
    .from('.hero-copy h1', { y: 20, opacity: 0, duration: 0.8 }, 0.25)
    .from('.hero-copy p', { y: 20, opacity: 0, duration: 0.75 }, 0.35)
    .from('.hero-hexagon', { opacity: 0, y: 20, duration: 0.8 }, 0.45);

  gsap.to('.hero-hexagon', { rotation: 360, duration: 120, ease: 'none', repeat: -1 });
  gsap.fromTo('.photo-card', { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger: 0.04, delay: 0.6 });
}

function updateCarouselDepth() {
  if (deviceProfile.lowEnd || deviceProfile.isMobile) return;
  const cards = document.querySelectorAll('.carousel-track .moment-card');
  const centerX = window.innerWidth / 2;
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const distance = Math.min(Math.abs(cardCenter - centerX), centerX);
    const progress = 1 - distance / centerX;
    const scale = 0.88 + progress * 0.18;
    const zDepth = 10 + progress * 36;
    const opacity = 0.45 + progress * 0.55;
    const blur = (1 - progress) * 1.6;
    card.style.setProperty('--card-scale', scale.toString());
    card.style.setProperty('--card-z', `${zDepth}px`);
    card.style.setProperty('--card-opacity', opacity.toString());
    card.style.setProperty('--card-blur', `${blur}px`);
  });
}

function initCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return;

  const carouselSpeed = deviceProfile.isMobile ? 24 : 38;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  let step = track.querySelector('.moment-card')?.offsetWidth + gap;
  if (!step) return;

  let x = 0;
  let lastTime = performance.now();
  let animationId;
  let isVisible = true;
  let depthFrame = 0;
  let depthUpdateInterval = deviceProfile.isMobile ? 4 : 2;

  const updateStep = () => {
    const firstCard = track.querySelector('.moment-card');
    if (firstCard) {
      step = firstCard.offsetWidth + gap;
    }
  };

  const animate = (time) => {
    if (!isVisible || document.hidden) {
      animationId = requestAnimationFrame(animate);
      lastTime = time;
      return;
    }
    const delta = (time - lastTime) / 1000;
    lastTime = time;
    x -= delta * carouselSpeed;

    if (x <= -step) {
      x += step;
      track.appendChild(track.firstElementChild);
    }

    track.style.transform = `translateX(${x}px)`;
    if (!deviceProfile.lowEnd && !deviceProfile.isMobile && depthFrame++ % depthUpdateInterval === 0) updateCarouselDepth();
    animationId = requestAnimationFrame(animate);
  };

  const resizeObserver = new ResizeObserver(() => {
    updateStep();
  });
  resizeObserver.observe(track);

  const visibilityObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        isVisible = entries.some(entry => entry.isIntersecting);
      }, { rootMargin: '160px' })
    : null;

  if (visibilityObserver) visibilityObserver.observe(track);

  if (!deviceProfile.lowEnd) {
    if (animationId) cancelAnimationFrame(animationId);
    lastTime = performance.now();
    animationId = requestAnimationFrame(animate);
  } else {
    track.style.transform = 'translateX(0)';
  }
}

function initParallax() {
  // Parallax disabled for better scroll performance
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
  if (window.gsap && !deviceProfile.isMobile) gsap.fromTo('#popup .popup-content', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
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
  audio.preload = 'none';

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
    if (window.gsap && !deviceProfile.isMobile) {
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
    petal.innerHTML = `<img loading="lazy" src="${escapeHtml(memory.image)}" alt="${escapeHtml(memory.title || `Memory petal ${index + 1}`)}" />`;
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
    finalVideo.addEventListener('play', () => {
      const audio = document.querySelector('audio');
      if (audio) audio.pause();
      finalVideo.muted = false;
      finalVideo.volume = 1;
    });
    finalVideo.addEventListener('pause', keepFinalVideoPlaying);
    finalVideo.addEventListener('volumechange', () => {
      if (!finalVideoLocked || finalVideoFinished) return;
      finalVideo.muted = false;
      finalVideo.volume = 1;
    });
    finalVideo.addEventListener('seeking', handleFinalVideoSeeking);
    finalVideo.addEventListener('timeupdate', handleFinalVideoTimeUpdate);
    finalVideo.addEventListener('ended', () => {
      unlockFinalVideo();
      const audio = document.querySelector('audio');
      if (audio) audio.play();
    });
    window.addEventListener('popstate', handleBrowserBackDuringFinalVideo);
  }

  initHeroAnimations();
  setSectionObserver();
  initParallax();
  loadFolderPreviewImages()
    .then(() => {
      initCarousel();
      mapMomentCards();
    })
    .catch(() => {
      initCarousel();
      mapMomentCards();
    });

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
  initLightAnimations();

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
        img.loading = 'lazy';
        img.decoding = 'async';
        img.onload = () => {
          if (deviceProfile.lowEnd) {
            img.style.objectPosition = 'center';
            return;
          }
          const runFocus = () => adjustImageFocus(img);
          if ('requestIdleCallback' in window) {
            requestIdleCallback(runFocus, { timeout: 1200 });
          } else {
            setTimeout(runFocus, 80);
          }
        };
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
  const fragment = document.createDocumentFragment();
  memories.forEach(memory => {
    const resolvedSrc = memory.image ? memory.image : 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'1200\' height=\'800\'%3E%3Crect width=\'1200\' height=\'800\' fill=\'%23211f2a\'/%3E%3C/svg%3E';
    const card = document.createElement('div');
    card.className = 'memory-item visible';
    card.dataset.src = resolvedSrc;
    card.dataset.title = memory.title || 'Memory';
    card.dataset.caption = memory.message || 'A cherished moment captured';
    card.innerHTML = `
      <img loading="lazy" decoding="async" src="${escapeHtml(resolvedSrc)}" alt="${escapeHtml(memory.title)}" />
      <h3>${escapeHtml(memory.title)}</h3>
      <p>${escapeHtml(memory.message)}</p>
    `;
    card.addEventListener('click', () => {
      triggerConfettiBurst();
      openPhoto(card.dataset.title, card.dataset.caption, resolvedSrc);
    });
    fragment.appendChild(card);
  });
  container.appendChild(fragment);
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
  if (deviceProfile.lowEnd) {
    img.style.objectPosition = 'center';
    return;
  }
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

// ✨ Light Animations & Effects
function initLightAnimations() {
  if (deviceProfile.lowEnd) return;
  // Button ripple on click
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.button, .intro-skip');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,0.35);width:100px;height:100px;pointer-events:none;transform:scale(0);opacity:0.7;transition:transform 0.8s ease, opacity 0.8s ease;';
    ripple.style.left = (e.clientX - rect.left - 50) + 'px';
    ripple.style.top = (e.clientY - rect.top - 50) + 'px';
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(2.5)';
      ripple.style.opacity = '0';
    });
    setTimeout(() => ripple.remove(), 800);
  });
}

document.addEventListener('DOMContentLoaded', init);

console.log('🎬 Hexa Memory Box loaded');
