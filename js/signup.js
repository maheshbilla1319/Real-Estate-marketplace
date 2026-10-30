
// ======================================
// ESTATEAURA SIGNUP JAVASCRIPT
// Validation | Role selection | Redirect
// ======================================

document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const terms = document.getElementById("terms");

  const togglePassword = document.getElementById("togglePassword");
  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword"
  );

  const signupButton = document.getElementById("signupButton");
  const formMessage = document.getElementById("formMessage");
  const currentYear = document.getElementById("currentYear");

  // 1. FOOTER YEAR
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // 2. ROLE SELECTION STYLING
  const roleOptions = document.querySelectorAll(".role-option");
  const roleInputs = document.querySelectorAll('input[name="role"]');

  function updateRoleSelection() {
    roleOptions.forEach(function (option) {
      const input = option.querySelector('input[name="role"]');

      option.classList.toggle("selected", input.checked);
    });
  }

  roleInputs.forEach(function (input) {
    input.addEventListener("change", updateRoleSelection);
  });

  updateRoleSelection();

  // 3. SHOW / HIDE PASSWORD
  function setupPasswordToggle(input, button) {
    if (!input || !button) return;

    button.addEventListener("click", function () {
      const isPassword = input.type === "password";

      input.type = isPassword ? "text" : "password";
      button.innerHTML = isPassword
        ? '<i class="bi bi-eye-slash"></i>'
        : '<i class="bi bi-eye"></i>';

      button.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password"
      );
    });
  }

  setupPasswordToggle(password, togglePassword);
  setupPasswordToggle(confirmPassword, toggleConfirmPassword);

  // 4. HELPERS
  function setError(input, errorId, message) {
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.textContent = message;
    }

    if (input) {
      input.classList.toggle("invalid", Boolean(message));
      input.classList.toggle("valid", !message && input.value.trim() !== "");
      input.setAttribute("aria-invalid", message ? "true" : "false");
    }
  }

  function clearFormMessage() {
    if (!formMessage) return;

    formMessage.textContent = "";
    formMessage.className = "form-message";
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  // 5. CLEAR FIELD ERRORS AS THE USER TYPES
  fullName.addEventListener("input", function () {
    setError(fullName, "nameError", "");
    clearFormMessage();
  });

  email.addEventListener("input", function () {
    setError(email, "emailError", "");
    clearFormMessage();
  });

  password.addEventListener("input", function () {
    setError(password, "passwordError", "");

    if (confirmPassword.value) {
      setError(
        confirmPassword,
        "confirmPasswordError",
        confirmPassword.value === password.value
          ? ""
          : "Passwords do not match."
      );
    }

    clearFormMessage();
  });

  confirmPassword.addEventListener("input", function () {
    setError(
      confirmPassword,
      "confirmPasswordError",
      confirmPassword.value === password.value
        ? ""
        : "Passwords do not match."
    );

    clearFormMessage();
  });

  // 6. FORM SUBMISSION
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearFormMessage();

    let isValid = true;

    // Validate name
    const nameValue = fullName.value.trim();

    if (nameValue.length < 2) {
      setError(
        fullName,
        "nameError",
        "Please enter your full name."
      );
      isValid = false;
    } else {
      setError(fullName, "nameError", "");
    }

    // Validate email
    const emailValue = email.value.trim();

    if (!isValidEmail(emailValue)) {
      setError(
        email,
        "emailError",
        "Please enter a valid email address."
      );
      isValid = false;
    } else {
      setError(email, "emailError", "");
    }

    // Validate password
    if (password.value.length < 8) {
      setError(
        password,
        "passwordError",
        "Password must contain at least 8 characters."
      );
      isValid = false;
    } else {
      setError(password, "passwordError", "");
    }

    // Validate confirm password
    if (confirmPassword.value !== password.value) {
      setError(
        confirmPassword,
        "confirmPasswordError",
        "Passwords do not match."
      );
      isValid = false;
    } else {
      setError(confirmPassword, "confirmPasswordError", "");
    }

    // Validate terms
    const termsError = document.getElementById("termsError");

    if (!terms.checked) {
      if (termsError) {
        termsError.textContent = "Please accept the terms to continue.";
      }

      isValid = false;
    } else if (termsError) {
      termsError.textContent = "";
    }

    if (!isValid) {
      if (formMessage) {
        formMessage.textContent = "Please correct the highlighted fields.";
        formMessage.classList.add("error");
      }

      const firstInvalid = signupForm.querySelector(
        'input.invalid, input[aria-invalid="true"]'
      );

      if (firstInvalid) {
        firstInvalid.focus();
      }

      return;
    }

    // Selected role is available for backend integration.
    const selectedRole = document.querySelector(
      'input[name="role"]:checked'
    ).value;

    /*
      DEMO ONLY:
      This front-end form does not create an account or save credentials.
      Connect a real authentication backend before production use.
    */

    if (formMessage) {
      formMessage.textContent =
        "Details validated! Redirecting to the login page...";
      formMessage.classList.add("success");
    }

    signupButton.disabled = true;
    signupButton.querySelector("span").textContent = "Please wait...";
    signupButton.querySelector("i").className = "bi bi-arrow-repeat";

    // Redirect to login.html.
    // Replace this demo flow with backend registration when available.
    window.location.href = "login.html";
  });

  // 7. TERMS ERROR CLEARS WHEN CHECKED
  terms.addEventListener("change", function () {
    const termsError = document.getElementById("termsError");

    if (terms.checked && termsError) {
      termsError.textContent = "";
    }

    clearFormMessage();
  });
});
