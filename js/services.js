
// ==========================================
// ESTATEAURA SERVICES PAGE JAVASCRIPT
// Mobile navigation, AOS and newsletter demo
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  // 1. AOS scroll animations
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

  // 2. Header and mobile navigation
  const header = document.getElementById("header");
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
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", function (event) {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }

  // 3. Sticky header shadow
  function updateHeader() {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 20);
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  // 4. Update copyright year automatically
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
  // 6. Smooth scrolling for same-page links
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

  // 7. Refresh AOS after images load
  document.querySelectorAll("img").forEach(function (img) {
    if (img.complete) return;

    img.addEventListener("load", function () {
      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
    }, { once: true });
  });
});
