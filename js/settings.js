document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settingsForm");
  const themeSelect = document.getElementById("theme");
  const saveMsg = document.getElementById("saveMsg");
  const avatarInput = document.getElementById("avatar");

  // Avatar preview container
  const avatarPreview = document.createElement("img");
  avatarPreview.id = "avatarPreview";
  avatarPreview.style.maxWidth = "100px";
  avatarPreview.style.borderRadius = "50%";
  avatarInput.insertAdjacentElement("afterend", avatarPreview);

  // Load saved settings if any
  const savedSettings = JSON.parse(localStorage.getItem("userSettings"));
  if (savedSettings) {
    document.getElementById("username").value = savedSettings.username || "";
    document.getElementById("email").value = savedSettings.email || "";
    themeSelect.value = savedSettings.theme || "light";
    document.getElementById("notifications").checked = savedSettings.notifications || false;

    if (savedSettings.avatar) {
      avatarPreview.src = savedSettings.avatar;
    }
  }
  function saveSettings(settings) {
  localStorage.setItem("userSettings", JSON.stringify(settings));



  // Apply theme immediately
  applyTheme(settings.theme);

  saveMsg.textContent = "Settings saved successfully!";
  setTimeout(() => {
    saveMsg.textContent = "";
  }, 3000);
}


  // Show avatar preview on file selection
  avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        avatarPreview.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const theme = themeSelect.value;
    const notifications = document.getElementById("notifications").checked;

    if (username.length < 3) {
      alert("Username must be at least 3 characters long.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const userSettings = {
      username,
      email,
      theme,
      notifications
    };

    // Save avatar if selected
    const avatarFile = avatarInput.files[0];
    if (avatarFile) {
      const reader = new FileReader();
      reader.onload = () => {
        userSettings.avatar = reader.result;
        saveSettings(userSettings);
      };
      reader.readAsDataURL(avatarFile);
    } else {
      // Keep existing avatar if none selected
      if (savedSettings?.avatar) {
        userSettings.avatar = savedSettings.avatar;
      }
      saveSettings(userSettings);
    }
  });

  function saveSettings(settings) {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    saveMsg.textContent = "Settings saved successfully!";
    setTimeout(() => {
      saveMsg.textContent = "";
    }, 3000);
  }
});
