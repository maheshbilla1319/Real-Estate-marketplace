
// ==========================================
// ESTATEAURA CONTACT PAGE JAVASCRIPT
// AOS | Mobile Menu Toggle | Sticky Header
// Contact Validation | Newsletter Validation
// FAQ Accordion | 404 Redirect
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. AOS SCROLL ANIMATIONS
    // ==========================================

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

    // ==========================================
    // 2. MOBILE NAVIGATION TOGGLE
    // ==========================================

    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    const navLinks = document.querySelectorAll(
        ".main-nav .nav-link"
    );

    function openMenu() {

        if (!menuToggle || !mainNav) return;

        mainNav.classList.add("open");
        document.body.classList.add("menu-open");

        menuToggle.classList.add("active");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation");

        menuToggle.innerHTML =
            '<i class="bi bi-x-lg" aria-hidden="true"></i>';
    }

    function closeMenu() {

        if (!menuToggle || !mainNav) return;

        mainNav.classList.remove("open");
        document.body.classList.remove("menu-open");

        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");

        menuToggle.innerHTML =
            '<i class="bi bi-list" aria-hidden="true"></i>';
    }

    if (menuToggle && mainNav) {

        // Initial menu state
        closeMenu();

        // Toggle OPEN / CLOSE
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

        // Close using Escape key
        document.addEventListener("keydown", function (event) {

            if (
                event.key === "Escape" &&
                mainNav.classList.contains("open")
            ) {
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

    // ==========================================
    // 3. STICKY HEADER EFFECT
    // ==========================================

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

    // ==========================================
    // 4. CONTACT FORM VALIDATION
    // SUCCESS + 404 REDIRECT
    // ==========================================

    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    if (contactForm && formStatus) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const fullName = document.getElementById("fullName");
            const email = document.getElementById("email");
            const phone = document.getElementById("phone");
            const enquiryType = document.getElementById("enquiryType");
            const budget = document.getElementById("budget");
            const message = document.getElementById("message");
            const consent = document.getElementById("consent");

            const submitButton =
                contactForm.querySelector(".submit-btn");

            // Clear previous messages
            formStatus.textContent = "";
            formStatus.className = "form-status";

            // Check required elements
            if (
                !fullName || !email || !phone ||
                !enquiryType || !budget || !message || !consent
            ) {
                formStatus.textContent =
                    "Please complete all required form fields.";

                formStatus.className = "form-status error";
                return;
            }

            // FULL NAME VALIDATION
            const nameValue = fullName.value.trim();

            if (nameValue.length < 2) {
                showError("Please enter your full name.", fullName);
                return;
            }

            if (!/^[a-zA-Z\s.'-]+$/.test(nameValue)) {
                showError("Please enter a valid name.", fullName);
                return;
            }

            // EMAIL VALIDATION
            const emailValue = email.value.trim();

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

            if (emailValue === "") {
                showError("Please enter your email address.", email);
                return;
            }

            if (!emailPattern.test(emailValue)) {
                showError("Please enter a valid email address.", email);
                return;
            }

            // PHONE VALIDATION (OPTIONAL)
            const phoneValue = phone.value.trim();

            if (phoneValue !== "") {

                const cleanPhone =
                    phoneValue.replace(/[\s-]/g, "");

                const phonePattern =
                    /^(?:\+?91)?[6-9]\d{9}$/;

                if (!phonePattern.test(cleanPhone)) {
                    showError(
                        "Please enter a valid Indian mobile number.",
                        phone
                    );
                    return;
                }

            }

            // ENQUIRY TYPE VALIDATION
            const validEnquiryTypes = [
                "buy",
                "sell",
                "rent",
                "invest",
                "other"
            ];

            if (!validEnquiryTypes.includes(enquiryType.value)) {
                showError(
                    "Please select your enquiry type.",
                    enquiryType
                );
                return;
            }

            // BUDGET VALIDATION
            const validBudgets = [
                "",
                "Under ₹25 lakh",
                "₹25 lakh – ₹50 lakh",
                "₹50 lakh – ₹1 crore",
                "₹1 crore – ₹2 crore",
                "Above ₹2 crore",
                "Not decided yet"
            ];

            if (!validBudgets.includes(budget.value)) {
                showError("Please select a valid budget.", budget);
                return;
            }

            // MESSAGE VALIDATION
            const messageValue = message.value.trim();

            if (messageValue.length < 10) {
                showError(
                    "Message must contain at least 10 characters.",
                    message
                );
                return;
            }

            // CONSENT VALIDATION
            if (!consent.checked) {
                showError(
                    "Please agree to be contacted regarding this enquiry.",
                    consent
                );
                return;
            }

            // SUCCESS MESSAGE
            formStatus.textContent =
                "Your enquiry has been validated successfully! Redirecting...";

            formStatus.className = "form-status success";

            // Disable submit button
            if (submitButton) {

                submitButton.disabled = true;

                submitButton.innerHTML =
                    'Submitting... <i class="bi bi-check-circle"></i>';

            }

            // REDIRECT TO 404
            setTimeout(function () {

                window.location.href = "404.html";

            }, 1500);

        });

        // ERROR MESSAGE FUNCTION
        function showError(errorMessage, field) {

            formStatus.textContent = errorMessage;
            formStatus.className = "form-status error";

            field.focus();

        }

    }

    // ==========================================
    // 5. NEWSLETTER VALIDATION
    // ==========================================

    const newsletterForm =
        document.getElementById("newsletterForm");

    const newsletterMessage =
        document.getElementById("newsletterMessage");

    if (newsletterForm) {

        newsletterForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const emailInput =
                document.getElementById("newsletterEmail");

            if (!emailInput || !newsletterMessage) return;

            // Clear previous message
            newsletterMessage.textContent = "";
            newsletterMessage.className = "form-message";

            // EMPTY EMAIL VALIDATION
            if (emailInput.value.trim() === "") {

                showNewsletterError(
                    "Please enter your email address."
                );

                emailInput.focus();
                return;

            }

            // EMAIL FORMAT VALIDATION
            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

            if (!emailPattern.test(emailInput.value.trim())) {

                showNewsletterError(
                    "Please enter a valid email address."
                );

                emailInput.focus();
                return;

            }

            // SUCCESS MESSAGE
            newsletterMessage.textContent =
                "Email validated successfully! Redirecting...";

            newsletterMessage.className =
                "form-message success";

            // REDIRECT TO 404
            setTimeout(function () {

                window.location.href = "404.html";

            }, 1200);

        });

    }

    function showNewsletterError(errorMessage) {

        if (!newsletterMessage) return;

        newsletterMessage.textContent = errorMessage;

        newsletterMessage.className =
            "form-message error";

    }

    // ==========================================
    // 6. FAQ ACCORDION
    // ONE OPEN AT A TIME
    // AUTO CLOSE ON SCROLL
    // ==========================================

    const faqItems = document.querySelectorAll(".faq-item");

    if (faqItems.length) {

        // Close other FAQs when one opens
        faqItems.forEach(function (item) {

            item.addEventListener("toggle", function () {

                if (item.open) {

                    faqItems.forEach(function (otherItem) {

                        if (otherItem !== item) {
                            otherItem.open = false;
                        }

                    });

                }

            });

        });

        // Automatically close FAQs while scrolling
        window.addEventListener("scroll", function () {

            faqItems.forEach(function (item) {

                if (item.open) {
                    item.open = false;
                }

            });

        }, { passive: true });

    }

    // ==========================================
    // 7. FOOTER CURRENT YEAR
    // ==========================================

    const footerYear = document.getElementById("footerYear");

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // ==========================================
    // 8. BACK TO TOP BUTTON
    // ==========================================

    const backToTop = document.getElementById("backToTop");

    if (backToTop) {

        backToTop.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth"
            });

        });

    }

});
