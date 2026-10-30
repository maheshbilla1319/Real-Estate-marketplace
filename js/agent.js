
document.addEventListener("DOMContentLoaded", function () {
  // =========================================
  // 1. AOS ANIMATIONS
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
      month: "short",
      year: "numeric"
    }).toUpperCase();
  }

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // =========================================
  // 3. TOAST NOTIFICATIONS
  // =========================================
  const toast = document.getElementById("toastMessage");
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
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
    sidebar.classList.contains("open")
      ? closeSidebar()
      : openSidebar();
  });

  sidebarOverlay.addEventListener("click", closeSidebar);

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1000) {
      closeSidebar();
    }
  });

  // =========================================
  // 5. SECTION NAVIGATION
  // =========================================
  const navLinks = document.querySelectorAll(".nav-link");

  function setActiveLink(target) {
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

      if (!section) return;

      event.preventDefault();
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      setActiveLink(target);
      closeSidebar();
    });
  });

  if ("IntersectionObserver" in window) {
    const sections = [
      "overview",
      "properties",
      "leads",
      "visits",
      "messages",
      "performance",
      "profile"
    ].map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean);

    const sectionObserver = new IntersectionObserver(function (entries) {
      const visible = entries.find(function (entry) {
        return entry.isIntersecting;
      });

      if (visible) {
        setActiveLink(visible.target.id);
      }
    }, {
      rootMargin: "-15% 0px -70% 0px",
      threshold: 0
    });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // =========================================
  // 6. FEATURED PROPERTY SLIDER
  // =========================================
  const slider = document.getElementById("featureSlider");
  const slides = Array.from(
    document.querySelectorAll(".feature-slide")
  );
  const dots = Array.from(
    document.querySelectorAll(".slider-dot")
  );

  const prevButton = document.getElementById("sliderPrev");
  const nextButton = document.getElementById("sliderNext");

  let activeSlide = 0;
  let sliderTimer = null;

  function showSlide(index) {
    if (!slides.length) return;

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      const active = i === activeSlide;

      slide.classList.toggle("active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });

    dots.forEach(function (dot, i) {
      const active = i === activeSlide;

      dot.classList.toggle("active", active);
      dot.setAttribute("aria-pressed", String(active));
    });
  }

  function stopSlider() {
    clearInterval(sliderTimer);
    sliderTimer = null;
  }

  function startSlider() {
    stopSlider();

    if (
      slides.length > 1 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      sliderTimer = setInterval(function () {
        showSlide(activeSlide + 1);
      }, 5000);
    }
  }

  prevButton.addEventListener("click", function () {
    showSlide(activeSlide - 1);
    startSlider();
  });

  nextButton.addEventListener("click", function () {
    showSlide(activeSlide + 1);
    startSlider();
  });

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showSlide(Number(dot.dataset.slide));
      startSlider();
    });
  });

  slider.addEventListener("mouseenter", stopSlider);
  slider.addEventListener("mouseleave", startSlider);
  slider.addEventListener("focusin", stopSlider);

  slider.addEventListener("focusout", function (event) {
    if (!slider.contains(event.relatedTarget)) {
      startSlider();
    }
  });

  showSlide(0);
  startSlider();

  // =========================================
  // 7. PROPERTY SEARCH AND STATUS FILTER
  // =========================================
  const propertyGrid = document.getElementById("propertyGrid");
  const searchInput = document.getElementById("propertySearch");
  const globalSearch = document.getElementById("globalSearch");
  const statusFilter = document.getElementById("statusFilter");
  const resultCount = document.getElementById("propertyResultCount");
  const propertyEmpty = document.getElementById("propertyEmpty");

  function filterProperties() {
    const keyword = (
      searchInput.value || globalSearch.value
    ).trim().toLowerCase();

    const status = statusFilter.value;
    const cards = Array.from(
      propertyGrid.querySelectorAll(".agent-property-card")
    );

    let visibleCount = 0;

    cards.forEach(function (card) {
      const name = card.dataset.name.toLowerCase();
      const location = card.dataset.location.toLowerCase();

      const matchesSearch =
        !keyword ||
        name.includes(keyword) ||
        location.includes(keyword);

      const matchesStatus =
        status === "all" || card.dataset.status === status;

      const visible = matchesSearch && matchesStatus;

      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    resultCount.textContent =
      visibleCount + (visibleCount === 1 ? " listing" : " listings");

    propertyEmpty.hidden = visibleCount > 0;

    if (typeof AOS !== "undefined") {
      AOS.refresh();
    }
  }

  searchInput.addEventListener("input", function () {
    globalSearch.value = searchInput.value;
    filterProperties();
  });

  globalSearch.addEventListener("input", function () {
    searchInput.value = globalSearch.value;
    filterProperties();
  });

  statusFilter.addEventListener("change", filterProperties);

  // =========================================
  // 8. ADD PROPERTY MODAL
  // =========================================
  const propertyModal = document.getElementById("propertyModal");
  const addPropertyButton = document.getElementById("addPropertyButton");
  const addPropertyTop = document.getElementById("addPropertyTop");
  const modalClose = document.getElementById("modalClose");
  const propertyForm = document.getElementById("propertyForm");

  let previousFocus = null;
  let propertyNumber = 1007;

  function openPropertyModal() {
    previousFocus = document.activeElement;
    propertyForm.reset();

    propertyModal.classList.add("open");
    propertyModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    document.getElementById("newPropertyName").focus();
  }

  function closePropertyModal() {
    propertyModal.classList.remove("open");
    propertyModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (previousFocus) previousFocus.focus();
  }

  addPropertyButton.addEventListener("click", openPropertyModal);
  addPropertyTop.addEventListener("click", openPropertyModal);
  modalClose.addEventListener("click", closePropertyModal);

  propertyModal.addEventListener("click", function (event) {
    if (event.target === propertyModal) {
      closePropertyModal();
    }
  });

  function formatPrice(value) {
    const amount = Number(value);

    if (amount >= 10000000) {
      return "₹" + (amount / 10000000).toFixed(2) + " Cr";
    }

    if (amount >= 100000) {
      return "₹" + (amount / 100000).toFixed(2) + " Lakh";
    }

    return "₹" + amount.toLocaleString("en-IN");
  }

  function statusClass(status) {
    if (status === "Pending") return "pending";
    if (status === "Sold") return "sold";
    return "available";
  }

  propertyForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("newPropertyName").value.trim();
    const location = document.getElementById("newPropertyLocation").value.trim();
    const price = Number(document.getElementById("newPropertyPrice").value);
    const type = document.getElementById("newPropertyType").value;
    const status = document.getElementById("newPropertyStatus").value;
    const imageInput = document.getElementById("newPropertyImage").value.trim();

    if (!name || !location || !Number.isFinite(price) || price <= 0) {
      showToast("Please enter a valid property name, location, and price.");
      return;
    }

    // Allow only HTTPS or HTTP image URLs.
    let imageUrl =
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80";

    if (imageInput) {
      try {
        const parsedUrl = new URL(imageInput);

        if (parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:") {
          imageUrl = parsedUrl.href;
        } else {
          showToast("Please enter a valid HTTP or HTTPS image URL.");
          return;
        }
      } catch {
        showToast("Please enter a valid image URL.");
        return;
      }
    }

    const card = document.createElement("article");
    card.className = "agent-property-card";
    card.dataset.name = name;
    card.dataset.location = location;
    card.dataset.status = status;

    // Build the new card with DOM methods instead of inserting user text as HTML.
    const imageWrap = document.createElement("div");
    imageWrap.className = "agent-property-image";

    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = name;
    image.loading = "lazy";

    const statusBadge = document.createElement("span");
    statusBadge.className = "status-badge " + statusClass(status);
    statusBadge.textContent = status;

    const reference = document.createElement("span");
    reference.className = "image-ref";
    reference.textContent = "EA-" + propertyNumber++;

    imageWrap.append(image, statusBadge, reference);

    const info = document.createElement("div");
    info.className = "agent-property-info";

    const locationText = document.createElement("p");
    locationText.className = "card-location";
    locationText.innerHTML = '<i class="bi bi-geo-alt"></i> ';
    locationText.appendChild(document.createTextNode(location + ", Hyderabad"));

    const title = document.createElement("h3");
    title.textContent = name;

    const priceRow = document.createElement("div");
    priceRow.className = "card-price-row";

    const priceText = document.createElement("strong");
    priceText.textContent = formatPrice(price);

    const typeText = document.createElement("span");
    typeText.textContent = type;

    priceRow.append(priceText, typeText);

    const meta = document.createElement("div");
    meta.className = "card-meta";

    const beds = document.createElement("span");
    beds.innerHTML = '<i class="bi bi-house"></i> Details on request';

    meta.appendChild(beds);

    const bottom = document.createElement("div");
    bottom.className = "card-bottom";

    const demoLabel = document.createElement("span");
    demoLabel.textContent = "New demo listing";

    const manageButton = document.createElement("button");
    manageButton.type = "button";
    manageButton.className = "edit-property";
    manageButton.dataset.edit = name;
    manageButton.innerHTML = 'Manage <i class="bi bi-arrow-up-right"></i>';

    bottom.append(demoLabel, manageButton);
    info.append(locationText, title, priceRow, meta, bottom);
    card.append(imageWrap, info);

    propertyGrid.prepend(card);

    closePropertyModal();
    filterProperties();
    updatePropertyCount();

    if (typeof AOS !== "undefined") {
      AOS.refreshHard();
    }

    showToast("Demo listing added: " + name);
  });

  function updatePropertyCount() {
    const total = propertyGrid.querySelectorAll(".agent-property-card").length;

    document.getElementById("totalListings").textContent =
      String(total).padStart(2, "0");

    document.getElementById("propertyNavCount").textContent =
      String(total).padStart(2, "0");
  }

  // =========================================
  // 9. ACTION MODAL
  // =========================================
  const actionModal = document.getElementById("actionModal");
  const actionModalClose = document.getElementById("actionModalClose");
  const actionModalTitle = document.getElementById("actionModalTitle");
  const actionModalKicker = document.getElementById("actionModalKicker");
  const actionModalBody = document.getElementById("actionModalBody");
  const actionModalDone = document.getElementById("actionModalDone");

  let currentAction = null;
  let currentActionData = null;

  function openActionModal(title, kicker, description, action, data) {
    currentAction = action;
    currentActionData = data || null;
    previousFocus = document.activeElement;

    actionModalTitle.textContent = title;
    actionModalKicker.textContent = kicker;
    actionModalBody.replaceChildren();

    const paragraph = document.createElement("p");
    paragraph.className = "action-body-text";
    paragraph.textContent = description;
    actionModalBody.appendChild(paragraph);

    actionModal.classList.add("open");
    actionModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    actionModalDone.focus();
  }

  function closeActionModal() {
    actionModal.classList.remove("open");
    actionModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (previousFocus) previousFocus.focus();
  }

  actionModalClose.addEventListener("click", closeActionModal);

  actionModal.addEventListener("click", function (event) {
    if (event.target === actionModal) {
      closeActionModal();
    }
  });

  // =========================================
  // 10. MANAGE PROPERTY STATUS
  // =========================================
  propertyGrid.addEventListener("click", function (event) {
    const button = event.target.closest("[data-edit]");
    if (!button) return;

    const card = button.closest(".agent-property-card");
    const name = card.dataset.name;

    currentActionData = { card: card, name: name };
    currentAction = "property";

    previousFocus = document.activeElement;
    actionModalTitle.textContent = "Manage property";
    actionModalKicker.textContent = "PORTFOLIO MANAGEMENT";
    actionModalBody.replaceChildren();

    const description = document.createElement("p");
    description.className = "action-body-text";
    description.textContent =
      "Update the sample listing status for " + name + ".";

    const select = document.createElement("select");
    select.className = "action-select";
    select.id = "manageStatus";
    select.setAttribute("aria-label", "Property status");

    ["Available", "Pending", "Sold"].forEach(function (status) {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      option.selected = card.dataset.status === status;
      select.appendChild(option);
    });

    actionModalBody.append(description, select);
    actionModal.classList.add("open");
    actionModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    actionModalDone.focus();
  });

  // =========================================
  // 11. LEAD FOLLOW-UP
  // =========================================
  document.getElementById("leadsTable").addEventListener("click", function (event) {
    const button = event.target.closest("[data-client]");
    if (!button) return;

    const name = button.dataset.client;
    const row = button.closest("tr");

    currentAction = "lead";
    currentActionData = { name: name, row: row };

    openActionModal(
      "Client follow-up",
      "CLIENT RELATIONSHIPS",
      "Follow-up for " + name + ". In a live application, connect this action to your CRM, email, or calling workflow.",
      "lead",
      currentActionData
    );
  });

  // =========================================
  // 12. MESSAGES
  // =========================================
  document.getElementById("messages").addEventListener("click", function (event) {
    const button = event.target.closest("[data-client]");
    if (!button) return;

    const name = button.dataset.client;

    currentAction = "message";
    currentActionData = { name: name };

    openActionModal(
      "Reply to " + name,
      "CLIENT COMMUNICATION",
      "This is a front-end demo. A real reply needs a message form and a connected email, chat, or backend service.",
      "message",
      currentActionData
    );
  });

  // =========================================
  // 13. CONFIRM PROPERTY VISIT
  // =========================================
  document.getElementById("visits").addEventListener("click", function (event) {
    const button = event.target.closest("[data-visit]");
    if (!button) return;

    currentAction = "visit";
    currentActionData = { button: button };

    openActionModal(
      "Confirm property visit",
      "VISIT SCHEDULE",
      "Confirm the demo appointment for " + button.dataset.visit + "?",
      "visit",
      currentActionData
    );
  });

  // =========================================
  // 14. FEATURED PROPERTY ACTION
  // =========================================
  document.querySelectorAll("[data-feature-property]").forEach(function (button) {
    button.addEventListener("click", function () {
      const name = button.dataset.featureProperty;

      const matchingCard = Array.from(
        propertyGrid.querySelectorAll(".agent-property-card")
      ).find(function (card) {
        return card.dataset.name === name;
      });

      if (matchingCard) {
        matchingCard.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        matchingCard.style.outline = "2px solid var(--gold)";

        setTimeout(function () {
          matchingCard.style.outline = "";
        }, 1800);
      } else {
        showToast("This featured property is sample promotional content.");
      }
    });
  });

  // =========================================
  // 15. SAVE ACTIONS
  // =========================================
  actionModalDone.addEventListener("click", function () {
    if (currentAction === "property" && currentActionData) {
      const card = currentActionData.card;
      const newStatus = document.getElementById("manageStatus").value;

      card.dataset.status = newStatus;

      const badge = card.querySelector(".status-badge");
      badge.textContent = newStatus;
      badge.className = "status-badge " + statusClass(newStatus);

      filterProperties();
      showToast("Property status updated in this demo.");
    } else if (currentAction === "lead" && currentActionData) {
      const row = currentActionData.row;
      const status = row.querySelector(".lead-status");

      status.textContent = "Contacted";
      status.className = "lead-status contacted";

      showToast("Lead marked as contacted in this demo.");
    } else if (currentAction === "visit" && currentActionData) {
      currentActionData.button.textContent = "Visit confirmed";
      currentActionData.button.disabled = true;
      currentActionData.button.style.opacity = ".65";

      showToast("Visit marked as confirmed in this demo.");
    } else if (currentAction === "message") {
      showToast("Connect a messaging service to send replies.");
    } else {
      showToast("Profile editing requires a connected form or backend.");
    }

    closeActionModal();
  });

  // =========================================
  // 16. PROFILE AND NOTIFICATIONS
  // =========================================
  document.getElementById("editProfileButton").addEventListener("click", function () {
    currentAction = "profile";

    openActionModal(
      "Edit agent profile",
      "ACCOUNT SETTINGS",
      "Alex Morgan · alex@example.com · Hyderabad, Telangana. Connect a profile form and backend to save profile changes.",
      "profile",
      null
    );
  });

  document.getElementById("notificationButton").addEventListener("click", function () {
    showToast("You're all caught up. Connect a notification service for live alerts.");
  });

  // =========================================
  // 17. LOGOUT
  // =========================================
  document.getElementById("logoutButton").addEventListener("click", function () {
    const confirmed = window.confirm(
      "Are you sure you want to logout of EstateAura?"
    );

    if (confirmed) {
      // Front-end demo only; clear any demo login marker if your app uses one.
      // A real application should also end the server session.
      window.location.href = "login.html";
    }
  });

  // =========================================
  // 18. ESCAPE KEY CLOSES OPEN MODALS
  // =========================================
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;

    if (propertyModal.classList.contains("open")) {
      closePropertyModal();
    }

    if (actionModal.classList.contains("open")) {
      closeActionModal();
    }

    if (sidebar.classList.contains("open")) {
      closeSidebar();
    }
  });

  // Initial counts
  updatePropertyCount();
  filterProperties();
});
