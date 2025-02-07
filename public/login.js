document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch(`${window.location.origin}/login`, {  // Auto-detects environment
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"  // 🔥 Ensures session cookies are sent
      });

      if (response.ok) {
        console.log("✅ Login successful, redirecting...");
        window.location.href = "/dashboard";
      } else {
        const errorData = await response.json();
        console.warn("❌ Login failed:", errorData.error);
        alert(errorData.error || "Invalid username or password.");
      }
    } catch (error) {
      console.error("⚠️ Network or server error:", error);
      alert("Server error. Please try again.");
    }
  });
});
