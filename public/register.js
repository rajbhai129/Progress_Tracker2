document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const errorMessage = document.createElement("div");
  errorMessage.style.color = "red";
  registerForm.appendChild(errorMessage);

  const API_URL = 
    process.env.NEXT_PUBLIC_API_URL || "https://progress-tracker-1mb9.onrender.com"; // Use Render backend URL

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMessage.textContent = "";

    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData);

    if (data.password !== data["confirm-password"]) {
      errorMessage.textContent = "Passwords do not match";
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {  // Use full API URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // Ensures cookies (session) are sent
      });

      const result = await response.json();

      if (response.ok) {
        window.location.href = "/login"; // Redirect after successful registration
      } else {
        errorMessage.textContent = result.error || "Registration failed";
      }
    } catch (error) {
      console.error("Error:", error);
      errorMessage.textContent = "An error occurred during registration";
    }
  });
});
