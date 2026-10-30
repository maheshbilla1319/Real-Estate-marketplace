
// ==========================================
// ESTATEAURA SERVICES PAGE JAVASCRIPT
// Mobile Navigation Toggle | AOS | Newsletter
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

  // 1. AOS SCROLL ANIMATIONS
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 65,
      disable: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    });
  }

  // 2. MOBILE NAVIGATION TOGGLE
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".main-nav .nav-link");

  function openMenu() {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.add("open");
    document.body.classList.add("menu-open");

    menuToggle.classList.add("active");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
    menuToggle.innerHTML = '<i class="bi bi-x-lg"></i>';
  }

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");

    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.innerHTML = '<i class="bi bi-list"></i>';
  }

  // Toggle OPEN and CLOSE on every click
  if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", function (event) {
      event.stopPropagation();

      if (mainNav.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu after clicking navigation links
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    // Close menu with Escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Close menu when resizing to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }

  // 3. STICKY HEADER SHADOW
  function updateHeader() {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 20);
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  // 4. AUTOMATIC COPYRIGHT YEAR
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // 5. NEWSLETTER VALIDATION + 404 REDIRECT
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterMessage =
    document.getElementById("newsletterMessage");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const emailInput =
        document.getElementById("newsletterEmail");

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

      if (newsletterMessage) {
        newsletterMessage.textContent =
          "Subscription validated! Redirecting...";
        newsletterMessage.className = "form-message success";
      }

      window.location.href = "404.html";
    });
  }

  // 6. SMOOTH SCROLLING
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();
        closeMenu();

        target.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });

  // 7. REFRESH AOS AFTER IMAGES LOAD
  document.querySelectorAll("img").forEach(function (img) {
    if (img.complete) return;

    img.addEventListener("load", function () {
      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
    }, { once: true });
  });

});
