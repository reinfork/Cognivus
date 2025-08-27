const tabs = document.querySelectorAll('.tab');
const forms = {
  student: document.getElementById('form-student'),
  lecture: document.getElementById('form-lecture')
};

const tabsEl = document.querySelector('.tabs');
const formsContainer = document.getElementById('forms');
const track = document.getElementById('forms-track');

// ===== bagian Photo card=====
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

// Animasi di formnya dari student sama lecturer pindah
function setActive(id) {
  tabs.forEach(t => {
    const isActive = t.dataset.tab === id;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  tabsEl.dataset.active = id;
  track.style.transform = (id === 'student') ? 'translateX(0%)' : 'translateX(-50%)';
  const targetForm = forms[id];
  const targetHeight = targetForm.offsetHeight;
  formsContainer.style.height = targetHeight + 'px';
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
  syncPhotoHeight();
});
