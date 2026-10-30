
document.addEventListener("DOMContentLoaded", function () {
  // =========================================
  // 1. INITIALIZE AOS ANIMATIONS
  // =========================================
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 45
    });
  }

  // =========================================
  // 2. DATE AND FOOTER YEAR
  // =========================================
  const currentDate = document.getElementById("currentDate");
  const footerYear = document.getElementById("footerYear");

  if (currentDate) {
    currentDate.textContent = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).toUpperCase();
  }

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // =========================================
  // 3. TOAST MESSAGE
  // =========================================
  const toastMessage = document.getElementById("toastMessage");
  let toastTimeout;

  function showToast(message) {
    if (!toastMessage) return;

    toastMessage.textContent = message;
    toastMessage.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(function () {
      toastMessage.classList.remove("show");
    }, 3000);
  }

  // =========================================
  // 4. MOBILE SIDEBAR
  // =========================================
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("open");
    document.body.classList.add("sidebar-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    menuToggle.innerHTML = '<i class="bi bi-x-lg"></i>';
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("open");
    document.body.classList.remove("sidebar-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    menuToggle.innerHTML = '<i class="bi bi-list"></i>';
  }

  menuToggle.addEventListener("click", function () {
    if (sidebar.classList.contains("open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  sidebarOverlay.addEventListener("click", closeSidebar);

  window.addEventListener("resize", function () {
    if (window.innerWidth > 950) {
      closeSidebar();
    }
  });

  // =========================================
  // 5. SIDEBAR NAVIGATION
  // =========================================
  const navLinks = document.querySelectorAll(".nav-link");

  function activateNavigation(target) {
    navLinks.forEach(function (link) {
      link.classList.toggle(
        "active",
        link.dataset.target === target
      );
    });
  }

  document.querySelectorAll("[data-target]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      const target = link.dataset.target;
      const section = document.getElementById(target);

      if (section) {
        event.preventDefault();

        section.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        activateNavigation(target);
        closeSidebar();
      }
    });
  });

  // Update active sidebar item while scrolling
  const observedSections = ["overview", "explore", "saved", "visits", "profile"]
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      const visibleEntries = entries
        .filter(function (entry) {
          return entry.isIntersecting;
        })
        .sort(function (a, b) {
          return b.intersectionRatio - a.intersectionRatio;
        });

      if (visibleEntries.length) {
        activateNavigation(visibleEntries[0].target.id);
      }
    }, {
      rootMargin: "-15% 0px -65% 0px",
      threshold: [0, 0.1, 0.25, 0.5]
    });

    observedSections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // =========================================
  // 6. PROPERTY IMAGE SLIDER
  // =========================================
  const slides = Array.from(document.querySelectorAll(".slide"));
  const sliderDots = Array.from(document.querySelectorAll(".slider-dot"));
  const sliderPrev = document.getElementById("sliderPrev");
  const sliderNext = document.getElementById("sliderNext");
  const heroSlider = document.getElementById("heroSlider");

  let currentSlide = 0;
  let sliderInterval = null;

  function showSlide(index) {
    if (!slides.length) return;

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      const isActive = i === currentSlide;

      slide.classList.toggle("active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    sliderDots.forEach(function (dot, i) {
      const isActive = i === currentSlide;

      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });
  }

  function stopSlider() {
    if (sliderInterval) {
      clearInterval(sliderInterval);
      sliderInterval = null;
    }
  }

  function startSlider() {
    stopSlider();

    if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sliderInterval = setInterval(function () {
        showSlide(currentSlide + 1);
      }, 5000);
    }
  }

  if (sliderPrev) {
    sliderPrev.addEventListener("click", function () {
      showSlide(currentSlide - 1);
      startSlider();
    });
  }

  if (sliderNext) {
    sliderNext.addEventListener("click", function () {
      showSlide(currentSlide + 1);
      startSlider();
    });
  }

  sliderDots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showSlide(Number(dot.dataset.slide));
      startSlider();
    });
  });

  // Pause autoplay when hovering or focusing the slider
  if (heroSlider) {
    heroSlider.addEventListener("mouseenter", stopSlider);
    heroSlider.addEventListener("mouseleave", startSlider);
    heroSlider.addEventListener("focusin", stopSlider);
    heroSlider.addEventListener("focusout", function (event) {
      if (!heroSlider.contains(event.relatedTarget)) {
        startSlider();
      }
    });
  }

  showSlide(0);
  startSlider();

  // =========================================
  // 7. PROPERTY SEARCH AND FILTERS
  // =========================================
  const propertyCards = Array.from(
    document.querySelectorAll(".property-card")
  );

  const propertySearch = document.getElementById("propertySearch");
  const globalSearch = document.getElementById("globalSearch");
  const typeFilter = document.getElementById("typeFilter");
  const priceFilter = document.getElementById("priceFilter");
  const resultsLabel = document.getElementById("resultsLabel");
  const emptyState = document.getElementById("emptyState");

  function filterProperties() {
    const searchTerm = (propertySearch.value || globalSearch.value)
      .trim()
      .toLowerCase();

    const selectedType = typeFilter.value;
    const selectedPrice = priceFilter.value;

    let visibleCount = 0;

    propertyCards.forEach(function (card) {
      const name = card.dataset.name.toLowerCase();
      const location = card.dataset.location.toLowerCase();
      const type = card.dataset.type;
      const price = Number(card.dataset.price);

      const matchesSearch =
        !searchTerm ||
        name.includes(searchTerm) ||
        location.includes(searchTerm) ||
        type.toLowerCase().includes(searchTerm);

      const matchesType =
        selectedType === "all" || type === selectedType;

      let matchesPrice = true;

      if (selectedPrice === "1") {
        matchesPrice = price < 1;
      } else if (selectedPrice === "2") {
        matchesPrice = price >= 1 && price <= 2;
      } else if (selectedPrice === "3") {
        matchesPrice = price > 2;
      }

      const visible = matchesSearch && matchesType && matchesPrice;

      card.hidden = !visible;

      if (visible) {
        visibleCount++;
      }
    });

    resultsLabel.textContent =
      visibleCount + (visibleCount === 1 ? " property" : " properties");

    emptyState.hidden = visibleCount !== 0;

    if (typeof AOS !== "undefined") {
      AOS.refresh();
    }
  }

  propertySearch.addEventListener("input", function () {
    globalSearch.value = propertySearch.value;
    filterProperties();
  });

  globalSearch.addEventListener("input", function () {
    propertySearch.value = globalSearch.value;
    filterProperties();
  });

  typeFilter.addEventListener("change", filterProperties);
  priceFilter.addEventListener("change", filterProperties);

  // =========================================
  // 8. SAVE / UNSAVE FAVORITE PROPERTIES
  // =========================================
  const savedPanel = document.getElementById("savedPanel");
  const savedCount = document.getElementById("savedCount");
  const savedStat = document.getElementById("savedStat");

  const savedProperties = new Set();

  function getPropertyData(card) {
    return {
      name: card.dataset.name,
      location: card.dataset.location,
      price: card.querySelector(".property-price-row h3").textContent,
      image: card.querySelector(".property-image img").src,
      imageAlt: card.querySelector(".property-image img").alt
    };
  }

  function renderSavedProperties() {
    savedCount.textContent = savedProperties.size;
    savedStat.textContent = String(savedProperties.size).padStart(2, "0");

    if (!savedProperties.size) {
      savedPanel.innerHTML = `
        <div class="saved-empty">
          <div class="saved-empty-icon"><i class="bi bi-heart"></i></div>
          <h3>Your favorites will appear here</h3>
          <p>Tap the heart icon on any property to save it to your shortlist.</p>
          <a href="#explore" class="text-link" data-target="explore">
            Explore properties <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      `;
      return;
    }

    savedPanel.innerHTML = '<div class="saved-list"></div>';
    const savedList = savedPanel.querySelector(".saved-list");

    savedProperties.forEach(function (propertyName) {
      const card = propertyCards.find(function (item) {
        return item.dataset.name === propertyName;
      });

      if (!card) return;

      const property = getPropertyData(card);
      const item = document.createElement("article");
      item.className = "saved-item";

      const image = document.createElement("img");
      image.src = property.image;
      image.alt = property.imageAlt;
      image.loading = "lazy";

      const info = document.createElement("div");
      info.className = "saved-item-info";

      const title = document.createElement("h4");
      title.textContent = property.name;

      const price = document.createElement("p");
      price.textContent = property.price + " · " + property.location;

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.textContent = "Remove from saved";
      removeButton.addEventListener("click", function () {
        savedProperties.delete(propertyName);

        const favoriteButton = card.querySelector(".favorite-button");
        favoriteButton.classList.remove("saved");
        favoriteButton.setAttribute("aria-pressed", "false");
        favoriteButton.innerHTML = '<i class="bi bi-heart"></i>';

        renderSavedProperties();
        showToast("Property removed from your saved list.");
      });

      info.append(title, price, removeButton);
      item.append(image, info);
      savedList.appendChild(item);
    });
  }

  document.querySelectorAll(".favorite-button").forEach(function (button) {
    button.addEventListener("click", function () {
      const card = button.closest(".property-card");
      const propertyName = card.dataset.name;

      if (savedProperties.has(propertyName)) {
        savedProperties.delete(propertyName);
        button.classList.remove("saved");
        button.setAttribute("aria-pressed", "false");
        button.innerHTML = '<i class="bi bi-heart"></i>';

        showToast("Removed from saved properties.");
      } else {
        savedProperties.add(propertyName);
        button.classList.add("saved");
        button.setAttribute("aria-pressed", "true");
        button.innerHTML = '<i class="bi bi-heart-fill"></i>';

        showToast("Property added to your saved list.");
      }

      renderSavedProperties();
    });
  });

  renderSavedProperties();

  // =========================================
  // 9. PROPERTY DETAILS MODAL
  // =========================================
  const propertyModal = document.getElementById("propertyModal");
  const modalClose = document.getElementById("modalClose");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalLocation = document.getElementById("modalLocation");
  const modalPrice = document.getElementById("modalPrice");
  const modalDescription = document.getElementById("modalDescription");
  const modalVisit = document.getElementById("modalVisit");

  let selectedProperty = null;
  let previousFocus = null;

  function openPropertyModal(card) {
    const property = getPropertyData(card);

    selectedProperty = property.name;
    previousFocus = document.activeElement;

    modalImage.src = property.image;
    modalImage.alt = property.imageAlt;
    modalTitle.textContent = property.name;
    modalLocation.textContent = property.location + ", Hyderabad";
    modalPrice.textContent = property.price;
    modalDescription.textContent =
      "Explore " + property.name +
      " in " + property.location +
      ". Contact the property agent to confirm availability, pricing, " +
      "amenities, and verified property details.";

    propertyModal.classList.add("open");
    propertyModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    modalClose.focus();
  }

  function closePropertyModal() {
    propertyModal.classList.remove("open");
    propertyModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  document.querySelectorAll(".property-details").forEach(function (button) {
    button.addEventListener("click", function () {
      const card = button.closest(".property-card");
      openPropertyModal(card);
    });
  });

  modalClose.addEventListener("click", closePropertyModal);

  propertyModal.addEventListener("click", function (event) {
    if (event.target === propertyModal) {
      closePropertyModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && propertyModal.classList.contains("open")) {
      closePropertyModal();
    }

    if (event.key === "Escape" && sidebar.classList.contains("open")) {
      closeSidebar();
    }
  });

  // =========================================
  // 10. REQUEST A PROPERTY VISIT
  // =========================================
  function requestVisit(propertyName) {
    if (!propertyName) return;

    showToast(
      "Visit request demo for " + propertyName +
      ". Connect a booking form or backend to submit your request."
    );
  }

  document.querySelectorAll(".visit-button").forEach(function (button) {
    button.addEventListener("click", function () {
      requestVisit(button.dataset.property);
    });
  });

  modalVisit.addEventListener("click", function () {
    const propertyName = selectedProperty;
    closePropertyModal();
    requestVisit(propertyName);
  });

  // =========================================
  // 11. NOTIFICATION BUTTON
  // =========================================
  const notificationButton = document.getElementById("notificationButton");

  notificationButton.addEventListener("click", function () {
    showToast("You are all caught up. New property alerts can be connected later.");
  });

  // =========================================
  // 12. LOGOUT BUTTON
  // =========================================
  const logoutButton = document.getElementById("logoutButton");

  logoutButton.addEventListener("click", function () {
    const shouldLogout = window.confirm(
      "Are you sure you want to logout of EstateAura?"
    );

    if (shouldLogout) {
      // This demo has no server session to end.
      window.location.href = "login.html";
    }
  });
});
