
/* =========================================
   ESTATEAURA CONTACT PAGE JAVASCRIPT
   AOS | Mobile Menu | Sticky Header
   Contact Validation | Newsletter Validation
   404 Redirect
========================================= */

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


  // 2. MOBILE NAVIGATION
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(
    ".main-nav .nav-link"
  );

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute(
      "aria-label",
      "Open navigation"
    );

    menuToggle.innerHTML =
      '<i class="bi bi-list" aria-hidden="true"></i>';
  }

  function openMenu() {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.add("open");
    document.body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute(
      "aria-label",
      "Close navigation"
    );

    menuToggle.innerHTML =
      '<i class="bi bi-x-lg" aria-hidden="true"></i>';
  }

  if (menuToggle && mainNav) {

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", function () {
      if (mainNav.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu after clicking a navigation link
    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
      const clickedInsideNav =
        mainNav.contains(event.target);

      const clickedToggle =
        menuToggle.contains(event.target);

      if (
        mainNav.classList.contains("open") &&
        !clickedInsideNav &&
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

    // Reset menu on desktop screen
    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }


  // 3. STICKY HEADER EFFECT
  function updateHeader() {
    if (header) {
      header.classList.toggle(
        "scrolled",
        window.scrollY > 30
      );
    }
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });


  // 4. CURRENT FOOTER YEAR
  const currentYear =
    document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  // 5. CONTACT FORM VALIDATION + 404 REDIRECT
  const contactForm =
    document.getElementById("contactForm");

  const formMessage =
    document.getElementById("formMessage");

  if (contactForm) {

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name =
        document.getElementById("contactName");

      const email =
        document.getElementById("contactEmail");

      const interest =
        document.getElementById("contactInterest");

      const message =
        document.getElementById("contactMessage");

      // Check required elements exist
      if (!name || !email || !interest || !message) {
        if (formMessage) {
          formMessage.textContent =
            "Form configuration error. Please try again.";

          formMessage.className =
            "form-message error";
        }

        return;
      }

      // Validate name
      if (!name.value.trim()) {
        if (formMessage) {
          formMessage.textContent =
            "Please enter your full name.";

          formMessage.className =
            "form-message error";
        }

        name.focus();
        return;
      }

      // Validate email
      if (
        !email.value.trim() ||
        !email.validity.valid
      ) {
        if (formMessage) {
          formMessage.textContent =
            "Please enter a valid email address.";

          formMessage.className =
            "form-message error";
        }

        email.focus();
        return;
      }

      // Validate interest
      if (!interest.value) {
        if (formMessage) {
          formMessage.textContent =
            "Please select your area of interest.";

          formMessage.className =
            "form-message error";
        }

        interest.focus();
        return;
      }

      // Validate message
      if (!message.value.trim()) {
        if (formMessage) {
          formMessage.textContent =
            "Please enter your message.";

          formMessage.className =
            "form-message error";
        }

        message.focus();
        return;
      }

      // All validations passed
      if (formMessage) {
        formMessage.textContent =
          "Details validated successfully! Redirecting...";

        formMessage.className =
          "form-message success";
      }

      // Redirect to 404 page
      window.location.href = "404.html";
    });
  }


  // 6. NEWSLETTER VALIDATION + 404 REDIRECT
  const newsletterForm =
    document.getElementById("newsletterForm");

  const newsletterMessage =
    document.getElementById("newsletterMessage");

  if (newsletterForm) {

    newsletterForm.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        const emailInput =
          document.getElementById("newsletterEmail");

        // Check newsletter email field
        if (!emailInput) {
          if (newsletterMessage) {
            newsletterMessage.textContent =
              "Newsletter email field not found.";

            newsletterMessage.className =
              "form-message error";
          }

          return;
        }

        // Validate newsletter email
        if (
          !emailInput.value.trim() ||
          !emailInput.validity.valid
        ) {
          if (newsletterMessage) {
            newsletterMessage.textContent =
              "Please enter a valid email address.";

            newsletterMessage.className =
              "form-message error";
          }

          emailInput.focus();
          return;
        }

        // Validation successful
        if (newsletterMessage) {
          newsletterMessage.textContent =
            "Email validated successfully! Redirecting...";

          newsletterMessage.className =
            "form-message success";
        }

        // Redirect to 404 page
        window.location.href = "404.html";
      }
    );
  }

});
