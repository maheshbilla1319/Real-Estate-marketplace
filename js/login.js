
document.addEventListener("DOMContentLoaded", function () {
  // AOS scroll animations
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      once: true,
      offset: 50
    });
  }

  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const loginButton = document.getElementById("loginButton");
  const formMessage = document.getElementById("formMessage");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  // Show / hide password
  togglePassword.addEventListener("click", function () {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    togglePassword.innerHTML = isPassword
      ? '<i class="bi bi-eye-slash"></i>'
      : '<i class="bi bi-eye"></i>';

    togglePassword.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password"
    );
  });

  // Clear errors when the user types
  emailInput.addEventListener("input", function () {
    emailError.textContent = "";
    formMessage.textContent = "";
    formMessage.className = "form-message";
  });

  passwordInput.addEventListener("input", function () {
    passwordError.textContent = "";
    formMessage.textContent = "";
    formMessage.className = "form-message";
  });

  // Login form validation and dashboard redirect
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    emailError.textContent = "";
    passwordError.textContent = "";
    formMessage.textContent = "";
    formMessage.className = "form-message";

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const selectedRole = document.querySelector(
      'input[name="role"]:checked'
    );

    let isValid = true;

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      emailError.textContent = "Please enter your email address.";
      isValid = false;
    } else if (!emailPattern.test(email)) {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      passwordError.textContent = "Please enter your password.";
      isValid = false;
    }

    // Validate selected role
    if (!selectedRole) {
      formMessage.textContent = "Please select your role.";
      formMessage.classList.add("error");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Demo login only: no real account authentication happens here.
    loginButton.disabled = true;
    loginButton.innerHTML =
      '<span>Logging in...</span> <i class="bi bi-arrow-repeat"></i>';

    const dashboardPages = {
      buyer: "buyer-dashboard.html",
      agent: "agent-dashboard.html"
    };

    const destination = dashboardPages[selectedRole.value];

    if (destination) {
      window.location.href = destination;
    } else {
      loginButton.disabled = false;
      loginButton.innerHTML =
        '<span>Login to Dashboard</span> <i class="bi bi-arrow-right"></i>';

      formMessage.textContent = "Invalid role selected.";
      formMessage.classList.add("error");
    }
  });
});
