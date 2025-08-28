const formContainer = document.getElementById('form-container');

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