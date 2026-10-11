/**
 * Vanilla JavaScript Image Slider Library
 */
class ImageSlider {
  constructor() {
    this.track = document.getElementById('sliderTrack');
    this.slides = document.querySelectorAll('.slide');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.dotsContainer = document.getElementById('dotsContainer');
    
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.isAnimating = false;
    this.autoPlayInterval = null;

    this.init();
  }

  init() {
    this.createDots();
    this.updateSlider();
    this.bindEvents();
    this.startAutoPlay();
  }

  createDots() {
    this.dotsContainer.innerHTML = '';
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
  }

  updateSlider() {
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;
    this.updateDots();
  }

  updateDots() {
    const dots = this.dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  goToSlide(index) {
    if (this.isAnimating || index === this.currentIndex) return;
    this.isAnimating = true;
    this.currentIndex = index;
    this.updateSlider();
    setTimeout(() => { this.isAnimating = false; }, 500);
  }

  nextSlide() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.currentIndex = (this.currentIndex === this.totalSlides - 1) ? 0 : this.currentIndex + 1;
    this.updateSlider();
    setTimeout(() => { this.isAnimating = false; }, 500);
  }

  prevSlide() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.currentIndex = (this.currentIndex === 0) ? this.totalSlides - 1 : this.currentIndex - 1;
    this.updateSlider();
    setTimeout(() => { this.isAnimating = false; }, 500);
  }

  bindEvents() {
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    this.prevBtn.addEventListener('click', () => this.prevSlide());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') this.nextSlide();
      if (e.key === 'ArrowLeft') this.prevSlide();
    });

    let touchStartX = 0;
    this.track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.nextSlide() : this.prevSlide();
      }
    }, { passive: true });
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 3000);
    const wrapper = document.querySelector('.slider-wrapper');
    wrapper.addEventListener('mouseenter', () => clearInterval(this.autoPlayInterval));
    wrapper.addEventListener('mouseleave', () => this.startAutoPlay());
  }
}

document.addEventListener('DOMContentLoaded', () => new ImageSlider());