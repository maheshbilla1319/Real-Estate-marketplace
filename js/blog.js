
/* =========================================
   ESTATEAURA BLOG PAGE JAVASCRIPT
   AOS | Mobile Menu | Blog Search
   Category Filters | Sorting | Newsletter
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

  // 1. AOS SCROLL ANIMATIONS
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

  // 2. STICKY HEADER
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

  function openMenu() {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.add("open");
    document.body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
    menuToggle.innerHTML = '<i class="bi bi-x-lg"></i>';
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

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
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

    // Close menu with Escape
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Close menu on desktop screens
    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }

  // 4. FOOTER YEAR
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // 5. BLOG SEARCH AND CATEGORY FILTERS
  const blogGrid = document.getElementById("blogGrid");
  const blogSearchForm = document.getElementById("blogSearchForm");
  const blogSearchInput = document.getElementById("blogSearchInput");
  const blogCategoryFilter = document.getElementById("blogCategoryFilter");
  const blogSort = document.getElementById("blogSort");
  const blogFeedback = document.getElementById("blogFeedback");
  const blogEmptyState = document.getElementById("blogEmptyState");
  const blogFilterButtons = document.querySelectorAll(".blog-filter-btn");
  const blogCategoryCards = document.querySelectorAll(".blog-category-card");
  const showAllBlogsBtn = document.getElementById("showAllBlogsBtn");

  if (blogGrid) {
    const blogCards = Array.from(
      blogGrid.querySelectorAll(".blog-card")
    );

    const originalOrder = new Map(
      blogCards.map(function (card, index) {
        return [card, index];
      })
    );

    let searchQuery = "";
    let activeCategory = "all";
    let sortMode = "default";

    function updateBlogFilterButtons() {
      blogFilterButtons.forEach(function (button) {
        const isActive =
          (button.dataset.filter || "all") === activeCategory;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    }

    function applyBlogFilters() {
      let visibleCount = 0;

      const query = searchQuery.trim().toLowerCase();

      blogCards.forEach(function (card) {
        const title = card.querySelector(".blog-title");
        const description = card.querySelector(".blog-excerpt");
        const category = card.dataset.category || "";

        const searchableText = [
          card.dataset.title || "",
          title ? title.textContent : "",
          description ? description.textContent : "",
          category,
          card.dataset.tags || ""
        ].join(" ").toLowerCase();

        const matchesSearch =
          !query || searchableText.includes(query);

        const matchesCategory =
          activeCategory === "all" ||
          category === activeCategory;

        const isVisible = matchesSearch && matchesCategory;

        card.hidden = !isVisible;

        if (isVisible) {
          visibleCount++;
        }
      });

      if (blogEmptyState) {
        blogEmptyState.hidden = visibleCount !== 0;
      }

      if (blogFeedback) {
        blogFeedback.textContent = visibleCount === 0
          ? "No matching blog posts found. Try another search."
          : visibleCount + (
              visibleCount === 1
                ? " blog post found."
                : " blog posts found."
            );
      }

      updateBlogFilterButtons();
    }

    function sortBlogCards() {
      const sortedCards = [...blogCards];

      if (sortMode === "title-asc") {
        sortedCards.sort(function (a, b) {
          const titleA = (
            a.querySelector(".blog-title")?.textContent || ""
          ).trim();

          const titleB = (
            b.querySelector(".blog-title")?.textContent || ""
          ).trim();

          return titleA.localeCompare(titleB);
        });
      } else if (sortMode === "title-desc") {
        sortedCards.sort(function (a, b) {
          const titleA = (
            a.querySelector(".blog-title")?.textContent || ""
          ).trim();

          const titleB = (
            b.querySelector(".blog-title")?.textContent || ""
          ).trim();

          return titleB.localeCompare(titleA);
        });
      } else if (sortMode === "newest") {
        sortedCards.sort(function (a, b) {
          return (
            Date.parse(b.dataset.date || "") -
            Date.parse(a.dataset.date || "")
          );
        });
      } else {
        sortedCards.sort(function (a, b) {
          return originalOrder.get(a) - originalOrder.get(b);
        });
      }

      sortedCards.forEach(function (card) {
        blogGrid.appendChild(card);
      });

      applyBlogFilters();
    }

    // Blog search form
    if (blogSearchForm) {
      blogSearchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        searchQuery = blogSearchInput
          ? blogSearchInput.value.trim()
          : "";

        activeCategory = blogCategoryFilter
          ? blogCategoryFilter.value
          : activeCategory;

        sortBlogCards();

        const blogSection = document.getElementById("allBlogs");

        if (blogSection) {
          blogSection.scrollIntoView({
            behavior: window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth",
            block: "start"
          });
        }
      });
    }

    // Category filter buttons
    blogFilterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeCategory = button.dataset.filter || "all";

        if (blogCategoryFilter) {
          blogCategoryFilter.value = activeCategory;
        }

        sortBlogCards();
      });
    });

    // Category cards
    blogCategoryCards.forEach(function (card) {
      card.addEventListener("click", function () {
        activeCategory = card.dataset.category || "all";
        searchQuery = "";

        if (blogSearchInput) {
          blogSearchInput.value = "";
        }

        if (blogCategoryFilter) {
          blogCategoryFilter.value = activeCategory;
        }

        sortBlogCards();

        const blogSection = document.getElementById("allBlogs");

        if (blogSection) {
          blogSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    });

    // Sort blog posts
    if (blogSort) {
      blogSort.addEventListener("change", function () {
        sortMode = blogSort.value;
        sortBlogCards();
      });
    }

    // Reset all blog filters
    function resetBlogFilters() {
      searchQuery = "";
      activeCategory = "all";
      sortMode = "default";

      if (blogSearchInput) {
        blogSearchInput.value = "";
      }

      if (blogCategoryFilter) {
        blogCategoryFilter.value = "all";
      }

      if (blogSort) {
        blogSort.value = "default";
      }

      sortBlogCards();
    }

    if (showAllBlogsBtn) {
      showAllBlogsBtn.addEventListener(
        "click",
        resetBlogFilters
      );
    }

    // Initial blog display
    applyBlogFilters();
  }

  // 6. NEWSLETTER VALIDATION + 404 REDIRECT
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterMessage = document.getElementById("newsletterMessage");

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

          newsletterMessage.className =
            "form-message error";
        }

        if (emailInput) {
          emailInput.focus();
        }

        return;
      }

      if (newsletterMessage) {
        newsletterMessage.textContent =
          "Email validated successfully! Redirecting...";

        newsletterMessage.className =
          "form-message success";
      }

      window.location.href = "404.html";
    });
  }

  // 7. BLOG CARD LINKS
  // Links with href="404.html" work normally.
  // No extra click handler is needed.

});
