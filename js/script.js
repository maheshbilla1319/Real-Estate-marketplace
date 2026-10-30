
// ==========================================
// ESTATEAURA REAL ESTATE MARKETPLACE
// Navigation, AOS, Search, Filters and Forms
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

  // 2. HEADER SCROLL EFFECT
  const header = document.getElementById("header");

  function updateHeader() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 30);
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // 3. MOBILE NAVIGATION
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = '<i class="bi bi-list"></i>';
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("open");

      document.body.classList.toggle("menu-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));

      menuToggle.innerHTML = isOpen
        ? '<i class="bi bi-x-lg"></i>'
        : '<i class="bi bi-list"></i>';
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();

        navLinks.forEach(function (navLink) {
          navLink.classList.remove("active");
        });

        link.classList.add("active");
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }

  // 4. PROPERTY ELEMENTS
  const propertyGrid = document.getElementById("propertyGrid");
  const propertyCards = propertyGrid
    ? Array.from(propertyGrid.querySelectorAll(".property-card"))
    : [];

  const filterButtons = document.querySelectorAll(".filter-btn");
  const typeFilter = document.getElementById("typeFilter");
  const budgetFilter = document.getElementById("budgetFilter");
  const locationInput = document.getElementById("locationInput");
  const propertySearch = document.getElementById("propertySearch");
  const searchFeedback = document.getElementById("searchFeedback");
  const emptyState = document.getElementById("emptyState");
  const showAllBtn = document.getElementById("showAllBtn");

  let activeCategory = "all";
  let activeLocation = "";
  let activeBudget = "all";
  let activeType = "all";

  // Prices in the demo are measured in lakh rupees.
  // 100 lakh = 1 crore.
  function applyPropertyFilters() {
    let visibleCount = 0;

    propertyCards.forEach(function (card) {
      const cardType = card.dataset.type || "";
      const cardPrice = Number(card.dataset.price || 0);
      const cardLocation = (
        card.dataset.location || ""
      ).toLowerCase();

      const matchesCategory =
        activeCategory === "all" ||
        cardType === activeCategory;

      const matchesType =
        activeType === "all" ||
        cardType === activeType;

      const matchesLocation =
        !activeLocation ||
        cardLocation.includes(activeLocation);

      const matchesBudget =
        activeBudget === "all" ||
        cardPrice <= Number(activeBudget);

      const visible =
        matchesCategory &&
        matchesType &&
        matchesLocation &&
        matchesBudget;

      card.hidden = !visible;

      if (visible) {
        visibleCount++;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }

    if (searchFeedback) {
      searchFeedback.textContent =
        visibleCount + (visibleCount === 1
          ? " property found."
          : " properties found.");
    }

    if (showAllBtn) {
      showAllBtn.textContent =
        activeCategory === "all" &&
        activeType === "all" &&
        !activeLocation &&
        activeBudget === "all"
          ? "All demo listings displayed"
          : "Reset filters and show all";

      showAllBtn.disabled =
        activeCategory === "all" &&
        activeType === "all" &&
        !activeLocation &&
        activeBudget === "all";
    }

    if (typeof AOS !== "undefined") {
      AOS.refresh();
    }
  }

  // 5. PROPERTY CATEGORY BUTTONS
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeCategory = button.dataset.filter || "all";

      filterButtons.forEach(function (item) {
        item.classList.toggle("active", item === button);
      });

      if (typeFilter) {
        typeFilter.value = activeCategory;
        activeType = activeCategory;
      }

      applyPropertyFilters();
    });
  });

  // 6. SEARCH BY LOCATION, TYPE AND BUDGET
  if (propertySearch) {
    propertySearch.addEventListener("submit", function (event) {
      event.preventDefault();

      activeLocation = locationInput
        ? locationInput.value.trim().toLowerCase()
        : "";

      activeType = typeFilter ? typeFilter.value : "all";
      activeBudget = budgetFilter ? budgetFilter.value : "all";

      activeCategory = activeType;

      filterButtons.forEach(function (button) {
        button.classList.toggle(
          "active",
          button.dataset.filter === activeCategory
        );
      });

      applyPropertyFilters();

      const resultsSection = document.getElementById("properties");

      if (resultsSection) {
        resultsSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  }

  // 7. CATEGORY CARDS LINK TO MATCHING PROPERTIES
  document.querySelectorAll(".category-card").forEach(function (card) {
    card.addEventListener("click", function (event) {
      const category = card.dataset.category;

      if (!category) return;

      event.preventDefault();

      activeCategory = category;
      activeType = category;
      activeLocation = "";
      activeBudget = "all";

      if (typeFilter) typeFilter.value = category;
      if (budgetFilter) budgetFilter.value = "all";
      if (locationInput) locationInput.value = "";

      filterButtons.forEach(function (button) {
        button.classList.toggle(
          "active",
          button.dataset.filter === category
        );
      });

      applyPropertyFilters();

      const resultsSection = document.getElementById("properties");

      if (resultsSection) {
        resultsSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // 8. RESET ALL PROPERTY FILTERS
  if (showAllBtn) {
    showAllBtn.addEventListener("click", function () {
      activeCategory = "all";
      activeType = "all";
      activeBudget = "all";
      activeLocation = "";

      if (typeFilter) typeFilter.value = "all";
      if (budgetFilter) budgetFilter.value = "all";
      if (locationInput) locationInput.value = "";

      filterButtons.forEach(function (button) {
        button.classList.toggle(
          "active",
          button.dataset.filter === "all"
        );
      });

      applyPropertyFilters();
    });
  }

  // 9. PROPERTY FAVORITES
  const favoriteButtons = document.querySelectorAll(".favorite-btn");

  favoriteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const isFavorite = button.classList.toggle("is-favorite");

      button.setAttribute("aria-pressed", String(isFavorite));

      button.innerHTML = isFavorite
        ? '<i class="bi bi-heart-fill"></i>'
        : '<i class="bi bi-heart"></i>';

      button.setAttribute(
        "aria-label",
        isFavorite
          ? "Remove from favorites"
          : "Add to favorites"
      );
    });
  });

  // 10. ANIMATED STATISTICS
  const counters = document.querySelectorAll(".counter");

  function animateCounter(counter) {
    const target = Number(counter.dataset.target || 0);
    const duration = 1600;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      // Smooth ease-out animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(target * easedProgress);

      counter.textContent = value.toLocaleString("en-IN");

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString("en-IN");
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach(animateCounter);
  }

  // 11. TESTIMONIAL SLIDER
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const testimonialPrev = document.getElementById("testimonialPrev");
  const testimonialNext = document.getElementById("testimonialNext");
  const testimonialNumber = document.getElementById("testimonialNumber");

  let currentTestimonial = 0;

  function showTestimonial(index) {
    if (!testimonialCards.length) return;

    currentTestimonial =
      (index + testimonialCards.length) % testimonialCards.length;

    testimonialCards.forEach(function (card, cardIndex) {
      card.classList.toggle(
        "active",
        cardIndex === currentTestimonial
      );
    });

    if (testimonialNumber) {
      testimonialNumber.textContent = String(
        currentTestimonial + 1
      ).padStart(2, "0");
    }
  }

  if (testimonialPrev) {
    testimonialPrev.addEventListener("click", function () {
      showTestimonial(currentTestimonial - 1);
    });
  }

  if (testimonialNext) {
    testimonialNext.addEventListener("click", function () {
      showTestimonial(currentTestimonial + 1);
    });
  }

  showTestimonial(0);

  // 12. CONTACT FORM VALIDATION + 404 REDIRECT
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("contactName");
      const email = document.getElementById("contactEmail");
      const interest = document.getElementById("contactInterest");
      const message = document.getElementById("contactMessage");

      // Validate required fields
      if (
        !name ||
        !email ||
        !interest ||
        !message ||
        !name.value.trim() ||
        !email.validity.valid ||
        !interest.value ||
        !message.value.trim()
      ) {
        if (formMessage) {
          formMessage.textContent =
            "Please complete all required fields correctly.";
          formMessage.className = "form-message error";
        }

        // Focus the first invalid field
        if (name && !name.value.trim()) {
          name.focus();
        } else if (email && !email.validity.valid) {
          email.focus();
        } else if (interest && !interest.value) {
          interest.focus();
        } else if (message && !message.value.trim()) {
          message.focus();
        }

        return;
      }

      // Success message
      if (formMessage) {
        formMessage.textContent =
          "Validation successful! Redirecting...";
        formMessage.className = "form-message success";
      }

      // Redirect to 404.html
      window.location.href = "404.html";
    });
  }


  // 13. NEWSLETTER FORM VALIDATION + 404 REDIRECT
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


  // 14. CURRENT FOOTER YEAR
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  // 15. INITIAL PROPERTY STATE
  applyPropertyFilters();

});
