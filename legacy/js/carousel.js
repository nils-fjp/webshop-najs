// =============================================
// CAROUSEL.JS - Image Carousel/Slideshow
// =============================================

class Carousel {
    constructor(selector, options = {}) {
        this.container = document.querySelector(selector);
        if (!this.container) {
            return;
        }

        this.config = {
            autoPlay: options.autoPlay !== false,
            interval: options.interval || 5000,
            transitionSpeed: options.transitionSpeed || 500,
            pauseOnHover: options.pauseOnHover !== false,
        };

        this.currentSlide = 0;
        this.slides = [];
        this.isPlaying = false;
        this.timer = null;

        this.init();
    }

    init() {
        this.slides = Array.from(this.container.querySelectorAll(".news-page"));

        if (this.slides.length === 0) {
            return;
        }

        this.setupSlides();
        this.createControls();
        this.setupEventListeners();

        if (this.config.autoPlay) {
            this.play();
        }
    }

    setupSlides() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle("active", index === 0);
        });
    }

    createControls() {
        const prevButton = document.createElement("button");
        prevButton.className = "carousel-arrow carousel-arrow-left";
        prevButton.type = "button";
        prevButton.setAttribute("aria-label", "Previous slide");
        prevButton.textContent = "<";

        const nextButton = document.createElement("button");
        nextButton.className = "carousel-arrow carousel-arrow-right";
        nextButton.type = "button";
        nextButton.setAttribute("aria-label", "Next slide");
        nextButton.textContent = ">";

        this.container.appendChild(prevButton);
        this.container.appendChild(nextButton);
        this.prevButton = prevButton;
        this.nextButton = nextButton;

        const indicatorsDiv = document.createElement("div");
        indicatorsDiv.className = "carousel-indicators";

        this.slides.forEach((_, index) => {
            const indicator = document.createElement("span");
            indicator.className = "carousel-indicator";
            if (index === 0) indicator.classList.add("active");
            indicator.dataset.slide = index;
            indicatorsDiv.appendChild(indicator);
        });

        this.container.appendChild(indicatorsDiv);
        this.indicators = indicatorsDiv.querySelectorAll(".carousel-indicator");
    }

    setupEventListeners() {
        if (this.prevButton && this.nextButton) {
            this.prevButton.addEventListener("click", () => this.previous());
            this.nextButton.addEventListener("click", () => this.next());
        }

        this.indicators.forEach((indicator) => {
            indicator.addEventListener("click", () => {
                const slideIndex = parseInt(indicator.dataset.slide);
                this.goToSlide(slideIndex);
            });
        });

        if (this.config.pauseOnHover) {
            this.container.addEventListener("mouseenter", () => this.pause());
            this.container.addEventListener("mouseleave", () => this.play());
        }

        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") this.previous();
            if (e.key === "ArrowRight") this.next();
        });

        // CTA buttons filter products by category and scroll down
        this.container.addEventListener("click", (e) => {
            const cta = e.target.closest(".carousel-cta[data-category]");
            if (!cta || !window.CategoryManager) return;

            e.preventDefault();
            const category = cta.dataset.category;
            window.CategoryManager.filterByCategory(category);
            window.CategoryManager.setActiveLinksByCategory(category);
            window.CategoryManager.scrollToProducts();
        });
    }

    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        const currentSlide = this.slides[this.currentSlide];
        const nextSlide = this.slides[index];

        currentSlide.classList.remove("active");
        nextSlide.classList.add("active");

        this.indicators[this.currentSlide].classList.remove("active");
        this.indicators[index].classList.add("active");

        this.currentSlide = index;
    }

    next() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    previous() {
        const prevIndex =
            (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    play() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.timer = setInterval(() => {
            this.next();
        }, this.config.interval);
    }

    pause() {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    stop() {
        this.pause();
        this.goToSlide(0);
    }
}

// =============================================
// INITIALIZE CAROUSEL
// =============================================

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        window.Carousel = new Carousel("#news-pages", {
            autoPlay: true,
            interval: 5000,
            pauseOnHover: true,
        });
    });
} else {
    window.Carousel = new Carousel("#news-pages", {
        autoPlay: true,
        interval: 5000,
        pauseOnHover: true,
    });
}
