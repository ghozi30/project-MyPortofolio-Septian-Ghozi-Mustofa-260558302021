// Background interactive ambient effects & subtle starfield
(function () {
  const canvas = document.getElementById('background-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const stars = [];
  const STAR_COUNT = 90;

  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.6 + 0.4;
      this.baseAlpha = Math.random() * 0.6 + 0.2;
      this.alpha = this.baseAlpha;
      this.speedY = Math.random() * 0.15 + 0.05;
      this.speedX = (Math.random() - 0.5) * 0.1;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinkleFactor = Math.random() * Math.PI;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.twinkleFactor += this.twinkleSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.twinkleFactor) * 0.25;

      if (this.y < 0) this.y = height;
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(199, 210, 254, ${Math.max(0, this.alpha)})`;
      ctx.shadowBlur = this.size * 2;
      ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
  }

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();

  // Ambient blobs dynamic mouse & scroll interaction (inspired by EkiZR Portofolio_V5)
  const blobs = document.querySelectorAll('.ambient-blob');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let targetX = mouseX;
  let targetY = mouseY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    blobs.forEach((blob, index) => {
      const offset = (index + 1) * 0.12;
      const xSin = Math.sin(scrollY / 180 + index) * 60;
      const yCos = Math.cos(scrollY / 180 + index) * 40;
      blob.style.transform = `translate(${xSin}px, ${yCos}px)`;
    });
  });
})();
