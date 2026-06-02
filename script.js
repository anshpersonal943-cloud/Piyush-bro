const modal = document.getElementById('photoModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalPhoto = document.querySelector('.modal-photo');
const modalTitle = document.getElementById('modalTitle');
const modalCaption = document.getElementById('modalCaption');
const openFinal = document.getElementById('openFinal');

function openPhoto(title, caption, src) {
  modal.classList.remove('hidden');
  modalPhoto.style.backgroundImage = `url('${src}')`;
  modalTitle.textContent = title;
  modalCaption.textContent = caption;
  gsap.fromTo('.modal-shell', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
}

function closePhoto() {
  gsap.to('.modal-shell', {
    y: 30,
    opacity: 0,
    duration: 0.3,
    ease: 'power3.in',
    onComplete() {
      modal.classList.add('hidden');
    }
  });
}

function triggerConfettiBurst() {
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ffb4df', '#ffd37d', '#ff8fc3', '#ffffff']
  });
}

function applyTilt(card) {
  card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * -10;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
}

function setSectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.section').forEach(section => observer.observe(section));
}

function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('.hero-copy h1', { y: 60, opacity: 0, duration: 1.1 })
    .from('.hero-copy p', { y: 40, opacity: 0, duration: 1 }, '-=0.75')
    .from('.hero-actions a', { y: 30, opacity: 0, stagger: 0.12, duration: 0.8 }, '-=0.9')
    .from('.hex-content', { scale: 0.8, opacity: 0, duration: 1.1 }, '-=1.1')
    .from('.photo-card', { opacity: 0, y: 40, stagger: 0.12, duration: 0.8 }, '-=0.9');

  gsap.to('.hero-hexagon', {
    rotation: 360,
    duration: 45,
    ease: 'none',
    repeat: -1
  });
}

function initParallax() {
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    document.querySelector('.background-layer').style.transform = `translateY(${scroll * 0.02}px)`;
    document.querySelector('.bokeh-layer').style.transform = `translateY(${scroll * -0.03}px)`;
  });
}

function mapPhotoItems() {
  document.querySelectorAll('.photo-card, .photo-frame').forEach(card => {
    const title = card.dataset.title;
    const caption = card.dataset.caption;
    const src = card.dataset.src;

    card.addEventListener('click', () => openPhoto(title, caption, src));
    applyTilt(card);
  });
}

function initFinalButton() {
  openFinal?.addEventListener('click', () => {
    triggerConfettiBurst();
    openPhoto('Last Memory', 'A cinematic finish with a glowing heart and soft closure.', 'photo6.jpg');
  });
}

function initAudioAutoplay() {
  const audio = document.querySelector('audio');
  if (audio) {
    audio.volume = 0.6;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // user gesture required; ignore silently
      });
    }
  }
}

function init() {
  if (!window.gsap) {
    setTimeout(init, 100);
    return;
  }

  initHeroAnimations();
  setSectionObserver();
  initParallax();
  mapPhotoItems();
  initFinalButton();
  initAudioAutoplay();

  modalBackdrop.addEventListener('click', closePhoto);
  modalClose.addEventListener('click', closePhoto);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePhoto();
  });

  document.querySelectorAll('.section, .photo-card, .photo-frame, .moment-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
  });

  gsap.to('.section, .photo-card, .photo-frame, .moment-card', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.08
  });
}

window.addEventListener('load', init);
