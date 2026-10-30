
// ==========================================
// ESTATEAURA 404 PAGE JAVASCRIPT
// AOS | Mobile Navigation | Header | Footer
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  // 1. AOS SCROLL ANIMATIONS
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      once: true,
      offset: 65,
      disable: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    });
  }

  // 2. MOBILE NAVIGATION
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.innerHTML = '<i class="bi bi-list"></i>';
  }

  function openMenu() {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.add("open");
    document.body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
    menuToggle.innerHTML = '<i class="bi bi-x-lg"></i>';
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      if (mainNav.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when a navigation link is clicked
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
      const clickedInside = mainNav.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (
        mainNav.classList.contains("open") &&
        !clickedInside &&
        !clickedToggle
      ) {
        closeMenu();
      }
    });

    // Close menu with Escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Close mobile menu on desktop resize
    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }

  // 3. STICKY HEADER
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

  // 4. DYNAMIC FOOTER YEAR
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // 5. SMOOTH SCROLL FOR INTERNAL LINKS
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });

  // 6. REFRESH AOS WHEN THE BACKGROUND IMAGES LOAD
  const images = document.querySelectorAll(".error-background");

  images.forEach(function (element) {
    const backgroundImage = getComputedStyle(element).backgroundImage;
    const imageUrl = backgroundImage.match(/url\(["']?(.*?)["']?\)/);

    if (imageUrl && imageUrl[1]) {
      const image = new Image();

      image.onload = function () {
        if (typeof AOS !== "undefined") {
          AOS.refresh();
        }
      };

      image.src = imageUrl[1];
    }
  });
});
