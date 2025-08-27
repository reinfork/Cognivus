const tabStudent = document.getElementById('tab-student');
const tabLecture = document.getElementById('tab-lecture');
const formContainer = document.getElementById('form-container');

const studentView = `
<div class="text-center">
  <p class="text-gray-600 text-sm mb-4">Login dengan akun Google Anda.</p>
  <button type="button" class="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center w-full">
    <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.24 10.29C12.24 9.61 12.19 9.07 12.07 8.59H12V8.57H12.07C12.07 8.57 16.51 8.35 16.63 8.36C16.89 8.39 17.15 8.44 17.39 8.52C17.65 8.61 17.9 8.7 18.15 8.81L21.37 5.56L21.36 5.56L21.36 5.55C19.12 3.42 16.09 2.16 12.24 2.16C7.03 2.16 2.47 5.76 2.47 12C2.47 18.24 7.03 21.84 12.24 21.84C15.93 21.84 18.99 20.29 21.05 18.39L17.52 15.65C16.4 16.59 14.6 17.22 12.24 17.22C9.07 17.22 6.45 14.73 6.45 12C6.45 9.27 9.07 6.78 12.24 6.78C13.88 6.78 15.15 7.42 15.92 8.16C16.61 8.81 17.06 9.54 17.18 10.29H12.24V10.29ZM2.47 12V12ZM12.24 2.16C16.09 2.16 19.12 3.42 21.36 5.55L18.15 8.81C17.9 8.7 17.65 8.61 17.39 8.52C17.15 8.44 16.89 8.39 16.63 8.36C16.51 8.35 12.24 8.57 12.24 8.57C9.07 8.57 6.45 11.06 6.45 13.79C6.45 16.52 9.07 19.01 12.24 19.01C14.6 19.01 16.4 18.38 17.52 17.44L21.05 20.18C18.99 22.08 15.93 23.63 12.24 23.63C7.03 23.63 2.47 20.03 2.47 13.79C2.47 7.55 7.03 3.95 12.24 3.95Z" fill="#FFF"/>
    </svg>
    
    <span>Sign in with Google</span>
  </button>
</div>
`;

const lectureView = `
  <div class="space-y-4">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
      <input type="email" id="email" placeholder="you@example.com" class="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
      <input type="password" id="password" placeholder="••••••••" class="text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
    </div>
      <button type="button" class="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center w-full">
      Login
    </button>
  </div>
`;

function setActiveTab(activeButton, inactiveButton) {
  activeButton.classList.remove('text-gray-600', 'hover:text-gray-800');
  activeButton.classList.add('text-blue-700', 'bg-blue-100');

  inactiveButton.classList.remove('text-blue-700', 'bg-blue-100');
  inactiveButton.classList.add('text-gray-600', 'hover:text-gray-800');
}

function renderWithAnimation(html) {
  formContainer.classList.add('opacity-0', '-translate-y-4');
  setTimeout(() => {
    formContainer.innerHTML = html;
    formContainer.classList.remove('opacity-0', '-translate-y-4');
  }, 150);
}

tabStudent.addEventListener('click', () => {
  setActiveTab(tabStudent, tabLecture);
  renderWithAnimation(studentView);
});

tabLecture.addEventListener('click', () => {
  setActiveTab(tabLecture, tabStudent);
  renderWithAnimation(lectureView);
});
document.addEventListener('DOMContentLoaded', () => {
  setActiveTab(tabStudent, tabLecture);
  formContainer.innerHTML = studentView;
});