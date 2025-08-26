// ========== Tabs + sliding animation between Student and Lecture ==========
const tabs = document.querySelectorAll('.tab');
const forms = {
  student: document.getElementById('form-student'),
  lecture: document.getElementById('form-lecture')
};

const tabsEl = document.querySelector('.tabs');
const formsContainer = document.getElementById('forms');
const track = document.getElementById('forms-track');

// ===== Photo card helpers =====
const photo = document.getElementById('photo-card');
const loginCard = document.querySelector('.auth-layout .card');

function syncPhotoHeight() {
  if (!photo || !loginCard) return;
  photo.style.height = loginCard.offsetHeight + 'px';
}

function setPhotoBackground() {
  if (!photo) return;
  const images = [
    'assets/freakydiamond.png',

  ];
  const pick = images[Math.floor(Math.random() * images.length)];
  photo.style.setProperty('--photo-url', `url("${pick}")`);
}

function setActive(id) {
  // Update aria & active state
  tabs.forEach(t => {
    const isActive = t.dataset.tab === id;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Move slider indicator
  tabsEl.dataset.active = id;

  // Slide forms track
  track.style.transform = (id === 'student') ? 'translateX(0%)' : 'translateX(-50%)';

  // Auto-adjust container height to match current form
  const targetForm = forms[id];
  const targetHeight = targetForm.offsetHeight;
  formsContainer.style.height = targetHeight + 'px';

  // After animation tick, sync photo height (let layout settle)
  setTimeout(syncPhotoHeight, 360);
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  setPhotoBackground();
  setActive('student'); // initial
  tabs.forEach(btn => btn.addEventListener('click', () => setActive(btn.dataset.tab)));
  window.addEventListener('resize', () => {
    const current = [...tabs].find(t => t.getAttribute('aria-selected') === 'true')?.dataset.tab || 'student';
    setActive(current);
    syncPhotoHeight();
  });
  // First sync after initial layout
  syncPhotoHeight();
});
