// ===== Utility: Sanitize input =====
function sanitizeInput(input) {
  const tempDiv = document.createElement("div");
  tempDiv.textContent = input;
  return tempDiv.innerHTML;
}

// ===== CSRF Token Handling =====
function generateCSRFToken() {
  return Math.random().toString(36).substring(2, 15);
}

const csrfToken = generateCSRFToken();
sessionStorage.setItem("csrfToken", csrfToken);

// Populate CSRF tokens into hidden fields
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("csrfTokenLogin").value = csrfToken;
  document.getElementById("csrfTokenRegister").value = csrfToken;
});

function validateCSRFToken(token) {
  return token === sessionStorage.getItem("csrfToken");
}

// ===== Toggle Forms =====
function toggleForms() {
  document.getElementById("loginForm").classList.toggle("hidden");
  document.getElementById("registerForm").classList.toggle("hidden");
  document.getElementById("formMessage").textContent = "";
}

// ===== Password Strength Checker =====
const passwordInput = document.getElementById("registerPassword");
const strengthMsg = document.getElementById("strengthMsg");

if (passwordInput) {
  passwordInput.addEventListener("input", () => {
    const pwd = passwordInput.value;
    if (pwd.length < 6) {
      strengthMsg.textContent = "Too short";
      strengthMsg.style.color = "red";
    } else if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) {
      strengthMsg.textContent = "Add uppercase and a number";
      strengthMsg.style.color = "orange";
    } else {
      strengthMsg.textContent = "Strong password!";
      strengthMsg.style.color = "green";
    }
  });
}

// ===== Registration =====
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = sanitizeInput(document.getElementById("registerUsername").value.trim());
  const email = sanitizeInput(document.getElementById("registerEmail").value.trim());
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const csrfTokenInput = document.getElementById("csrfTokenRegister").value;

  // CSRF Check
  if (!validateCSRFToken(csrfTokenInput)) {
    showMessage("Invalid CSRF token");
    return;
  }

  // Email Validation
  if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) {
    showMessage("Invalid email format");
    return;
  }

  // Password Match
  if (password !== confirmPassword) {
    showMessage("Passwords do not match");
    return;
  }

  // Password Strength Validation
  if (password.length < 6 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    showMessage("Password must be at least 6 chars, with uppercase and number");
    return;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Save user
  const user = { username, email, password: hashedPassword };
  localStorage.setItem("user", JSON.stringify(user));

  showMessage("Registration successful! You can now log in.", "green");
  toggleForms();
});

// ===== Login =====
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputUsername = sanitizeInput(document.getElementById("loginUsername").value.trim());
  const inputPassword = document.getElementById("loginPassword").value;
  const csrfTokenInput = document.getElementById("csrfTokenLogin").value;
  const savedUser = JSON.parse(localStorage.getItem("user"));

  // CSRF Check
  if (!validateCSRFToken(csrfTokenInput)) {
    showMessage("Invalid CSRF token");
    return;
  }

  if (!savedUser) {
    showMessage("No registered user found");
    return;
  }

  // Hash input password for comparison
  const hashedInputPassword = await hashPassword(inputPassword);

  if (
    savedUser &&
    (savedUser.username === inputUsername || savedUser.email === inputUsername) &&
    savedUser.password === hashedInputPassword
  ) {
    showMessage("Login successful! Redirecting...", "green");

    const token = generateCSRFToken();
    if (document.getElementById("rememberMe").checked) {
      localStorage.setItem("sessionToken", token); // Persistent
    } else {
      sessionStorage.setItem("sessionToken", token); // Temporary
    }

    setTimeout(() => {
      window.location.href = "pages/dashboard.html";
    }, 1500);
  } else {
    showMessage("Invalid credentials");
  }
});

// ===== Password Hashing =====
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ===== Message Display =====
function showMessage(msg, color = "red") {
  const formMessage = document.getElementById("formMessage");
  formMessage.textContent = msg;
  formMessage.style.color = color;
}
