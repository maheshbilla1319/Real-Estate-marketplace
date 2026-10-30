
// ==========================================
// ESTATEAURA BLOG + PROPERTIES JAVASCRIPT
// MOBILE MENU TOGGLE | AOS | FILTERS
// SEARCH | SORT | FAVORITES | NEWSLETTER
// ==========================================

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

  // 3. MOBILE NAVIGATION TOGGLE
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

  if (menuToggle && mainNav) {

    // Initial menu state
    closeMenu();

    // Toggle menu on every click
    menuToggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (mainNav.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close after clicking navigation links
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    // Close when clicking outside
    document.addEventListener("click", function (event) {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Close using Escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Close on desktop screen
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

        if (isVisible) visibleCount++;
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

    // Blog search
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
            behavior: "smooth",
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

    // Reset blog filters
    function resetBlogFilters() {
      searchQuery = "";
      activeCategory = "all";
      sortMode = "default";

      if (blogSearchInput) blogSearchInput.value = "";
      if (blogCategoryFilter) blogCategoryFilter.value = "all";
      if (blogSort) blogSort.value = "default";

      sortBlogCards();
    }

    if (showAllBlogsBtn) {
      showAllBlogsBtn.addEventListener(
        "click",
        resetBlogFilters
      );
    }

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

          newsletterMessage.className = "form-message error";
        }

        if (emailInput) emailInput.focus();

        return;
      }

      if (newsletterMessage) {
        newsletterMessage.textContent =
          "Email validated successfully! Redirecting...";

        newsletterMessage.className = "form-message success";
      }

      window.location.href = "404.html";
    });
  }

  // 7. PROPERTY FILTER, SORT AND FAVORITES
  const propertyGrid = document.getElementById("propertyGrid");
  const properties = Array.from(
    document.querySelectorAll(".property-card")
  );

  const propertyFilterButtons =
    document.querySelectorAll(".filter-btn");

  const sortSelect = document.getElementById("sortProperties");
  const emptyState = document.getElementById("emptyState");
  const showAllBtn = document.getElementById("showAllBtn");

  if (propertyGrid && properties.length) {

    let activeFilter = "all";
    const originalPropertyOrder = [...properties];

    function filterProperties() {
      let visibleCount = 0;

      properties.forEach(function (property) {
        const propertyType = property.dataset.type;

        const matchesFilter =
          activeFilter === "all" ||
          propertyType === activeFilter;

        property.hidden = !matchesFilter;

        if (matchesFilter) visibleCount++;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }

      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
    }

    // Property filter buttons
    propertyFilterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = this.dataset.filter || "all";

        propertyFilterButtons.forEach(function (btn) {
          const isActive = btn === button;

          btn.classList.toggle("active", isActive);
          btn.setAttribute("aria-pressed", String(isActive));
        });

        filterProperties();
      });
    });

    // Property sorting
    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        const sortValue = this.value;
        const sortedProperties = [...properties];

        if (sortValue === "low") {
          sortedProperties.sort(function (a, b) {
            return Number(a.dataset.price) -
                   Number(b.dataset.price);
          });

        } else if (sortValue === "high") {
          sortedProperties.sort(function (a, b) {
            return Number(b.dataset.price) -
                   Number(a.dataset.price);
          });

        } else {
          sortedProperties.splice(
            0,
            sortedProperties.length,
            ...originalPropertyOrder
          );
        }

        sortedProperties.forEach(function (property) {
          propertyGrid.appendChild(property);
        });

        filterProperties();
      });
    }

    // Favorite buttons
    document.querySelectorAll(".favorite-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        const isFavorite =
          this.getAttribute("aria-pressed") === "true";

        this.setAttribute("aria-pressed", String(!isFavorite));
        this.classList.toggle("favorited", !isFavorite);

        const icon = this.querySelector("i");

        if (icon) {
          icon.classList.toggle("bi-heart", isFavorite);
          icon.classList.toggle("bi-heart-fill", !isFavorite);
        }

        const propertyCard = this.closest(".property-card");
        const propertyTitle = propertyCard?.querySelector("h3");

        if (propertyTitle) {
          console.log(
            !isFavorite
              ? propertyTitle.textContent + " added to favorites"
              : propertyTitle.textContent + " removed from favorites"
          );
        }
      });
    });

    // Clear property filters
    function clearFilters() {
      activeFilter = "all";

      propertyFilterButtons.forEach(function (button) {
        const isAll = button.dataset.filter === "all";

        button.classList.toggle("active", isAll);
        button.setAttribute("aria-pressed", String(isAll));
      });

      if (sortSelect) {
        sortSelect.value = "default";
      }

      originalPropertyOrder.forEach(function (property) {
        propertyGrid.appendChild(property);
      });

      filterProperties();
    }

    if (showAllBtn) {
      showAllBtn.addEventListener("click", clearFilters);
    }

    filterProperties();
  }

  // 8. PROPERTY SEARCH + VALIDATION + 404 REDIRECT
  const searchForm = document.getElementById("propertySearchForm");
  const locationInput = document.getElementById("locationInput");
  const typeFilter = document.getElementById("typeFilter");
  const budgetFilter = document.getElementById("budgetFilter");
  const searchFeedback = document.getElementById("searchFeedback");

  if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const location = locationInput
        ? locationInput.value.trim()
        : "";

      const propertyType = typeFilter
        ? typeFilter.value
        : "all";

      const budget = budgetFilter
        ? budgetFilter.value
        : "all";

      function showMessage(message, status) {
        if (!searchFeedback) return;

        searchFeedback.textContent = message;
        searchFeedback.className = "search-feedback " + status;
      }

      if (searchFeedback) {
        searchFeedback.textContent = "";
        searchFeedback.className = "search-feedback";
      }

      if (!location) {
        showMessage("Please enter your preferred location.", "error");
        if (locationInput) locationInput.focus();
        return;
      }

      const locationPattern = /^[a-zA-Z\s,.-]{2,50}$/;

      if (!locationPattern.test(location)) {
        showMessage("Please enter a valid location.", "error");
        if (locationInput) locationInput.focus();
        return;
      }

      const validTypes = ["all", "villa", "apartment", "house"];

      if (!validTypes.includes(propertyType)) {
        showMessage("Please select a valid property type.", "error");
        if (typeFilter) typeFilter.focus();
        return;
      }

      const validBudgets = ["all", "50", "100", "200", "500"];

      if (!validBudgets.includes(budget)) {
        showMessage("Please select a valid budget.", "error");
        if (budgetFilter) budgetFilter.focus();
        return;
      }

      showMessage(
        "Search validated successfully! Redirecting...",
        "success"
      );

      setTimeout(function () {
        window.location.href = "404.html";
      }, 1200);
    });
  }

});
