
// ==========================================
// ESTATEAURA ABOUT PAGE JAVASCRIPT
// Navigation, AOS and Newsletter Validation
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

  // 1. INITIALIZE AOS SCROLL ANIMATIONS
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      once: true,
      offset: 65,
      delay: 0,
      disable: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    });
  }

  // 2. HEADER SCROLL SHADOW
  const header = document.getElementById("header");

  function updateHeader() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 30);
    }
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  // 3. MOBILE NAVIGATION
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".main-nav .nav-link");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.innerHTML = '<i class="bi bi-list"></i>';
  }

  if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("open");

      document.body.classList.toggle("menu-open", isOpen);

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      menuToggle.innerHTML = isOpen
        ? '<i class="bi bi-x-lg"></i>'
        : '<i class="bi bi-list"></i>';
    });

    // Close navigation after clicking a link
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    // Close navigation with Escape
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Reset navigation when returning to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }

  // 4. FOOTER CURRENT YEAR
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  // 5. NEWSLETTER FORM VALIDATION + 404 REDIRECT
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterMessage =
    document.getElementById("newsletterMessage");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const emailInput =
        document.getElementById("newsletterEmail");

      // Validate email
      if (
        !emailInput ||
        !emailInput.value.trim() ||
        !emailInput.validity.valid
      ) {
        if (newsletterMessage) {
          newsletterMessage.textContent =
            "Please enter a valid email address.";
          newsletterMessage.className = "form-message error";
        }

        if (emailInput) {
          emailInput.focus();
        }

        return;
      }

      // Success message
      if (newsletterMessage) {
        newsletterMessage.textContent =
          "Subscription validated! Redirecting...";
        newsletterMessage.className = "form-message success";
      }

      // Redirect to 404.html
      window.location.href = "404.html";
    });
  }
  // 6. REFRESH AOS AFTER IMAGES LOAD
  const images = document.querySelectorAll(
    ".about-hero-image, .story-visual img, .team-image img"
  );

  images.forEach(function (img) {
    if (img instanceof HTMLImageElement && !img.complete) {
      img.addEventListener("load", function () {
        if (typeof AOS !== "undefined") {
          AOS.refresh();
        }
      }, { once: true });
    }
  });

});
