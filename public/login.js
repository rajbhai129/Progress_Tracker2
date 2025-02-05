document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const API_URL = 
    process.env.NEXT_PUBLIC_API_URL || "https://progress-tracker-1mb9.onrender.com"; // Use Render backend URL

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch(`${API_URL}/login`, {  // Use full API URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // Ensures cookies (session) are sent
      });

      if (response.ok) {
        window.location.href = "/dashboard";
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during login");
    }
  });
});
