// Welcome Screen / Preloader Intro Logic
(function () {
  const welcomeScreen = document.getElementById('welcome-screen');
  const typewriterBadge = document.getElementById('welcome-typewriter-text');
  if (!welcomeScreen) return;

  // On mobile devices (<= 768px), dismiss immediately so the user lands straight on the Hero view
  if (window.innerWidth <= 768) {
    welcomeScreen.style.display = 'none';
    return;
  }

  const urlText = 'septianghozi.dev';
  let charIdx = 0;

  function typeUrl() {
    if (charIdx <= urlText.length) {
      if (typewriterBadge) {
        typewriterBadge.textContent = urlText.slice(0, charIdx);
      }
      charIdx++;
      setTimeout(typeUrl, 160);
    }
  }
  setTimeout(typeUrl, 600);

  // Auto dismiss after 3.2s or immediately on click
  function dismissWelcome() {
    if (welcomeScreen.classList.contains('fade-out')) return;
    welcomeScreen.classList.add('fade-out');
    setTimeout(() => {
      welcomeScreen.style.display = 'none';
    }, 850);
  }

  // Dismiss on click or keypress
  welcomeScreen.addEventListener('click', dismissWelcome);
  window.addEventListener('keydown', dismissWelcome);

  // Auto transition after entrance
  setTimeout(dismissWelcome, 3200);
})();
